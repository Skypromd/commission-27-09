#!/bin/bash
#!/bin/bash

# Вывод в цветах для лучшего восприятия
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${GREEN}Настройка проекта UK Commission Admin Panel${NC}"
echo -e "${BLUE}=====================================${NC}"

# Шаг 1: Исправление структуры проекта
echo -e "${YELLOW}Шаг 1: Исправление структуры проекта${NC}"

# Делаем скрипт исполняемым
chmod +x scripts/fix-structure.sh

# Запускаем скрипт исправления структуры
./scripts/fix-structure.sh

# Определение основной директории проекта после исправления
main_dir="."
if [ -f "frontend/package.json" ] && [ ! -f "package.json" ]; then
  main_dir="frontend"
  echo -e "${YELLOW}Основная директория проекта: frontend/${NC}"
else
  echo -e "${YELLOW}Основная директория проекта: корневая директория${NC}"
fi

# Шаг 2: Установка зависимостей для frontend
echo -e "${YELLOW}Шаг 2: Установка зависимостей для frontend${NC}"

# Делаем скрипт очистки node_modules исполняемым
chmod +x scripts/clean-node-modules.sh

# Запускаем скрипт очистки node_modules
./scripts/clean-node-modules.sh

# Шаг 3: Настройка backend
echo -e "${YELLOW}Шаг 3: Настройка backend${NC}"

# Переходим в директорию backend
cd backend

# Проверяем наличие виртуального окружения Python
if [ ! -d "venv" ]; then
  echo -e "${YELLOW}Создание виртуального окружения Python...${NC}"
  python -m venv venv
fi

# Активация виртуального окружения в зависимости от ОС
if [ -f "venv/Scripts/activate" ]; then
  # Windows
  echo -e "${YELLOW}Активация виртуального окружения (Windows)...${NC}"
  source venv/Scripts/activate
else
  # Linux/Mac
  echo -e "${YELLOW}Активация виртуального окружения (Unix)...${NC}"
  source venv/bin/activate
fi

# Установка зависимостей из requirements.txt
if [ -f "requirements.txt" ]; then
  echo -e "${YELLOW}Установка зависимостей Python из requirements.txt...${NC}"
  pip install -r requirements.txt
else
  echo -e "${YELLOW}Установка основных зависимостей Python...${NC}"
  pip install fastapi uvicorn pydantic python-multipart
  # Создание файла requirements.txt
  pip freeze > requirements.txt
fi

# Возвращаемся в корневую директорию
cd ..

echo -e "${BLUE}=====================================${NC}"
echo -e "${GREEN}Настройка проекта завершена!${NC}"
echo -e "${BLUE}=====================================${NC}"

echo -e "${YELLOW}Для запуска проекта:${NC}"
echo -e "${GREEN}1. Запустите frontend:${NC}"
echo -e "   cd ${main_dir} && npm start"

echo -e "${GREEN}2. В отдельном терминале запустите backend:${NC}"
echo -e "   cd backend && source venv/bin/activate && python main.py"

echo -e "${YELLOW}Или используйте скрипт для одновременного запуска:${NC}"
echo -e "${GREEN}   chmod +x scripts/start-all.sh${NC}"
echo -e "${GREEN}   ./scripts/start-all.sh${NC}"

echo -e "${BLUE}=====================================${NC}"
# Этот скрипт настраивает проект с правильной структурой

echo "Начинаем настройку проекта..."

# Определяем, где мы находимся
PROJECT_ROOT=$(pwd)

# Сначала исправляем структуру, если необходимо
if [ -f "$PROJECT_ROOT/scripts/fix-structure.sh" ]; then
  echo "Запускаем скрипт исправления структуры..."
  chmod +x "$PROJECT_ROOT/scripts/fix-structure.sh"
  "$PROJECT_ROOT/scripts/fix-structure.sh"
fi

# Устанавливаем зависимости для frontend в корневой директории
echo "Устанавливаем зависимости для frontend..."
npm install

# Настраиваем backend
if [ -d "$PROJECT_ROOT/backend" ]; then
  echo "Настраиваем backend..."
  cd "$PROJECT_ROOT/backend"

  # Создаем виртуальное окружение, если его нет
  if [ ! -d "venv" ]; then
    echo "Создаем виртуальное окружение Python..."
    python -m venv venv
  fi

  # Активируем виртуальное окружение
  echo "Активируем виртуальное окружение..."
  if [ "$(uname)" = "Darwin" ] || [ "$(uname)" = "Linux" ]; then
    source venv/bin/activate
  elif [ "$(expr substr $(uname -s) 1 10)" = "MINGW32_NT" ] || [ "$(expr substr $(uname -s) 1 10)" = "MINGW64_NT" ]; then
    source venv/Scripts/activate
  fi

  # Устанавливаем зависимости для Python
  echo "Устанавливаем зависимости для Python..."
  pip install fastapi uvicorn pydantic
fi

echo "Настройка проекта завершена!"
echo "Запустите frontend: npm start"
echo "Запустите backend: cd backend && python main.py"
