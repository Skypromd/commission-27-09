@echo off
chcp 65001 > nul
echo ===================================
echo ==      ПРОВЕРКА СТИЛЯ КОДА (LINT)     ==
echo ===================================

echo.
echo [INFO] Если ваша IDE показывает ошибки "Unresolved reference",
echo [INFO] следуйте инструкциям в файле SETUP_GUIDE.md
echo.

echo --- Запуск Flake8 ---
docker-compose exec -T web flake8 .

echo.
echo ===================================
echo ==      ПРОВЕРКА ЗАВЕРШЕНА       ==
echo ===================================
pause
