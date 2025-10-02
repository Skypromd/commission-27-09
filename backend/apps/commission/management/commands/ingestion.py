import csv
from decimal import Decimal
from datetime import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from apps.advisers.models import Adviser
from apps.commission.models import Commission
from apps.products.models import Product
from apps.policies.models import Policy

User = get_user_model()

class Command(BaseCommand):
    """
    Команда для загрузки данных о комиссиях и полисах из CSV.
    Предполагается, что в CSV есть колонки:
    policy_number, adviser_username, product_name, provider,
    gross_commission, net_commission, date_received
    """
    help = "Загружает данные о транзакциях из CSV файла"

    def handle(self, *args, **options):
        # Укажите правильный путь к вашему файлу
        file_path = "C:\\Users\\piese\\PcharmProjects\\commission-tracker\\data\\commissions.csv"
        self.stdout.write(self.style.SUCCESS(f"Начинаем имп��рт из {file_path}"))

        with open(file_path, "r", encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    # 1. Находим консультанта (пропускаем, если не найден)
                    adviser = Adviser.objects.get(user__username=row["adviser_username"])

                    # 2. Находим или создаем продукт
                    product, _ = Product.objects.get_or_create(name=row["product_name"])

                    # 3. Находим или создаем полис
                    policy, created = Policy.objects.get_or_create(
                        policy_number=row["policy_number"],
                        defaults={
                            'adviser': adviser,
                            'provider': row["provider"],
                            'date_issued': datetime.strptime(row["date_received"], "%Y-%m-%d").date(),
                        }
                    )
                    if created:
                        self.stdout.write(f"Созда�� полис: {policy.policy_number}")

                    # 4. Создаем или обновляем комиссию
                    commission, created = Commission.objects.update_or_create(
                        policy=policy,
                        defaults={
                            'product': product,
                            'adviser': adviser,
                            'gross_commission': Decimal(row["gross_commission"]),
                            'net_commission': Decimal(row["net_commission"]),
                            'adviser_fee_percentage': adviser.fee_percentage,
                            'date_received': policy.date_issued,
                            'commission_type': Commission.CommissionType.DIRECT,
                            'payment_status': Commission.PaymentStatus.PENDING,
                        }
                    )

                    action = "Создана" if created else "Обновлена"
                    self.stdout.write(f"{action} комиссия для полиса {policy.policy_number}")

                except Adviser.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f'Пропущен: Консультант "{row["adviser_username"]}" не найден.'))
                    continue
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Ошибка в строке {reader.line_num}: {e}'))

        self.stdout.write(self.style.SUCCESS("Импорт завершен."))
