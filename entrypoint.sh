#!/bin/sh

# Применение миграций базы данных
echo "Applying database migrations..."
python manage.py migrate

# Сбор статических файлов
echo "Collecting static files..."
python manage.py collectstatic --no-input

# Запуск Gunicorn
echo "Starting Gunicorn..."
exec gunicorn --bind 0.0.0.0:8000 --workers 3 uk_commission_admin_panel.wsgi:application