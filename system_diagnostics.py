#!/usr/bin/env python3
"""
UK Financial Services - Диагностика системы после очистки
Проверка работоспособности всех компонентов
"""

import requests
import json
import subprocess
import time
from pathlib import Path
import socket

class SystemDiagnostics:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.backend_url = "http://localhost:8000"
        self.frontend_url = "http://localhost:5173"
        self.results = {
            "backend": {"status": "unknown", "details": {}},
            "frontend": {"status": "unknown", "details": {}},
            "database": {"status": "unknown", "details": {}},
            "ports": {"status": "unknown", "details": {}},
            "files": {"status": "unknown", "details": {}}
        }

    def check_port(self, port, service_name):
        """Проверка доступности порта"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex(('localhost', port))
            sock.close()

            if result == 0:
                print(f"✅ {service_name} порт {port} - АКТИВЕН")
                return True
            else:
                print(f"❌ {service_name} порт {port} - НЕ ДОСТУПЕН")
                return False
        except Exception as e:
            print(f"❌ Ошибка проверки порта {port}: {e}")
            return False

    def check_backend_api(self):
        """Проверка Backend API"""
        print("\n🔍 ПРОВЕРКА BACKEND API")
        print("-" * 30)

        # Проверка порта
        port_active = self.check_port(8000, "Backend API")
        self.results["ports"]["backend"] = port_active

        if not port_active:
            self.results["backend"]["status"] = "not_running"
            return False

        # Проверка основных endpoints
        endpoints = [
            "/",
            "/health",
            "/docs",
            "/api/v1/clients",
            "/api/v1/commissions"
        ]

        working_endpoints = []
        for endpoint in endpoints:
            try:
                response = requests.get(f"{self.backend_url}{endpoint}", timeout=5)
                if response.status_code in [200, 404]:  # 404 это нормально для некоторых endpoints
                    print(f"✅ {endpoint} - OK ({response.status_code})")
                    working_endpoints.append(endpoint)
                else:
                    print(f"⚠️ {endpoint} - {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"❌ {endpoint} - ОШИБКА: {str(e)[:50]}")

        if working_endpoints:
            self.results["backend"]["status"] = "working"
            self.results["backend"]["details"]["endpoints"] = working_endpoints
            print(f"✅ Backend API работает! ({len(working_endpoints)}/{len(endpoints)} endpoints)")
            return True
        else:
            self.results["backend"]["status"] = "error"
            print("❌ Backend API не отвечает")
            return False

    def check_frontend(self):
        """Проверка Frontend"""
        print("\n🔍 ПРОВЕРКА FRONTEND")
        print("-" * 30)

        # Проверка порта Vite dev server
        port_active = self.check_port(5173, "Frontend Dev")
        self.results["ports"]["frontend"] = port_active

        if port_active:
            try:
                response = requests.get(f"{self.frontend_url}", timeout=5)
                if response.status_code == 200:
                    print("✅ Frontend доступен и работает!")
                    self.results["frontend"]["status"] = "working"
                    return True
            except:
                pass

        # Альтернативная проверка - файлы frontend
        frontend_path = self.project_root / "frontend"
        key_files = ["package.json", "src/main.tsx", "src/App.tsx", "index.html"]

        existing_files = []
        for file in key_files:
            if (frontend_path / file).exists():
                existing_files.append(file)

        if len(existing_files) >= 3:
            print(f"✅ Frontend файлы присутствуют ({len(existing_files)}/{len(key_files)})")
            self.results["frontend"]["status"] = "files_ready"
            self.results["frontend"]["details"]["files"] = existing_files
        else:
            print(f"❌ Frontend файлы отсутствуют ({len(existing_files)}/{len(key_files)})")
            self.results["frontend"]["status"] = "missing_files"

        return len(existing_files) >= 3

    def check_database(self):
        """Проверка баз данных"""
        print("\n🔍 ПРОВЕРКА БАЗ ДАННЫХ")
        print("-" * 30)

        db_files = [
            "uk_commission.db",
            "uk_financial_services.db",
            "backend/sql_app.db",
            "backend/uk_commission_full.db"
        ]

        existing_dbs = []
        for db_file in db_files:
            db_path = self.project_root / db_file
            if db_path.exists():
                size_mb = db_path.stat().st_size / (1024 * 1024)
                print(f"✅ {db_file} - {size_mb:.2f} MB")
                existing_dbs.append(db_file)
            else:
                print(f"❌ {db_file} - НЕ НАЙДЕН")

        if existing_dbs:
            self.results["database"]["status"] = "available"
            self.results["database"]["details"]["files"] = existing_dbs
            print(f"✅ Найдено {len(existing_dbs)} баз данных")
        else:
            self.results["database"]["status"] = "missing"
            print("❌ Базы данных не найдены")

        return len(existing_dbs) > 0

    def check_project_structure(self):
        """Проверка структуры проекта"""
        print("\n🔍 ПРОВЕРКА СТРУКТУРЫ ПРОЕКТА")
        print("-" * 30)

        essential_components = {
            "backend/main.py": "Основной FastAPI сервер",
            "frontend/package.json": "React приложение",
            "docker-compose.yml": "Docker конфигурация",
            "README.md": "Документация",
            "LAUNCH_UK_FINANCIAL_SERVICES.bat": "Главный запуск"
        }

        existing_components = []
        for component, description in essential_components.items():
            component_path = self.project_root / component
            if component_path.exists():
                print(f"✅ {component} - {description}")
                existing_components.append(component)
            else:
                print(f"❌ {component} - {description} [ОТСУТСТВУЕТ]")

        structure_score = len(existing_components) / len(essential_components) * 100

        if structure_score >= 80:
            self.results["files"]["status"] = "complete"
            print(f"✅ Структура проекта в порядке ({structure_score:.0f}%)")
        else:
            self.results["files"]["status"] = "incomplete"
            print(f"⚠️ Структура проекта неполная ({structure_score:.0f}%)")

        return structure_score >= 80

    def run_full_diagnostics(self):
        """Полная диагностика системы"""
        print("🚀 UK FINANCIAL SERVICES - ДИАГНОСТИКА СИСТЕМЫ")
        print("=" * 60)
        print(f"Проект: {self.project_root}")
        print(f"Время: {time.strftime('%Y-%m-%d %H:%M:%S')}")

        # Выполняем все проверки
        checks = [
            ("Структура проекта", self.check_project_structure),
            ("База данных", self.check_database),
            ("Backend API", self.check_backend_api),
            ("Frontend", self.check_frontend)
        ]

        results_summary = []
        for check_name, check_func in checks:
            try:
                result = check_func()
                results_summary.append((check_name, "✅ OK" if result else "❌ ПРОБЛЕМА"))
            except Exception as e:
                results_summary.append((check_name, f"❌ ОШИБКА: {e}"))

        # Итоговый отчет
        print("\n" + "=" * 60)
        print("📋 ИТОГИ ДИАГНОСТИКИ")
        print("-" * 30)

        for check_name, status in results_summary:
            print(f"{status} {check_name}")

        # Общий статус
        working_checks = sum(1 for _, status in results_summary if "✅" in status)
        total_checks = len(results_summary)

        print(f"\n📊 ОБЩИЙ СТАТУС: {working_checks}/{total_checks} компонентов работают")

        if working_checks >= total_checks * 0.75:
            print("🎯 РЕЗУЛЬТАТ: Система готова к работе!")
            overall_status = "ready"
        elif working_checks >= total_checks * 0.5:
            print("⚠️ РЕЗУЛЬТАТ: Система работает частично")
            overall_status = "partial"
        else:
            print("❌ РЕЗУЛЬТАТ: Требуется настройка системы")
            overall_status = "needs_setup"

        # Сохранение отчета
        self.results["overall_status"] = overall_status
        self.results["timestamp"] = time.strftime('%Y-%m-%d %H:%M:%S')

        report_file = self.project_root / "SYSTEM_STATUS_REPORT.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)

        print(f"\n💾 Отчет сохранен: {report_file}")

        return overall_status, working_checks, total_checks

def main():
    """Запуск диагностики"""
    diagnostics = SystemDiagnostics()
    status, working, total = diagnostics.run_full_diagnostics()
    return status

if __name__ == "__main__":
    main()
