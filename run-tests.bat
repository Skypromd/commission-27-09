@echo off
echo ===================================
echo ==      ЗАПУСК ТЕСТОВ ПРОЕКТА      ==
echo ===================================

echo.
echo --- Запуск тестов с помощью pytest ---
docker-compose exec -T web pytest --cov=commission --cov-report=term-missing

echo.
echo ===================================
echo ==      ТЕСТИРОВАНИЕ ЗАВЕРШЕНО   ==
echo ===================================
pause

