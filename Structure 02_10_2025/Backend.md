backend/
├── apps/
│   ├── advisers/
│   │   ├── migrations/
│   │   │   ├── __init__.py
│   │   │   └── 0001_initial.py
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── api_views.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── signals.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── api_keys/
│   │   ├── migrations/
│   │   │   └── 0001_initial.py
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── authentication.py
│   │   ├── models.py
│   │   └── tests.py
│   ├── audit/
│   │   ├── migrations/
│   │   │   └── 0001_initial.py
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── bi_analytics/
│   │   ├── __init__.py
│   │   ├── services.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── clients/
│   │   ├── migrations/
│   │   │   ├── __init__.py
│   │   │   ├── 0001_initial.py
│   │   │   └── 0002_client_refactor.py
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── api_views.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── commission/
│   │   ├── management/
│   │   │   ├── commands/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── create_admin.py
│   │   │   │   └── ingestion.py
│   │   │   └── __init__.py
│   │   ├── migrations/
│   │   │   └── __init__.py
│   │   ├── templates/
│   │   │   ├── commission/
│   │   │   │   ├── email/
│   │   │   │   │   └── report_template.txt
│   │   │   └── __init__.py
│   │   ├── tests/
│   │   │   ├── __init__.py
│   │   │   ├── test_api.py
│   │   │   ├── test_rules_engine.py
│   │   │   └── test_tasks.py
│   │   ├── __init__.py
│   │   ├── achievements_engine.py
│   │   ├── admin.py
│   │   ├── api_views.py
│   │   ├── apps.py
│   │   ├── consumers.py
│   │   ├── forms.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── routing.py
│   │   ├── rules_engine.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── signals.py
│   │   ├── tasks.py
│   │   ├── test_services.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── filters.py
│   │   ├── mixins.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── deals/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── api_views.py
│   │   ├── apps.py
│   │   ├── mixins.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── signals.py
│   │   └── urls.py
│   ├── insurances/
│   │   ├── migrations/
│   │   │   ├── __init__.py
│   │   │   └── 0001_initial.py
│   │   ├── tests/
│   │   │   ├── __init__.py
│   │   │   ├── test_api.py
│   │   │   ├── test_ingestion.py
│   │   │   ├── test_modifiers.py
│   │   │   ├── test_policies.py
│   │   │   ├── test_reports.py
│   │   │   └── test_tasks.py
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── api_views.py
│   │   ├── apps.py
│   │   ├── ARCHITECTURE.md
│   │   ├── filters.py
│   │   ├── ingestion.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── signals.py
│   │   ├── tasks.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── mortgage/
│   │   ├── migrations/
│   │   │   ├── 0002_auto_20240801_1000.py
│   │   │   ├── 0002_mortgagecase_product_type.py
│   │   │   └── 0003_mortgagecase_case_number.py
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── api_views.py
│   │   ├── apps.py
│   │   ├── filters.py
│   │   ├── models.py
│   │   ├── Mortgages Commission Module Architecture.md
│   │   ├── permissions.py
│   │   ├── reports.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── signals.py
│   │   ├── tasks.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── notifications/
│   │   ├── migrations/
│   │   │   └── 0001_initial.py
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tasks.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── policies/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── products/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── api_views.py
│   │   ├── apps.py
│   │   ├── filters.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── reports/
│   │   ├── migrations/
│   │   │   ├── 0001_initial.py
│   │   │   └── 0002_report_status_report_task_id_alter_report_data.py
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── filters.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── tasks.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── sales/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── api_views.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── tasks/
│   │   ├── __init__.py
│   │   ├── api_views.py
│   │   └── urls.py
│   └── users/
│       ├── migrations/
│       │   ├── 0002_user_role.py
│       │   └── 0003_user_agency.py
│       ├── __init__.py
│       ├── admin.py
│       ├── api_views.py
│       ├── apps.py
│       ├── models.py
│       ├── permissions.py
│       ├── serializers.py
│       ├── services.py
│       ├── tests.py
│       ├── urls.py
│       └── views.py
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── celery.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── data/
│   ├── db.sqlite3
│   └── fixtures/
│       ├── initial_data.json
│       └── user_roles.json
├── templates/
│   ├── admin/
│   │   ├── base_site.html
│   │   └── custom_dashboard.html
│   ├── base.html
│   ├── index.html
│   └── registration/
│       └── login.html
├── __init__.py
├── Dockerfile
├── manage.py
├── PRODUCTION_CHECKLIST.md
├── requirements.txt
├── ROLES_AND_PERMISSIONS.md

# Полная структура Backend проекта

