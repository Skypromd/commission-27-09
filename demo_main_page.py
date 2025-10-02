            print(f"❌ ОШИБКА! Статус: {response.status_code}")
            print(f"Ответ: {response.text[:200]}")

    except requests.exceptions.ConnectionError:
        print("❌ ОШИБКА ПОДКЛЮЧЕНИЯ!")
        print("Убедитесь, что backend сервер запущен на порту 8000")
        print("Команда для запуска: cd backend && python -m uvicorn main:app --reload")

    except Exception as e:
        print(f"❌ НЕОЖИДАННАЯ ОШИБКА: {e}")

def test_other_endpoints():
    """Тестирование других важных endpoints"""
    print("\n" + "=" * 65)
    print("🔍 ТЕСТИРОВАНИЕ ДРУГИХ ENDPOINTS")
    print("-" * 40)

    test_endpoints = [
        ("/health", "Health Check"),
        ("/docs", "API Documentation"),
        ("/api/modules", "Available Modules"),
        ("/api/dashboard/stats", "Dashboard Stats")
    ]

    base_url = "http://localhost:8000"

    for endpoint, description in test_endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=3)
            if response.status_code == 200:
                print(f"✅ {description} ({endpoint}) - OK")
            else:
                print(f"⚠️ {description} ({endpoint}) - {response.status_code}")
        except:
            print(f"❌ {description} ({endpoint}) - Недоступен")

def main():
    """Главная функция демонстрации"""
    print(f"⏰ Время тестирования: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    # Тестируем главную страницу
    test_main_page()

    # Тестируем другие endpoints
    test_other_endpoints()

    print("\n" + "=" * 65)
    print("🎉 ЗАКЛЮЧЕНИЕ:")
    print("Главная страница http://localhost:8000 теперь показывает")
    print("полную информацию о системе вместо перенаправления на /docs!")
    print("=" * 65)

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
UK Financial Services - Демонстрация работы главной страницы
Показать результат исправления перенаправления
"""

import requests
import json
from datetime import datetime

def test_main_page():
    """Тестирование исправленной главной страницы"""
    print("🎯 UK FINANCIAL SERVICES - ДЕМОНСТРАЦИЯ ГЛАВНОЙ СТРАНИЦЫ")
    print("=" * 65)

    url = "http://localhost:8000/"

    try:
        print(f"🌐 Запрос к: {url}")
        response = requests.get(url, timeout=5)

        print(f"📡 Статус ответа: {response.status_code}")
        print(f"📄 Тип контента: {response.headers.get('content-type', 'неизвестен')}")
        print(f"📊 Размер ответа: {len(response.content)} байт")
        print()

        if response.status_code == 200:
            print("✅ УСПЕХ! Главная страница работает корректно")
            print()

            # Парсим и красиво показываем JSON
            try:
                data = response.json()
                print("📋 СОДЕРЖИМОЕ ГЛАВНОЙ СТРАНИЦЫ:")
                print("-" * 40)

                # Основная информация
                print(f"📱 Приложение: {data.get('application', 'N/A')}")
                print(f"🔢 Версия: {data.get('version', 'N/A')}")
                print(f"🟢 Статус: {data.get('status', 'N/A')}")
                print(f"📝 Описание: {data.get('description', 'N/A')}")
                print()

                # Функции системы
                if 'features' in data:
                    print("🎯 ОСНОВНЫЕ ФУНКЦИИ:")
                    for i, feature in enumerate(data['features'], 1):
                        print(f"  {i}. {feature}")
                    print()

                # Системная информация
                if 'system_info' in data:
                    sys_info = data['system_info']
                    print("📊 СИСТЕМНАЯ ИНФОРМАЦИЯ:")
                    print(f"  • Загруженных роутеров: {sys_info.get('routers_loaded', 'N/A')}")
                    print(f"  • Статус БД: {sys_info.get('database_status', 'N/A')}")
                    print(f"  • Доступных модулей: {sys_info.get('modules_available', 'N/A')}")
                    print(f"  • Время: {sys_info.get('timestamp', 'N/A')}")
                    print()

                # Быстрые ссылки
                if 'quick_links' in data:
                    print("🔗 БЫСТРЫЕ ССЫЛКИ:")
                    for name, link in data['quick_links'].items():
                        print(f"  • {name}: {link}")
                    print()

                # Endpoints
                if 'endpoints' in data:
                    print("🌐 ДОСТУПНЫЕ ENDPOINTS:")
                    for name, endpoint in data['endpoints'].items():
                        print(f"  • {name.replace('_', ' ').title()}: {endpoint}")
                    print()

                print(f"💬 Сообщение: {data.get('message', 'N/A')}")

            except json.JSONDecodeError:
                print("⚠️ Ответ не в JSON формате:")
                print(response.text[:500] + "..." if len(response.text) > 500 else response.text)

        else:
