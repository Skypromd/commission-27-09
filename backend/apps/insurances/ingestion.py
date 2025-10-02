import csv
from io import StringIO
from decimal import Decimal, InvalidOperation
from django.db import transaction
from .models import Policy, Commission, InsuranceType

def process_insurance_commission_statement_logic(file_content_string):
    """
    Обрабатывает CSV-файл с комиссиями в рамках одной транзакции.
    Использует DictReader, ожидает заголовки: policy_number, gross_commission, date_received.
    `gross_commission` является опциональным.
    """
    # Используем DictReader для работы с заголовками
    reader = csv.DictReader(StringIO(file_content_string))
    processed_count = 0
    errors = []

    required_headers = ['policy_number', 'date_received']
    if not all(header in reader.fieldnames for header in required_headers):
        return {'processed': 0, 'errors': [f"Отсутствуют обязательные заголовки в CSV файле. Требуются: {', '.join(required_headers)}."], 'status': 'failed'}

    try:
        with transaction.atomic():
            for i, row in enumerate(reader):
                line_num = i + 2  # +2, т.к. DictReader начинает после заголовка
                try:
                    policy_number = row.get('policy_number', '').strip()
                    if not policy_number:
                        raise ValueError("Отсутствует обязательное значение 'policy_number'.")

                    policy = Policy.objects.select_related('insurer', 'insurance_type').get(policy_number=policy_number)

                    gross_commission_str = row.get('gross_commission', '').strip()

                    # --- Интеллектуальный расчет комиссии ---
                    if gross_commission_str:
                        gross_commission = Decimal(gross_commission_str)
                    else:
                        # Если комиссия не указана, рассчитываем ее автоматически
                        rate = policy.insurance_type.default_gross_commission_rate or policy.insurer.default_gross_commission_rate
                        if not policy.annual_premium_value or not rate:
                            raise ValueError("Невозможно рассчитать комиссию: отсутствует 'gross_commission' в файле и/или APV/ставка в полисе.")
                        gross_commission = policy.annual_premium_value * (rate / Decimal(100))

                    date_received = row.get('date_received', '').strip()
                    if not date_received:
                        raise ValueError("Отсутствует обязательное значение 'date_received'.")

                    # Логика расчета net_commission
                    net_rate = policy.insurance_type.default_net_rate or policy.insurer.default_net_rate
                    net_commission = gross_commission * (net_rate / Decimal(100))

                    # Получаем процент вознаграждения из модели Adviser
                    if not policy.adviser:
                        raise ValueError(f"Для полиса {policy.policy_number} не назначен консультант (Adviser).")
                    adviser_fee_percentage = policy.adviser.default_fee_percentage

                    # Создаем или обновляем комиссию
                    commission, created = Commission.objects.update_or_create(
                        policy=policy,
                        defaults={
                            'gross_commission': gross_commission,
                            'net_commission': net_commission,
                            'adviser_fee_percentage': adviser_fee_percentage,
                            'date_received': date_received,
                            'payment_status': Commission.PaymentStatus.PENDING,
                        }
                    )
                    processed_count += 1

                except Policy.DoesNotExist:
                    errors.append(f"Строка {line_num}: Полис с номером '{policy_number}' не найден.")
                except (ValueError, InvalidOperation) as e:
                    errors.append(f"Строка {line_num}: Ошибка данных - {e}")

        if errors:
            return {'processed': processed_count, 'errors': errors, 'status': 'partial_success'}

    except Exception as e:
        return {'processed': 0, 'errors': [f"Критическая ошибка: {e}. Все изменения отменены."], 'status': 'failed'}

    return {'processed': processed_count, 'errors': [], 'status': 'success'}
