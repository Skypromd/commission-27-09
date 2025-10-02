@echo off
echo Проверка состояния проекта...

:: Проверка наличия виртуальной среды
if exist venv (
    echo [+] Виртуальная среда найдена
) else (
    echo [-] Виртуальная среда не найдена
)

:: Проверка ключевых файлов проекта
if exist manage.py (
    echo [+] Файл manage.py найден (Django проект)
) else (
    echo [-] Файл manage.py не найден
)

if exist app.py (
    echo [+] Файл app.py найден (Flask/FastAPI проект)
) else (
    echo [-] Файл app.py не найден
)

if exist requirements.txt (
    echo [+] Файл requirements.txt найден
    echo     Содержимое requirements.txt:
    type requirements.txt
    echo.
) else (
    echo [-] Файл requirements.txt не найден
)

:: Проверка структуры папок
if exist templates (
    echo [+] Папка templates найдена
) else (
    echo [-] Папка templates не найдена
)

if exist static (
    echo [+] Папка static найдена
) else (
    echo [-] Папка static не найдена
)

if exist api (
    echo [+] Папка api найдена
) else (
    echo [-] Папка api не найдена
)

if exist frontend (
    echo [+] Папка frontend найдена
) else (
    echo [-] Папка frontend не найдена
)

:: Вывод системной информации
echo.
echo Системная информация:
python --version
pip --version

echo.
echo Если проект не запускается, проверьте:
echo 1. Наличие и правильность файла requirements.txt
echo 2. Настройки базы данных
echo 3. Права доступа к файлам и папкам
echo 4. Наличие папок api и frontend для полного функционала

pause

