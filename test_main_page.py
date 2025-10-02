#!/usr/bin/env python3
"""
Простой тест главной страницы UK Financial Services
"""

import requests
import json
import time

def test_main_page():
    print("🔍 ТЕСТИРОВАНИЕ ГЛАВНОЙ СТРАНИЦЫ")
    print("=" * 50)

    url = "http://localhost:8000/"

    try:
        print(f"📡 Отправка запроса к: {url}")
        response = requests.get(url, timeout=10)

        print(f"📊 Статус код: {response.status_code}")

        if response.status_code == 200:
            print("✅ УСПЕХ! Главная страница отвечает")

            # Проверяем тип ответа
            content_type = response.headers.get('content-type', '')
            print(f"📄 Тип контента: {content_type}")

            if 'application/json' in content_type:
                try:
                    data = response.json()
                    print("\n🎯 СОДЕРЖИМОЕ ГЛАВНОЙ СТРАНИЦЫ:")
                    print("-" * 30)

                    # Показываем ключевые поля
                    if 'application' in data:
                        print(f"📱 Приложение: {data['application']}")
                    if 'version' in data:
                        print(f"🔢 Версия: {data['version']}")
                    if 'status' in data:
                        print(f"🟢 Статус: {data['status']}")
                    if 'message' in data:
                        print(f"💬 Сообщение: {data['message']}")

                    # Проверяем, есть ли информация вместо перенаправления
                    if 'features' in data or 'system_info' in data:
                        print("\n✅ ИСПРАВЛЕНИЕ РАБОТАЕТ!")
                        print("Главная страница показывает информацию о системе")
                        print("вместо перенаправления на /docs")
                    else:
                        print("\n❌ Всё ещё перенаправление или проблема")

                except json.JSONDecodeError:
                    print("❌ Ответ не в JSON формате")
                    print(f"Ответ: {response.text[:200]}...")
            else:
                print("❌ Ответ не JSON")
                print(f"Ответ: {response.text[:200]}...")

        elif response.status_code == 307 or response.status_code == 302:
            print("❌ ПРОБЛЕМА: Всё ещё происходит перенаправление!")
            location = response.headers.get('location', 'не указано')
            print(f"Перенаправление на: {location}")

        else:
            print(f"❌ Ошибка: {response.status_code}")
            print(f"Ответ: {response.text[:100]}...")

    except requests.exceptions.ConnectionError:
        print("❌ НЕ УДАЛОСЬ ПОДКЛЮЧИТЬСЯ К СЕРВЕРУ!")
        print("Проверьте, что backend запущен на порту 8000")
        return False

    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return False

    return True

# Запуск теста
if __name__ == "__main__":
    print("⏰ Ждем запуска сервера...")
    time.sleep(3)  # Даем серверу время запуститься

    success = test_main_page()

    if success:
        print("\n🎉 Тест завершен!")
        print("Попробуйте открыть http://localhost:8000 в браузере")
    else:
        print("\n❌ Тест не прошел. Проверьте запуск сервера.")
