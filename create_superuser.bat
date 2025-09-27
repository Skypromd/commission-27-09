@echo off
chcp 65001 > nul
echo ===================================
echo ==   СОЗДАНИЕ СУПЕРПОЛЬЗОВАТЕЛЯ   ==
echo ===================================
cd /d "%~dp0"

echo.
echo --- Активация виртуальной среды ---
if not exist venv\Scripts\activate.bat (
    echo [!] Виртуальная среда 'venv' не найдена. Запустите 'run.bat' сначала.
    pause
    exit /b
)
call venv\Scripts\activate.bat

echo.
echo --- Запуск команды создания суперпользователя ---
echo.
echo ==> Пожалуйста, введите имя пользователя, email и пароль.
echo.
python manage.py createsuperuser

echo.
echo ===================================
echo ==      ПРОЦЕСС ЗАВЕРШЕН         ==
echo ===================================
pause

