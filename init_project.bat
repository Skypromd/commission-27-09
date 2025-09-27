@echo off
chcp 65001 > nul
echo ===================================
echo ==  ИНИЦИАЛИЗАЦИЯ DJANGO ПРОЕКТА ==
echo ===================================
cd /d "%~dp0"

if exist manage.py (
    echo [!] Проект Django уже существует ('manage.py' найден).
    echo     Нет необходимости запускать этот скрипт снова.
    pause
    exit /b
)

echo.
echo --- Активация виртуальной среды ---
if not exist venv\Scripts\activate.bat (
    python -m venv venv
)
call venv\Scripts\activate.bat

echo.
echo --- Установка зависимостей ---
pip install -r requirements.txt

echo.
echo --- Создание структуры проекта Django ---
django-admin startproject backend .
echo [+] Файл 'manage.py' и папка 'backend' успешно созданы.

echo.
echo ===================================
echo ==    ИНИЦИАЛИЗАЦИЯ ЗАВЕРШЕНА    ==
echo ===================================
echo.
echo Теперь вы можете запустить проект с помощью 'run.bat'.
pause
