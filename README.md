# Commission Tracker

🏆 **Enterprise-Grade Commission Management System** - Полнофункциональная система управления комиссиями с современной архитектурой

**Автор:** Ianioglo Vladimir
**Email:** skypromd@gmail.com
**GitHub:** https://github.com/Skypromd/uk-commission-admin-panel

## 🚀 Особенности

- **Django & DRF Backend** - Надежный и масштабируемый REST API на базе Django Rest Framework.
- **Гибридный Frontend** - Сочетание серверного рендеринга Django Templates для быстрой разработки админ-панели и **React** для интерактивных дашбордов.
- **Django Admin** - Мощный, готовый к использованию интерфейс для управления данными.
- **AI/ML Analytics** - Предсказание комиссий и анализ клиентов.
- **PostgreSQL Database** - Надежное хранение данных.
- **Docker Support** - Контейнеризация для развертывания.
- **Audit System** - Полное логирование действий с помощью встроенных средств Django.
- **CI/CD Pipeline** - Автоматизированная разработка и деплой.

## 📁 Структура проекта

```
uk-commission-admin-panel/
├── backend/          # Django приложение
│   └── requirements.txt
├── frontend/         # React приложение
├── nginx/            # Конфигурация Nginx
├── scripts/          # Скрипты для развертывания
├── tests/            # Тесты системы
├── venv/             # Виртуальное окружение Python
└── run.bat           # Скрипт для быстрого запуска
```

## 🛠️ Быстрый запуск (Windows)

### 1. Автоматическая установка

Для простого запуска проекта используйте скрипт `run.bat` в корневой директории. Он автоматически создаст виртуальное окружение, установит зависимости и выведет инструкции для запуска серверов.

```bash
run.bat
```

### 2. Ручная установка

#### Предварительные требования
- Python 3.9+
- Node.js 16+
- PostgreSQL 12+

#### Backend
# 1. Создайте и активируйте виртуальное окружение (только venv)

Виртуальное окружение позволяет изолировать зависимости проекта. Используйте только имя venv для окружения.

Если ранее создавалось другое окружение (например, .venv), удалите его:
```bash
# Деактивируйте окружение, если оно активно
 deactivate
# Удалите старое окружение
 rmdir /s /q venv
```

Создайте новое окружение:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate
# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

# 2. Установите зависимости
pip install -r backend/requirements.txt

# 3. Настройте .env (см. раздел "Конфигурация")

# 4. Примените миграции
cd backend
python manage.py migrate

# 5. Запустите сервер
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev
```

## 🐳 Docker

```bash
docker-compose up -d
```

## 🔧 Устранение неполадок

### Ошибка `FileNotFoundError` при установке пакетов (SSL/TLS)

Если вы сталкиваетесь с ошибкой `FileNotFoundError`, связанной с `ssl` или `requests` во время выполнения `pip install`, это указывает на проблему с доступом к SSL-сертификатам в вашей основной установке Python.

Скрипт `run.bat` пытается обойти эту проблему, используя `--trusted-host` для `pip`. Если ошибка все равно возникает при ручной установке, используйте следующую команду:

```bash
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r backend/requirements.txt
```

Если проблема сохраняется, рекомендуется **полностью переустановить Python**, убедившись, что во время установки выбрана опция "Add Python to PATH".

### Поврежденное виртуальное окружение

Если ваше виртуальное окружение кажется поврежденным по другим причинам, вы можете пересоздать его:

1.  **Удалите поврежденное виртуальное окружение.**
    (Убедитесь, что вы находитесь в корневой папке проекта)

    ```bash
    # Деактивируйте окружение, если оно активно
    deactivate
    # Удалите папку
    rmdir /s /q venv
    ```

2.  **Повторите шаги из раздела "Ручная установка"** для создания нового окружения и установки зависимостей.

## 📊 API Documentation

Для генерации документации используется `drf-spectacular`. После запуска сервера, документация API доступна по следующим адресам:

- **Swagger UI**: http://localhost:8000/api/v1/schema/swagger-ui/
- **ReDoc**: http://localhost:8000/api/v1/schema/redoc/
- **Schema File**: http://localhost:8000/api/v1/schema/

## 🔧 Конфигурация

Создайте файл `.env` в папке `backend/`:

```env
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key
DEBUG=True
```

## 🧪 Тестирование

```bash
# Убедитесь, что виртуальное окружение активировано
cd backend
python manage.py test
```

## 📝 Лицензия

MIT License

## 👥 Команда разработки

Создано с ❤️ для эффективного управления комиссиями.
