@echo off
chcp 65001 >nul
title 🚨 ЭКСТРЕННЫЙ ЗАПУСК DJANGO BACKEND 🚨
color 0C

echo.
echo 🚨============================================🚨
echo    ЭКСТРЕННЫЙ ЗАПУСК DJANGO BACKEND
echo 🚨============================================🚨
echo.
echo 🔥 Автоматический запуск Django сервера...
echo 📡 Порт: 8000
echo 🌐 URL: http://127.0.0.1:8000
echo.

rem Убиваем процессы на порту 8000
echo 💀 Очистка порта 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do (
    echo    - Завершаю процесс с PID %%a...
    taskkill /f /pid %%a >nul 2>&1
)
echo [+] Порт 8000 свободен.
timeout /t 1 /nobreak >nul

rem Проверяем ключевой файл Django
if not exist "manage.py" (
    echo ❌ Файл manage.py не найден!
    echo 💡 Запустите скрипт из корня проекта.
    pause
    exit /b 1
)

rem Активируем виртуальное окружение
echo.
echo --- Активация виртуальной среды ---
if not exist venv\Scripts\activate.bat (
    echo [!] Виртуальная среда 'venv' не найдена.
    echo     Пожалуйста, запустите 'run.bat' для полной настройки.
    pause
    exit /b
)
call venv\Scripts\activate.bat
echo [+] Виртуальная среда активирована.

echo.
echo --- Применение миграций базы данных ---
python manage.py migrate
if errorlevel 1 (
    echo [!] Ошибка при применении миграций. Сервер может работать некорректно.
) else (
    echo [+] Миграции успешно применены.
)

echo.
echo 🚀 Запуск Django сервера...
start "Django Backend Server" python manage.py runserver

:success
echo.
echo ✅================================✅
echo    BACKEND СЕРВЕР ЗАПУСКАЕТСЯ!
echo ✅================================✅
echo.
echo 🌐 Доступные URL:
echo    • Админ-панель: http://127.0.0.1:8000/admin
echo    • API (если настроено): http://127.0.0.1:8000/api/
echo.
echo ⏱️  Подождите 5 секунд для полного запуска...
timeout /t 5 /nobreak >nul

rem Открываем браузер
echo 🚀 Открытие админ-панели в браузере...
start "" "http://127.0.0.1:8000/admin"

echo.
echo 🎉 BACKEND ЗАПУЩЕН!
echo.
pause
