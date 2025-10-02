#!/usr/bin/env python3
"""
Проверка доступности React Frontend UI
"""

import requests
import time

def check_frontend_ports():
    """Проверка различных портов для frontend"""
    ports_to_check = [3000, 5173, 5174]
    
    print("🔍 ПОИСК РАБОТАЮЩЕГО REACT FRONTEND")
    print("=" * 50)
    
    for port in ports_to_check:
        url = f"http://localhost:{port}"
        try:
            print(f"📡 Проверка порта {port}...")
            response = requests.get(url, timeout=3)
            
            if response.status_code == 200:
                print(f"✅ FRONTEND НАЙДЕН НА ПОРТУ {port}!")
                print(f"🌐 Откройте в браузере: {url}")
                print(f"📄 Размер страницы: {len(response.content)} байт")
                
                # Проверяем, что это действительно React приложение
                if 'react' in response.text.lower() or 'vite' in response.text.lower() or len(response.content) > 1000:
                    print("✅ Это React приложение!")
                    return port, url
                else:
                    print("⚠️ Возможно, это не React приложение")
                    
        except requests.exceptions.ConnectionError:
            print(f"❌ Порт {port} - недоступен")
        except Exception as e:
            print(f"❌ Ошибка на порту {port}: {e}")
    
    print("\n❌ React frontend не найден на стандартных портах")
    return None, None

def main():
    print("🚀 UK FINANCIAL SERVICES - ПОИСК ВИЗУАЛЬНОГО ИНТЕРФЕЙСА")
    print("⏰ Время:", time.strftime('%H:%M:%S'))
    print()
    
    # Даем время frontend'у запуститься
    print("⏳ Ждем запуска frontend (5 секунд)...")
    time.sleep(5)
    
    port, url = check_frontend_ports()
    
    if port:
        print(f"\n🎉 ВИЗУАЛЬНЫЙ ИНТЕРФЕЙС НАЙДЕН!")
        print(f"🌐 Откройте браузер и перейдите по адресу:")
        print(f"   {url}")
        print(f"\n💡 ДОСТУПНЫЕ АДРЕСА:")
        print(f"   • Frontend UI: {url}")
        print(f"   • Backend API: http://localhost:8000")
        print(f"   • API Docs: http://localhost:8000/docs")
    else:
        print(f"\n⚠️ Frontend не запущен или не отвечает")
        print(f"📋 ПОПРОБУЙТЕ ЗАПУСТИТЬ ВРУЧНУЮ:")
        print(f"   cd frontend")
        print(f"   npm run dev")
        print(f"\n🔄 Или используйте основной launcher:")
        print(f"   .\\LAUNCH_UK_FINANCIAL_SERVICES.bat")

if __name__ == "__main__":
    main()
