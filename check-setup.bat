@echo off
chcp 65001 > nul
echo ===================================
echo ==     ДИАГНОСТИКА НАСТРОЙКИ      ==
echo ===================================

echo.
echo [1] Проверка состояния Docker:
docker --version
if errorlevel 1 (
    echo [ОШИБКА] Docker не установлен или недоступен
    goto end
)

echo.
echo [2] Проверка состояния контейнеров:
docker-compose ps
if errorlevel 1 (
    echo [ПРЕДУПРЕЖДЕНИЕ] Контейнеры не запущены. Запустите run-docker.bat
)

echo.
echo [3] Проверка файлов проекта:
if exist docker-compose.yml (
    echo [+] docker-compose.yml найден
) else (
    echo [-] docker-compose.yml НЕ найден
)

if exist requirements\base.txt (
    echo [+] requirements\base.txt найден
) else (
    echo [-] requirements\base.txt НЕ найден
)

echo.
echo [4] Рекомендации по настройке PyCharm:
echo     1. Убедитесь, что контейнеры запущены: run-docker.bat
echo     2. Настройте Docker Compose интерпретатор в PyCharm
echo     3. НЕ устанавливайте пакеты через PyCharm Package Manager
echo     4. Следуйте инструкциям в INTERPRETER_SETUP.md

:end
echo.
pause