Этот документ детально описывает **полную** структуру Django backend проекта, основанную на предоставленных файловых путях. Каждая директория и файл указаны для максимально полного понимания организации проекта.

## Описание директорий (согласно предоставленным данным)

- `/backend` - **Корневая директория бэкенд-приложения.** Содержит весь код и конфигурацию Django проекта.
    - `├── apps` - **Коллекция Django-приложений**: Каждая поддиректория здесь представляет собой отдельное, изолированное Django-приложение, отвечающее за конкретную бизнес-логику (например, пользователи, продукты, отчеты).
        - `advisers` - Управление консультантами, их данными и логикой.
        - `api_keys` - Управление API-ключами.
        - `audit` - Ведение аудита действий.
        - `bi_analytics` - Бизнес-аналитика.
        - `clients` - Управление клиентской базой, их профилями и взаимодействиями.
        - `commission` - Логика расчета и учета комиссионных.
        - `core` - Базовое (основное) приложение с общими моделями, утилитами, миксинами и разрешениями.
        - `deals` - Управление сделками, их статусами и атрибутами.
        - `insurances` - Управление страховыми полисами.
        - `mortgage` - Управление ипотечными продуктами.
        - `notifications` - Система уведомлений.
        - `policies` - Управление политиками/правилами.
        - `products` - Управление каталогом продуктов/услуг.
        - `reports` - Генерация и хранение различных отчетов.
        - `sales` - Логика, связанная с продажами и их обработкой.
        - `tasks` - Фоновые задачи (например, Celery).
        - `users` - Управление пользователями и их ролями.
        - В каждом приложении обычно есть:
            - `migrations` - Папка для файлов миграций базы данных.
            - `__init__.py` - Инициализирующий файл Python для пакета.
            - `admin.py` - Регистрация моделей в Django Admin.
            - `apps.py` - Конфигурация приложения Django.
            - `models.py` - Определения моделей данных для приложения.
            - `views.py` - Логика обработки запросов и формирования ответов (API-представления или HTML-представления).
            - `serializers.py` - Сериализаторы для REST API.
            - `urls.py` - URL-маршруты для приложения.
            - `tests.py` - Модульные и интеграционные тесты для приложения.
            - `services.py` - Бизнес-логика, не относящаяся напрямую к моделям или представлениям.
            - `signals.py` - Обработчики сигналов Django.
            - `permissions.py` - Пользовательские разрешения для API.
    - `├── config` - **Основная конфигурация проекта**: Содержит глобальные настройки Django проекта.
        - `__init__.py` - Инициализирующий файл Python.
        - `asgi.py` - Конфигурация для ASGI-серверов (например, для WebSocket).
        - `celery.py` - Конфигурация для Celery.
        - `settings.py` - Главный файл настроек Django (база данных, установленные приложения, middleware).
        - `urls.py` - Корневой файл маршрутов URL проекта, который включает URL-ы из различных приложений.
        - `wsgi.py` - Конфигурация для WSGI-совместимых веб-серверов.
    - `├── data` - **Данные и статические файлы**:
        - `db.sqlite3` - Файл базы данных SQLite (обычно используется для разработки).
        - `fixtures` - Директория для фикстур данных.
            - `initial_data.json` - Начальные данные для базы данных.
            - `user_roles.json` - Фикстуры для ролей пользователей.
    - `├── templates` - **Глобальные HTML-шаблоны**: Используются Django для рендеринга страниц.
        - `admin` - Шаблоны для кастомизации административной панели Django.
            - `base_site.html` - Базовый шаблон для административной панели.
            - `custom_dashboard.html` - Пользовательский шаблон для дашборда администратора.
        - `index.html` - Основной HTML-шаблон.
        - `base.html` - Базовый шаблон.
        - `registration` - Шаблоны для аутентификации.
            - `login.html` - Шаблон страницы входа.
    - `├── __init__.py` - Инициализирующий файл Python для корневого пакета `backend`.
    - `├── Dockerfile` - **Dockerfile**: Инструкции для сборки Docker-образа приложения.
    - `├── manage.py` - **Утилита Django**: Командный скрипт для выполнения операций над проектом (запуск сервера, миграции).
    - `├── PRODUCTION_CHECKLIST.md` - Документ с контрольным списком для развертывания в production.
    - `├── requirements.txt` - **Зависимости Python**: Список всех Python-библиотек, необходимых для проекта.
    - `├── ROLES_AND_PERMISSIONS.md` - Документация, описывающая систему ролей и разрешений.
    - `└── STRUCTURE.md` - Этот файл с описанием структуры проекта.

## Полная структура файлов (согласно предоставленным данным)