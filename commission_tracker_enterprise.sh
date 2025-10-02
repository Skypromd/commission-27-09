#!/bin/bash

# Commission Tracker - Enterprise Grade System
# Мировой уровень управления комиссиями

echo "🏆 === COMMISSION TRACKER ENTERPRISE EDITION ==="
echo ""

case "${1:-help}" in
    "start"|"")
        echo "🚀 Starting Commission Tracker Enterprise..."
        
        # Остановка существующих процессов
        pkill -f "manage.py runserver" 2>/dev/null || true
        pkill -f "vite.*port" 2>/dev/null || true
        pkill -f "http.server.*300" 2>/dev/null || true
        sleep 2
        
        # Запуск Django Backend
        echo "📦 Starting Django Enterprise Backend..."
        cd /app/backend
        nohup python manage.py runserver 0.0.0.0:8080 > /app/logs/django_enterprise.log 2>&1 &
        DJANGO_PID=$!
        
        # Запуск React Production
        echo "⚛️ Starting React Enterprise Frontend..."
        cd /app/frontend/dist
        nohup python3 -m http.server 3001 > /app/logs/react_production.log 2>&1 &
        REACT_PID=$!
        
        # Запуск Vite Development (для разработки)
        echo "💻 Starting Vite Development Server..."
        cd /app/frontend
        nohup npx vite --host 0.0.0.0 --port 3000 > /app/logs/vite_dev.log 2>&1 &
        VITE_PID=$!
        
        sleep 5
        
        echo ""
        echo "✅ === СИСТЕМА ЗАПУЩЕНА ==="
        echo "Django Backend PID: $DJANGO_PID (Port 8080)"
        echo "React Production PID: $REACT_PID (Port 3001)"
        echo "Vite Development PID: $VITE_PID (Port 3000)"
        
        # Тестирование
        echo ""
        echo "🧪 Системная проверка:"
        for port in 8080 3001 3000; do
            if curl -s --max-time 3 http://localhost:$port/ >/dev/null 2>&1; then
                echo "  ✅ Port $port - OK"
            else
                echo "  ❌ Port $port - FAIL"
            fi
        done
        
        echo ""
        echo "🌐 ДОСТУП К СИСТЕМЕ:"
        echo "  📊 Production UI:    Port 3001 (рекомендуется для пользователей)"
        echo "  ⚡ Development UI:   Port 3000 (для разработчиков)"
        echo "  🛠️ Django Admin:     Port 8080/admin/ (логин: admin/admin)"
        echo "  📚 API Documentation: Port 8080/api/docs/"
        echo ""
        echo "🎯 ВОЗМОЖНОСТИ СИСТЕМЫ:"
        echo "  💼 Sales Pipeline Management - Полноценное управление воронкой продаж"
        echo "  🤵 Team Performance Analytics - Аналитика производительности команды"
        echo "  👥 Advanced Client Portfolio - Продвинутое управление клиентами"
        echo "  🏷️ Product Catalog & Analytics - Каталог продуктов с аналитикой"
        echo "  📊 Real-time Dashboards - Дашборды в реальном времени"
        echo "  🔄 Live Data Integration - Интеграция с реальными данными"
        ;;
        
    "stop")
        echo "🛑 Stopping Commission Tracker..."
        pkill -f "manage.py runserver" && echo "✅ Django stopped"
        pkill -f "vite.*port" && echo "✅ Vite stopped"  
        pkill -f "http.server.*300" && echo "✅ React stopped"
        echo "🏁 All services stopped"
        ;;
        
    "status")
        echo "📊 === SYSTEM STATUS ==="
        echo ""
        echo "🔍 Active Processes:"
        ps aux | grep -E "(manage.py|vite|http.server.*300)" | grep -v grep | while read line; do
            if echo "$line" | grep -q "manage.py"; then
                echo "  ✅ Django Backend - Running"
            elif echo "$line" | grep -q "vite"; then
                echo "  ✅ Vite Dev Server - Running"
            elif echo "$line" | grep -q "http.server.*3001"; then
                echo "  ✅ React Production - Running"
            fi
        done
        
        echo ""
        echo "🌐 Port Status:"
        for port in 8080 3001 3000; do
            if curl -s --max-time 2 http://localhost:$port/ >/dev/null 2>&1; then
                echo "  ✅ Port $port - Responsive"
            else
                echo "  ❌ Port $port - Not responding"
            fi
        done
        ;;
        
    "logs")
        echo "📋 === SYSTEM LOGS ==="
        echo ""
        echo "📦 Django Backend Logs:"
        tail -20 /app/logs/django_enterprise.log 2>/dev/null || echo "No Django logs yet"
        echo ""
        echo "⚛️ React Production Logs:"
        tail -10 /app/logs/react_production.log 2>/dev/null || echo "No React logs yet"
        ;;
        
    "api-test")
        echo "🧪 === API FUNCTIONALITY TEST ==="
        echo ""
        
        API_BASE="http://localhost:8080/api"
        
        echo "Testing API endpoints..."
        for endpoint in "advisers/advisers/" "clients/clients/" "products/products/" "deals/deals/"; do
            echo -n "  $endpoint ... "
            response=$(curl -s -w "%{http_code}" -o /dev/null "$API_BASE/$endpoint")
            if [ "$response" = "200" ] || [ "$response" = "403" ]; then
                echo "✅ OK ($response)"
            else
                echo "❌ FAIL ($response)"
            fi
        done
        
        echo ""
        echo "Testing advanced endpoints..."
        for endpoint in "deals/deals/summary/" "advisers/advisers/1/statistics/"; do
            echo -n "  $endpoint ... "
            if curl -s --max-time 3 "$API_BASE/$endpoint" >/dev/null 2>&1; then
                echo "✅ OK"
            else
                echo "❌ FAIL"
            fi
        done
        ;;
        
    "backup")
        echo "💾 Creating system backup..."
        backup_dir="/app/backups/$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$backup_dir"
        
        # Backup database
        cp /app/backend/db.sqlite3 "$backup_dir/" 2>/dev/null || echo "No database to backup"
        
        # Backup configurations
        cp /app/backend/.env "$backup_dir/backend_env" 2>/dev/null
        cp /app/frontend/.env "$backup_dir/frontend_env" 2>/dev/null
        
        echo "✅ Backup created: $backup_dir"
        ;;
        
    "help"|*)
        echo "📚 === COMMISSION TRACKER ENTERPRISE COMMANDS ==="
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  start     🚀 Start all services (default)"
        echo "  stop      🛑 Stop all services"
        echo "  status    📊 Check system status"
        echo "  logs      📋 View system logs"
        echo "  api-test  🧪 Test API functionality"
        echo "  backup    💾 Create system backup"
        echo "  help      📚 Show this help"
        echo ""
        echo "🏆 Commission Tracker Enterprise Edition"
        echo "    Enterprise-grade commission management system"
        echo "    Built with Django + React + Modern APIs"
        ;;
esac