#!/bin/bash

echo "🚀 === БЫСТРЫЙ ЗАПУСК COMMISSION TRACKER ==="
echo ""

# Проверяем, что мы в правильной директории
if [ ! -f "/app/backend/manage.py" ]; then
    echo "❌ Файлы проекта не найдены!"
    echo "Возможно, нужно заново склонировать проект из GitHub"
    exit 1
fi

echo "✅ Файлы проекта найдены"

# Остановим любые старые процессы
echo "🧹 Очистка старых процессов..."
pkill -f "manage.py runserver" 2>/dev/null || true
pkill -f "vite.*port" 2>/dev/null || true  
pkill -f "http.server" 2>/dev/null || true
pkill -f "simple_proxy" 2>/dev/null || true
sleep 2

echo "📦 Запуск Django Backend (порт 8080)..."
cd /app/backend
nohup python manage.py runserver 0.0.0.0:8080 > /app/django.log 2>&1 &
echo "✅ Django запущен (PID: $!)"

echo "⚛️ Запуск React Static Server (порт 3001)..."
cd /app/frontend
if [ ! -d "dist" ]; then
    echo "🏗️ Создание build..."
    npm run build
fi
cd dist
nohup python3 -m http.server 3001 > /app/react_static.log 2>&1 &
echo "✅ Static React запущен (PID: $!)"

echo "🔀 Запуск Proxy Server (порт 3002)..."
cd /app
nohup python3 /app/simple_proxy.py > /app/proxy.log 2>&1 &
echo "✅ Proxy запущен (PID: $!)"

echo "💻 Запуск Vite Dev Server (порт 3000)..."
cd /app/frontend
nohup npx vite --host 0.0.0.0 --port 3000 > /app/vite.log 2>&1 &
echo "✅ Vite запущен (PID: $!)"

echo ""
echo "⏳ Ожидание запуска сервисов (10 секунд)..."
sleep 10

echo ""
echo "🔍 === ПРОВЕРКА СТАТУСА ==="
check_service() {
    local port=$1
    local name="$2"
    if curl -s --max-time 3 http://localhost:$port/ >/dev/null 2>&1; then
        echo "✅ $name (Port $port) - РАБОТАЕТ"
    else
        echo "❌ $name (Port $port) - НЕ ОТВЕЧАЕТ"
    fi
}

check_service 8080 "Django Backend"
check_service 3001 "Static React"
check_service 3002 "Proxy Server"
check_service 3000 "Vite Dev"

echo ""
echo "🎉 === ГОТОВО! ==="
echo ""
echo "🔗 Preview URLs для тестирования:"
echo "   Port 3001 - Static React (самый надежный)"
echo "   Port 8080 - Django Admin (добавьте /admin/)"
echo "   Port 3002 - Proxy Server"
echo "   Port 3000 - Vite Dev"
echo ""
echo "🔐 Django логин: admin / admin"
echo ""
echo "📊 Логи:"
echo "   Django:  tail -f /app/django.log"
echo "   React:   tail -f /app/react_static.log"
echo "   Proxy:   tail -f /app/proxy.log"
echo "   Vite:    tail -f /app/vite.log"