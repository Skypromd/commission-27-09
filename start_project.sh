#!/bin/bash

echo "🚀 Запуск Commission Tracker..."

# Остановка существующих процессов
pkill -f "manage.py runserver" 2>/dev/null
pkill -f "vite.*5173" 2>/dev/null

# Ожидание завершения процессов
sleep 2

echo "📦 Запуск Backend (Django)..."
cd /app/backend
nohup python manage.py runserver 0.0.0.0:8000 > /app/backend.log 2>&1 &
BACKEND_PID=$!

echo "⚛️ Запуск Frontend (React)..."
cd /app/frontend
nohup npx vite --host 0.0.0.0 --port 5173 > /app/frontend.log 2>&1 &
FRONTEND_PID=$!

# Ожидание запуска сервисов
echo "⏳ Ожидание запуска сервисов..."
sleep 5

# Проверка статуса
echo "🔍 Проверка статуса:"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Тест подключений
echo "🌐 Тестирование подключений:"
curl -s -I http://localhost:8000/admin/ | head -1 | grep -q "302" && echo "✅ Backend: OK" || echo "❌ Backend: ERROR"
curl -s -I http://localhost:5173/ | head -1 | grep -q "200" && echo "✅ Frontend: OK" || echo "❌ Frontend: ERROR"

echo ""
echo "🎉 Commission Tracker запущен!"
echo "📋 Django Admin: http://localhost:8000/admin/ (admin/admin)"
echo "🌐 Frontend: http://localhost:5173/"
echo "📚 API Docs: http://localhost:8000/api/docs/"
echo ""
echo "📊 Для просмотра логов:"
echo "Backend: tail -f /app/backend.log"
echo "Frontend: tail -f /app/frontend.log"