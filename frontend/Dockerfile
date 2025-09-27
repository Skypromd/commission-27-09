# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json для установки зависимостей
COPY package*.json ./
RUN npm install

# Копируем остальной код
COPY . .

# Открываем порт, который использует Vite по умолчанию
EXPOSE 5173

# Команда для запуска dev-сервера Vite с явным указанием конфиг-файла
CMD ["npm", "run", "dev", "--", "--config", "vite.config.ts"]