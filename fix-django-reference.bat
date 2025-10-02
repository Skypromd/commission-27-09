@echo off
chcp 65001 > nul
echo ===================================
echo ==  РЕШЕНИЕ "Unresolved reference 'django'"  ==
echo ===================================

echo.
echo ПОШАГОВЫЙ ПЛАН ДЕЙСТВИЙ:
echo.
echo 1. ✅ ЗАПУСТИТЕ Docker-контейнеры:
echo    Дважды щелкните: run-docker.bat
echo    Дождитесь сообщения о готовности.
echo.
echo 2. ✅ НАСТРОЙТЕ интерпретатор в PyCharm:
echo    File → Settings → Python Interpreter
echo    Add → Docker Compose → Service: web
echo.
echo 3. ✅ ДОЖДИТЕСЬ индексации пакетов (2-3 минуты)
echo.
echo 4. ✅ РЕЗУЛЬТАТ: Все ошибки исчезнут!
echo    - "Unresolved reference 'django'"
echo    - "Package requirements not satisfied"
echo.
echo ❌ НЕ УСТАНАВЛИВАЙТЕ пакеты через PyCharm!
echo    Они УЖЕ установлены в Docker-контейнере.
echo.
echo 📖 Подробная инструкция: INTERPRETER_SETUP.md
echo.
echo СТАТУС: Кодировка файлов исправлена ✅
echo ГОТОВ К: Настройке интерпретатора ✅
echo.
pause

