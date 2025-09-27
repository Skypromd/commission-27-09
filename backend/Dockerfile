# Используем официальный образ Python 3.12
FROM python:3.12-slim

# Устанавливаем переменные окружения
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Указываем /app как корень для импортов
ENV PYTHONPATH=/app

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл зависимостей из папки backend (т.к. контекст сборки теперь - корень проекта)
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код бэкенда в подпапку /app/backend
COPY backend/ /app/backend/

# Открываем порт
EXPOSE 8000

# Запускаем gunicorn с полным путем к wsgi-приложению
CMD ["gunicorn", "backend.config.wsgi:application", "--bind", "0.0.0.0:8000"]