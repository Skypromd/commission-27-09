@echo off
chcp 65001 > nul
echo ===================================
echo ==      ОЧИСТКА ПРОЕКТА          ==
echo ===================================
cd /d "%~dp0"

echo.
echo --- Удаление устаревших файлов зависимостей ---
if exist backend\requirements.txt (
    echo [!] Найден и удаляется дубликат: backend\requirements.txt
    del backend\requirements.txt
)
if exist requirements.txt (
    echo [!] Найден и удаляется старый файл: requirements.txt
    del requirements.txt
)
echo [+] Очистка файлов зависимостей завершена.

echo.
echo --- Удаление дублирующихся шаблонов ---
if exist commission\templates (
    echo [!] Найдена папка commission\templates. Удаление...
    rmdir /s /q commission\templates
    echo [+] Папка удалена.
) else (
    echo [+] Папка commission\templates не найдена.
)

echo.
echo --- Удаление файла базы данных ---
if exist db.sqlite3 (
    echo [!] Удаление: db.sqlite3
    del db.sqlite3
) else (
    echo [+] Файл db.sqlite3 не найден.
)

echo.
echo --- Удаление кэша Python (__pycache__) ---
for /d /r . %%d in (__pycache__) do (
    if exist "%%d" (
        echo [!] Удаление: "%%d"
        rmdir /s /q "%%d"
    )
)
echo [+] Кэш Python очищен.


echo.
echo ===================================
echo ==      ОЧИСТКА ЗАВЕРШЕНА        ==
echo ===================================
pause
