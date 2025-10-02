# Стандарт названий переменных для UK Commission Admin Panel

## 📋 ЕДИНЫЕ СТАНДАРТЫ ИМЕНОВАНИЯ ПЕРЕМЕННЫХ

### 🔑 ОСНОВНЫЕ ID ПОЛЯ:
```
id - первичный ключ (во всех таблицах)
user_id - внешний ключ на пользователя
client_id - внешний ключ на клиента
adviser_id - внешний ключ на консультанта
commission_id - внешний ключ на комиссию
process_id - внешний ключ на процесс
permission_id - внешний ключ на разрешение
provider_id - внешний ключ на поставщика продуктов
product_id - внешний ключ на продукт
```

### ⏰ ВРЕМЕННЫЕ ПОЛЯ (во всех моделях):
```
created_at - дата создания записи
updated_at - дата последнего обновления
deleted_at - дата удаления (для soft delete)
due_date - срок выполнения/оплаты
paid_date - дата оплаты
start_date - дата начала
end_date - дата окончания
last_login - последний вход пользователя
```

### 🔐 ПОЛЯ АУТЕНТИФИКАЦИИ:
```
username - имя пользователя (НЕ user_name)
email - электронная почта
hashed_password - хешированный пароль (НЕ password_hash)
role - роль пользователя
is_active - статус активности пользователя
```

### 💰 ФИНАНСОВЫЕ ПОЛЯ:
```
amount - сумма (основная)
commission_rate - ставка комиссии
annual_income - годовой доход
monthly_expenses - ежемесячные расходы
total_assets - общие активы
total_liabilities - общие обязательства
```

### 📞 КОНТАКТНЫЕ ПОЛЯ:
```
first_name - имя (НЕ firstName)
last_name - фамилия (НЕ lastName)
full_name - полное имя
phone - телефон (НЕ phone_number)
address - адрес
postcode - почтовый индекс
```

### 📊 СТАТУСНЫЕ ПОЛЯ:
```
status - статус записи (enum)
is_active - активность записи (boolean)
is_deleted - удалена ли запись (boolean)
priority - приоритет
```

### 🏢 БИЗНЕС ПОЛЯ:
```
service_type - тип услуги
commission_type - тип комиссии
product_type - тип продукта
insurance_type - тип страхования
application_status - статус заявки
```

## ⚠️ ВАЖНЫЕ ПРАВИЛА:

1. **Все названия на английском языке**
2. **Используем snake_case (подчеркивания)**
3. **Не используем camelCase или PascalCase для полей БД**
4. **Boolean поля начинаются с is_**
5. **ID поля всегда заканчиваются на _id (кроме первичного ключа)**
6. **Временные поля всегда заканчиваются на _at или _date**
7. **Enum поля имеют суффикс _type или _status**

## ✅ ПРАВИЛЬНЫЕ ПРИМЕРЫ:
```python
# Модель User
id = Column(Integer, primary_key=True)
username = Column(String(50))
hashed_password = Column(String(255))
is_active = Column(Boolean, default=True)
created_at = Column(DateTime(timezone=True))

# Модель Commission
id = Column(Integer, primary_key=True)
client_id = Column(Integer, ForeignKey("clients.id"))
adviser_id = Column(Integer, ForeignKey("users.id"))
commission_type = Column(SQLEnum(CommissionType))
status = Column(SQLEnum(CommissionStatus))
due_date = Column(Date)
created_at = Column(DateTime(timezone=True))
```

## ❌ НЕПРАВИЛЬНЫЕ ПРИМЕРЫ:
```python
# НЕ ИСПОЛЬЗУЙТЕ:
password_hash  # ❌ Используйте hashed_password
user_name      # ❌ Используйте username
firstName      # ❌ Используйте first_name
isActive       # ❌ Используйте is_active
createdAt      # ❌ Используйте created_at
userId         # ❌ Используйте user_id
```

---
**Дата создания**: 2025-01-08
**Версия**: 1.0
**Статус**: Обязательно для исполнения во всех компонентах проекта
