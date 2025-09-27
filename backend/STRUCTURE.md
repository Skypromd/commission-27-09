# Реальная структура вашего бэкенда

backend/
├── apps/
│   ├── advisers/                # Управление консультантами
│   │   ├── __init__.py
│   │   ├── admin.py             # Админка для Adviser
│   │   ├── api_views.py         # DRF API для Adviser
│   │   ├── apps.py              # Конфиг приложения
│   │   ├── models.py            # Модель Adviser
│   │   ├── serializers.py       # Сериализаторы Adviser
│   │   ├── tests.py             # Тесты Adviser
│   │   ├── urls.py              # Маршруты Adviser
│   │   └── views.py             # Веб-представления Adviser
│   ├── commission/              # Управление комиссиями
│   │   ├── __init__.py
│   │   ├── admin.py             # Админка для Commission
│   │   ├── api_views.py         # DRF API для Commission
│   │   ├── apps.py              # Конфиг приложения
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── ingestion.py # Команда импорта комиссий
│   │   ├── models.py            # Модели комиссий
│   │   ├── serializers.py       # Сериализаторы комиссий
│   │   ├── tests.py             # Тесты комиссий
│   │   ├── urls.py              # Маршруты комиссий
│   │   └── views.py             # Веб-представления комиссий
│   ├── policies/                # Управление страховыми полисами
│   │   ├── __init__.py
│   │   ├── admin.py             # Админка для Policy
│   │   ├── apps.py              # Конфиг приложения
│   │   ├── models.py            # Модель Policy
│   │   ├── serializers.py       # Сериализаторы Policy
│   │   ├── tests.py             # Тесты Policy
│   │   ├── urls.py              # Маршруты Policy
│   │   └── views.py             # Веб-представления Policy
│   ├── products/                # Управление продуктами
│   │   ├── __init__.py
│   │   ├── admin.py             # Админка для Product
│   │   ├── apps.py              # Конфиг приложения
│   │   ├── models.py            # Модель Product
│   │   ├── serializers.py       # Сериализаторы Product
│   │   ├── tests.py             # Тесты Product
│   │   ├── urls.py              # Маршруты Product
│   │   └── views.py             # Веб-представления Product
│   ├── core/                    # Общие разрешения и базовые классы
│   │   ├── __init__.py
│   │   ├── apps.py              # Конфиг приложения
│   │   └── permissions.py       # Кастомные разрешения DRF
│   ├── api_keys/                # Аутентификация по API-ключам
│   │   ├── __init__.py
│   │   ├── admin.py             # Админка для API-ключей
│   │   ├── apps.py              # Конфиг приложения
│   │   ├── authentication.py    # Кастомная аутентификация
│   │   ├── models.py            # Модель API-ключа
│   │   └── tests.py             # Тесты API-ключей
│   ├── bi_analytics/            # BI-аналитика и отчеты
│   │   ├── __init__.py
│   │   ├── apps.py              # Конфиг приложения
│   │   ├── services.py          # Сервисы для аналитики
│   │   ├── tests.py             # Тесты аналитики
│   │   ├── urls.py              # Маршруты аналитики
│   │   └── views.py             # API для аналитики
│   ├── insurances/              # Управление страховыми продуктами
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── mortgage/                # Управление ипотечными продуктами
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
├── __init__.py
├── settings.py                  # Настройки Django
├── urls.py                      # Корневые маршруты
├── wsgi.py                      # WSGI-запуск
├── asgi.py                      # ASGI-запуск

# Описание

- Каждый модуль (приложение) отвечает за свою бизнес-область.
- В commission/ реализована команда импорта данных.
- В bi_analytics/ — сервисы и тесты для BI-отчетности.
- В core/ — общие разрешения для DRF.
- В api_keys/ — кастомная аутентификация.
- В каждом приложении есть тесты, сериализаторы, модели, маршруты и админка.
- Корневые файлы отвечают за запуск и конфигурацию проекта.

# Как вывести структуру вашего бэкенда

Откройте командную строку (cmd) и выполните:

```
tree /F /A C:\Users\piese\PcharmProjects\commission-tracker\backend
```

- `/F` — показать файлы
- `/A` — использовать ASCII-символы для структуры

Это выведет полную и актуальную структуру всех папок и файлов вашего бэкенда.
