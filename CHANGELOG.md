# Журнал Изменений Проекта (CHANGELOG)

## 2025-10-02

### Добавлено
- Создан файл `backend/apps/insurances/tests/test_services.py` для юнит-тестирования сервисной логики модуля страхования.
  - Добавлены тесты для `create_commission_for_policy`, проверяющие:
    - Корректное создание основной комиссии и `Override` комиссии при наличии родительского консультанта.
    - Отсутствие `Override` комиссии, если родительский консультант отсутствует.
    - Отсутствие создания комиссии при отсутствии `annual_premium_value` у полиса.
    - Корректное возвращение существующей комиссии, если она уже была создана.
- Добавлены юнит-тесты для `handle_policy_cancellation_service`, проверяющие:
  - Корректное создание `Clawback` объектов для основной комиссии и `Override` комиссии при отмене полиса.
  - Изменение статуса основной комиссии на `CLAWBACK`.
  - Отсутствие создания `Clawback`, если у полиса нет связанной комиссии.
  - Идемпотентность функции (повторный вызов не создает дубликаты `Clawback`).

### Изменено
- Обновлена функция `create_commission_for_policy` в `backend/apps/insurances/services.py` для расчета и сохранения `adviser_fee_amount` в объекте `Commission`.
- Обновлен тест `test_handle_policy_cancellation_creates_clawbacks` в `backend/apps/insurances/tests/test_services.py` для проверки корректности значения `adviser_clawback.amount`.
