#!/usr/bin/env python3
"""
Диагностика маршрутов React Frontend
Проверка доступности всех 16 модулей
"""

import requests
import time
from urllib.parse import urljoin

def check_routes():
    """Проверка всех маршрутов React приложения"""
    print("🔍 ДИАГНОСТИКА МАРШРУТОВ UK FINANCIAL SERVICES")
    print("=" * 60)

    base_url = "http://localhost:3000"

    # Все маршруты из Sidebar.tsx
    routes = [
        ("/", "Главная страница"),
        ("/dashboard", "Dashboard"),
        ("/consultants", "Консультанты"),
        ("/clients", "Клиенты"),
        ("/products", "Продукты"),
        ("/sales", "Продажи"),
        ("/mortgages", "Ипотека"),
        ("/insurances", "Страхование"),
        ("/commissions", "Комиссии"),
        ("/processes", "Процессы"),
        ("/financials", "Финансы"),
        ("/reports", "Отчеты"),
        ("/ml-analytics", "ML Аналитика"),
        ("/settings", "Настройки"),
        ("/permissions", "Разрешения"),
        ("/ui-components-demo", "UI Компоненты"),
        ("/corporate-style-demo", "Корпоративный стиль")
    ]

    print(f"🌐 Базовый URL: {base_url}")
    print(f"📋 Проверяю {len(routes)} маршрутов...")
    print()

    working_routes = []
    failed_routes = []

    for route, name in routes:
        url = urljoin(base_url, route)
        try:
            print(f"📡 Проверка: {route} ({name})")
            response = requests.get(url, timeout=5)

            if response.status_code == 200:
                # Проверяем, что это React приложение, а не 404 страница
                content = response.text.lower()
                if 'react' in content or 'vite' in content or len(response.content) > 5000:
                    print(f"   ✅ Работает - {response.status_code}")
                    working_routes.append((route, name))
                else:
                    print(f"   ⚠️ Возможно пустая страница - {response.status_code}")
                    failed_routes.append((route, name, "Empty"))
            else:
                print(f"   ❌ Ошибка - {response.status_code}")
                failed_routes.append((route, name, response.status_code))

        except requests.exceptions.ConnectionError:
            print(f"   ❌ Недоступен - Connection Error")
            failed_routes.append((route, name, "Connection Error"))
        except Exception as e:
            print(f"   ❌ Ошибка - {str(e)[:50]}")
            failed_routes.append((route, name, str(e)[:50]))

    print()
    print("=" * 60)
    print("📊 РЕЗУЛЬТАТЫ ДИАГНОСТИКИ МАРШРУТОВ")
    print("-" * 40)

    print(f"✅ Работающие маршруты ({len(working_routes)}):")
    for route, name in working_routes:
        print(f"   • {name} ({route})")

    if failed_routes:
        print(f"\n❌ Проблемные маршруты ({len(failed_routes)}):")
        for route, name, error in failed_routes:
            print(f"   • {name} ({route}) - {error}")

    success_rate = len(working_routes) / len(routes) * 100
    print(f"\n🎯 ОБЩИЙ РЕЗУЛЬТАТ: {success_rate:.1f}% маршрутов работают")

    if success_rate == 100:
        print("🏆 ВСЕ МАРШРУТЫ РАБОТАЮТ ИДЕАЛЬНО!")
    elif success_rate >= 80:
        print("✅ Большинство маршрутов работают")
    elif success_rate >= 50:
        print("⚠️ Половина маршрутов работают")
    else:
        print("❌ Требуется исправление маршрутов")

    print(f"\n💡 Откройте в браузере: {base_url}")
    print("   Нажмите F12 и проверьте Console на ошибки JavaScript")

    return working_routes, failed_routes

if __name__ == "__main__":
    print("⏰ Ждем запуска frontend...")
    time.sleep(3)

    working, failed = check_routes()

    print("\n" + "=" * 60)
    if len(working) >= 15:
        print("🎉 МАРШРУТЫ РАБОТАЮТ! Проблема может быть в интерфейсе.")
    else:
        print("🔧 НАЙДЕНЫ ПРОБЛЕМЫ С МАРШРУТАМИ - нужно исправить.")
