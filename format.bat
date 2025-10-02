@echo off
echo ===================================
echo ==   ФОРМАТИРОВАНИЕ КОДА   ==
echo ===================================

echo.
echo --- Сортировка импортов (isort) ---
docker-compose exec -T web isort .

echo.
echo --- Форматирование кода (black) ---
docker-compose exec -T web black .

echo.
echo ===================================
echo ==   ФОРМАТИРОВАНИЕ ЗАВЕРШЕНО    ==
echo ===================================
pause
