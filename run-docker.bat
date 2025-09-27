@echo off
echo ===================================
echo ==   ЗАПУСК ПРОЕКТА ЧЕРЕЗ DOCKER   ==
echo ===================================

echo.
echo --- Проверка наличия .env файла ---
if not exist .env (
    if exist .env.example (
        echo [!] Файл .env не найден. Копирую из .env.example...
        copy .env.example .env
    ) else (
        echo [!] ВНИМАНИЕ: Файлы .env и .env.example не найдены.
        pause
        exit /b
    )
)

echo.
echo --- Сборка и запуск контейнеров ---
docker-compose up --build -d

echo.
echo [+] Проект запущен в фоновом режиме.
echo [+] Запущены сервисы: nginx, web, db, redis, celery.
echo ==> Адрес: http://localhost/
echo ==> API Docs: http://localhost/swagger/
echo.
echo ==> Для просмотра логов выполните: docker-compose logs -f
echo ==> Для остановки выполните: docker-compose down
echo.
pause
