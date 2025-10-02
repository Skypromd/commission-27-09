#!/bin/bash

# Вывод в цветах для лучшего восприятия
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${GREEN}Запуск UK Commission Admin Panel${NC}"
echo -e "${BLUE}=====================================${NC}"

# Проверка структуры проекта
if [ -d "frontend/node_modules" ] && [ -d "node_modules" ]; then
  echo -e "${YELLOW}⚠️  Обнаружена проблема с дублированием node_modules${NC}"
  echo -e "${YELLOW}Рекомендуется запустить скрипт fix-structure.sh${NC}"

  read -p "Хотите запустить исправление структуры? (y/n): " fix_structure
  if [[ $fix_structure == "y" || $fix_structure == "Y" ]]; then
    chmod +x scripts/fix-structure.sh
    ./scripts/fix-structure.sh
  else
    echo -e "${YELLOW}Продолжаем без исправления структуры${NC}"
  fi
fi

# Определение операционной системы
OS_TYPE="unix"
if [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]] || [[ "$OSTYPE" == "win"* ]]; then
  OS_TYPE="windows"
fi
#!/bin/bash

# Вывод в цветах для лучшего восприятия
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${GREEN}Запуск UK Commission Admin Panel${NC}"
echo -e "${BLUE}=====================================${NC}"

# Проверка структуры проекта
if [ -d "frontend/node_modules" ] && [ -d "node_modules" ]; then
  echo -e "${YELLOW}⚠️  Обнаружена проблема с дублированием node_modules${NC}"
  echo -e "${YELLOW}Рекомендуется запустить скрипт fix-structure.sh${NC}"

  read -p "Хотите запустить исправление структуры? (y/n): " fix_structure
  if [[ $fix_structure == "y" || $fix_structure == "Y" ]]; then
    chmod +x scripts/fix-structure.sh
    ./scripts/fix-structure.sh
  else
    echo -e "${YELLOW}Продолжаем без исправления структуры${NC}"
  fi
fi

# Запуск бэкенда в отдельном терминале
echo -e "${GREEN}Запуск backend-сервера...${NC}"

# Проверяем наличие виртуального окружения Python
if [ ! -d "backend/venv" ]; then
  echo -e "${YELLOW}Создание виртуального окружения Python...${NC}"
  cd backend
  python -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  cd ..
fi

# Запуск backend в отдельном процессе
gnome-terminal --title="UK Commission Backend" -- bash -c "cd backend && source venv/bin/activate && python main.py; exec bash" 2>/dev/null || \
xterm -T "UK Commission Backend" -e "cd backend && source venv/bin/activate && python main.py; exec bash" 2>/dev/null || \
konsole --new-tab -p tabtitle="UK Commission Backend" -e "cd backend && source venv/bin/activate && python main.py; exec bash" 2>/dev/null || \
iTerm -t "UK Commission Backend" -e "cd backend && source venv/bin/activate && python main.py" 2>/dev/null || \
cmd.exe /c start "UK Commission Backend" cmd /k "cd backend && .\venv\Scripts\activate && python main.py" 2>/dev/null || \
start "UK Commission Backend" cmd /k "cd backend && .\venv\Scripts\activate && python main.py" 2>/dev/null || \
echo -e "${RED}Не удалось открыть новый терминал. Запускаем бэкенд в фоновом режиме.${NC}" && \
(cd backend && source venv/bin/activate && python main.py &)

echo -e "${GREEN}Запуск frontend...${NC}"

# Запуск npm start
npm start

# Если npm start завершится, остановим и бэкенд
echo -e "${YELLOW}Frontend остановлен. Завершение работы бэкенда...${NC}"
pkill -f "python main.py" 2>/dev/null || taskkill /f /im python.exe /fi "WINDOWTITLE eq UK Commission Backend" 2>/dev/null

echo -e "${GREEN}Спасибо за использование UK Commission Admin Panel!${NC}"
# Проверяем наличие виртуального окружения Python
if [ ! -d "backend/venv" ]; then
  echo -e "${YELLOW}Создание виртуального окружения Python...${NC}"
  cd backend
  python -m venv venv

  # Активация виртуального окружения в зависимости от ОС
  if [ "$OS_TYPE" == "windows" ]; then
    source venv/Scripts/activate
  else
    source venv/bin/activate
  fi

  # Установка зависимостей
  if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
  else
    pip install fastapi uvicorn pydantic python-multipart
  fi

  cd ..
fi

# Запуск backend в зависимости от ОС
echo -e "${GREEN}Запуск backend-сервера...${NC}"

if [ "$OS_TYPE" == "windows" ]; then
  # Windows - запуск в отдельном окне командной строки
  start "UK Commission Backend" cmd /k "cd backend && .\venv\Scripts\activate && python main.py"
else
  # Unix - запуск в фоновом режиме
  echo -e "${YELLOW}Запуск backend в фоновом режиме на порту 8000...${NC}"
  (cd backend && source venv/bin/activate && python main.py &)

  # Ожидание запуска сервера
  echo -e "${YELLOW}Ожидание запуска API-сервера...${NC}"
  sleep 3
fi

# Запуск frontend
echo -e "${GREEN}Запуск frontend на порту 3000...${NC}"

# Запуск npm start
npm start

# Если npm start завершится, остановим и бэкенд
echo -e "${YELLOW}Frontend остановлен. Завершение работы бэкенда...${NC}"
if [ "$OS_TYPE" == "windows" ]; then
  taskkill /f /im python.exe /fi "WINDOWTITLE eq UK Commission Backend" 2>/dev/null
else
  pkill -f "python main.py" 2>/dev/null
fi

echo -e "${GREEN}Спасибо за использование UK Commission Admin Panel!${NC}"
