@echo off
chcp 65001 > nul
echo ===================================
echo ==    АНАЛИЗ СОСТОЯНИЯ ПРОЕКТА   ==
echo ===================================
cd /d "%~dp0"

echo.
echo [1] ПРОВЕРКА PYTHON
python --version
if errorlevel 1 (
    echo [!] ОШИБКА: Python не найден. Установите Python и добавьте его в PATH.
    goto end
)
echo [+] Python найден.

echo.
echo [2] ПРОВЕРКА ВИРТУАЛЬНОЙ СРЕДЫ
if not exist venv\Scripts\activate.bat (
    echo [!] ВНИМАНИЕ: Виртуальная среда 'venv' не найдена.
    echo     Рекомендуется запустить 'run.bat' для ее автоматического создания.
    goto check_files
)
echo [+] Виртуальная среда 'venv' найдена.
echo     Активация виртуальной среды...
call venv\Scripts\activate.bat

:check_files
echo.
echo [3] ПРОВЕРКА КЛЮЧЕВЫХ ФАЙЛОВ ПРОЕКТА
if exist manage.py (
    echo [+] Найден 'manage.py'. Проект определен как Django.
) else (
    echo [!] Не найден 'manage.py'. Невозможно определить тип проекта.
)

if exist frontend\package.json (
    echo [+] Найден 'frontend/package.json'. Проект содержит React frontend.
) else (
    echo [!] Не найден 'frontend/package.json'. Frontend часть может отсутствовать.
)

echo.
echo [4] ПРОВЕРКА ЗАВИСИМОСТЕЙ
if exist requirements.txt (
    echo     Содержимое 'requirements.txt':
    type requirements.txt
    echo.
    echo     Установленные пакеты (pip list):
    pip list
) else (
    echo [!] Файл 'requirements.txt' не найден.
)

echo.
echo [5] ПРОВЕРКА СИСТЕМЫ КОНТРОЛЯ ВЕРСИЙ (GIT)
if exist .git (
    echo [+] Найден репозиторий Git.
    git status
) else (
    echo [!] Проект не является репозиторием Git.
)

echo.
echo [6] ПРОВЕРКА ФАЙЛА КОНФИГУРАЦИИ
if exist backend\.env (
    echo [+] Найден файл конфигурации backend\.env.
) else (
    echo [!] ВНИМАНИЕ: Файл backend\.env не найден. В нем могут храниться важные настройки.
)

:end
echo.
echo ===================================
echo ==    ДИАГНОСТИКА ЗАВЕРШЕНА      ==
echo ===================================
echo.
echo Чтобы запустить проект, выполните 'run.bat'.
echo Если возникнут ошибки, покажите мне вывод этого скрипта.
pause