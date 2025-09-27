@echo off
setlocal

echo ###################################################
echo #    UK Commission Admin Panel Runner             #
echo ###################################################
echo.

REM --- Проверка наличия Python ---
echo [+] Checking for Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] ERROR: Python is not installed or not in PATH.
    echo Please install Python 3.9+ and try again.
    goto :eof
)
echo Python found.
echo.

REM --- Создание/проверка виртуального окружения ---
if not exist venv (
    echo [+] Creating virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo [!] ERROR: Failed to create virtual environment.
        goto :eof
    )
    echo [+] Virtual environment created.
) else (
    echo [+] Virtual environment 'venv' already exists.
)
echo.

REM --- Активация и установка зависимостей ---
echo [+] Activating virtual environment and installing dependencies...
call venv\Scripts\activate
python -m pip install --upgrade pip >nul
REM Using --trusted-host to bypass potential SSL verification issues on misconfigured systems.
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r backend/requirements.txt

if %errorlevel% neq 0 (
    echo.
    echo [!] ERROR: Failed to install dependencies.
    echo Please check your connection or backend/requirements.txt.
    goto :eof
)
echo [+] Dependencies are up to date.
echo.

REM --- Проверка конфигурации ---
if not exist backend\.env (
    echo [!] WARNING: Configuration file 'backend\.env' not found.
    echo Please create it based on the README to connect to the database.
    echo.
)

REM --- Миграции ---
echo [+] Applying database migrations...
cd backend
python manage.py migrate
cd ..
echo.

echo ###################################################
echo #              SETUP COMPLETE!                    #
echo ###################################################
echo.

set /p "runserver=Do you want to start the Django development server now? (y/n): "
if /i "%runserver%"=="y" (
    echo [+] Starting Django server on http://127.0.0.1:8000/
    echo Press CTRL+C to stop the server.
    cd backend
    python manage.py runserver
)

endlocal
