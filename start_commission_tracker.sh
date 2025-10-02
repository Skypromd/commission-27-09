#!/bin/bash

echo "🚀 Commission Tracker - Старт системы"

# Остановка существующих процессов
pkill -f "manage.py runserver" 2>/dev/null
pkill -f "vite.*port" 2>/dev/null  
pkill -f "http.server 9000" 2>/dev/null
sleep 2

# Запуск Django Backend на порту 8080
echo "📦 Запуск Django Backend (порт 8080)..."
cd /app/backend
nohup python manage.py runserver 0.0.0.0:8080 > /app/backend_8080.log 2>&1 &

# Запуск React Frontend на порту 3000  
echo "⚛️ Запуск React Frontend (порт 3000)..."
cd /app/frontend
nohup npx vite --host 0.0.0.0 --port 3000 > /app/frontend_3000.log 2>&1 &

# Запуск тестового сервера на порту 9000
echo "🧪 Запуск Test Server (порт 9000)..."
cd /app
nohup python3 -m http.server 9000 > /app/test_server.log 2>&1 &

sleep 5

echo "✅ Все сервисы запущены!"
echo ""
echo "🌐 Preview URLs (используйте эти порты):"
echo "  📋 Django Admin:  Port 8080 → /admin/"
echo "  📚 API Docs:      Port 8080 → /api/docs/"
echo "  ⚛️  React App:     Port 3000"
echo "  🧪 Test Status:   Port 9000 → /test.html"
echo ""
echo "🔐 Логин: admin / admin"