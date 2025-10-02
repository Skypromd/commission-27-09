#!/usr/bin/env python3
"""
UK Financial Services Project Cleanup Analysis
Анализ и рекомендации по очистке проекта
"""

import os
import json
from pathlib import Path
from datetime import datetime
import shutil

class ProjectAnalyzer:
    def __init__(self, project_root):
        self.project_root = Path(project_root)
        self.analysis_result = {
            "essential_files": [],
            "duplicate_files": [],
            "obsolete_files": [],
            "cleanup_recommendations": []
        }

    def analyze_project(self):
        """Анализ структуры проекта"""
        print("🔍 Анализ структуры проекта UK Financial Services...")

        # Основные компоненты (СОХРАНИТЬ)
        essential_patterns = [
            # Backend core
            "backend/main.py",
            "backend/requirements.txt",
            "backend/app/",
            "backend/Dockerfile",
            "backend/.env*",

            # Frontend core
            "frontend/src/",
            "frontend/public/",
            "frontend/package.json",
            "frontend/vite.config.ts",
            "frontend/tsconfig.json",
            "frontend/tailwind.config.js",
            "frontend/Dockerfile",

            # Infrastructure
            "docker-compose*.yml",
            "nginx/",

            # Documentation
            "README.md",
            "project.json",
            "*_GUIDE.md",
            "*_DOCUMENTATION.md",
            "*_PLAN.md", # <-- ДОБАВЛЕНО: Разрешаем файлы с планами

            # Scripts (core only)
            "scripts/",

            # Tests
            "tests/"
        ]

        # Файлы для удаления
        obsolete_patterns = [
            # Старые HTML демо
            "*demo*.html",
            "*DEMO*.html",
            "*working*.html",
            "*fixed*.html",
            "*perfect*.html",
            "corrected_*.html",
            "system_status.html",
            "diagnostic_test.html",

            # Дублированные Python скрипты
            "quick_*.py",
            "simple_*.py",
            "working_*.py",
            "perfect_*.py",
            "launch_*.py",
            "fresh_*.py",
            "start_*.py",
            "force_*.py",
            "full_*.py",
            "run_*.py",
            "*ЗАПУСК*.py",
            "*ИСПРАВ*.py",
            "*ЭКСТРЕН*.py",

            # Множественные .bat файлы (оставить только основные)
            "*.bat",  # Проанализируем отдельно

            # Старые базы данных
            "demo.db",
            "working_demo.db",
            "*.db",  # Кроме основной

            # Кэш и временные файлы
            "__pycache__/",
            "*.pyc",
            ".pytest_cache/",
            "node_modules/",

            # Старые архивы (если есть новые)
            "archive/old-*",

            # Дублированные виртуальные окружения
            "venv_*/",
            ".venv/"
        ]

        self.scan_files(essential_patterns, obsolete_patterns)
        self.analyze_duplicates()
        self.generate_recommendations()

        return self.analysis_result

    def scan_files(self, essential_patterns, obsolete_patterns):
        """Сканирование файлов по паттернам"""

        for root, dirs, files in os.walk(self.project_root):
            # Пропускаем node_modules и подобные
            dirs[:] = [d for d in dirs if d not in ['node_modules', '__pycache__', '.git', 'venv', '.venv']]

            for file in files:
                file_path = Path(root) / file
                rel_path = file_path.relative_to(self.project_root)

                # Проверяем важные файлы
                if self.match_patterns(str(rel_path), essential_patterns):
                    self.analysis_result["essential_files"].append(str(rel_path))

                # Проверяем устаревшие файлы
                elif self.match_patterns(str(rel_path), obsolete_patterns):
                    self.analysis_result["obsolete_files"].append(str(rel_path))

    def match_patterns(self, file_path, patterns):
        """Проверка соответствия паттернам"""
        import fnmatch

        for pattern in patterns:
            if fnmatch.fnmatch(file_path, pattern) or pattern in file_path:
                return True
        return False

    def analyze_duplicates(self):
        """Анализ дублированных файлов"""

        # Группы дублированных файлов
        duplicate_groups = {
            "launch_scripts": [
                "LAUNCH_UK_FINANCIAL_SERVICES.bat",
                "start.bat",
                "run.bat",
                "launch_fresh.bat",
                "clean_launch.bat",
                "force_update.bat"
            ],
            "demo_html": [
                "UK_FINANCIAL_SERVICES_DEMO.html",
                "perfect_working_demo.html",
                "working_demo.html",
                "working_demo_fixed.html",
                "fixed_active_modules.html"
            ],
            "backend_scripts": [
                "uk_financial_services_backend.py",
                "perfect_backend.py",
                "simple_backend.py"
            ]
        }

        for group_name, files in duplicate_groups.items():
            existing_files = []
            for file in files:
                if (self.project_root / file).exists():
                    existing_files.append(file)

            if len(existing_files) > 1:
                self.analysis_result["duplicate_files"].append({
                    "group": group_name,
                    "files": existing_files,
                    "recommend_keep": existing_files[0]  # Первый по алфавиту
                })

    def generate_recommendations(self):
        """Генерация рекомендаций"""

        recommendations = [
            {
                "category": "Структура проекта",
                "action": "Сохранить современную архитектуру",
                "details": "backend/ + frontend/ + docker configs"
            },
            {
                "category": "Удалить устаревшие HTML демо",
                "action": "Удалить все *.html файлы в корне",
                "details": "React frontend заменяет старые HTML демо"
            },
            {
                "category": "Консолидировать скрипты запуска",
                "action": "Оставить только docker-compose и основные .bat",
                "details": "Удалить дублированные launch/start скрипты"
            },
            {
                "category": "Очистить Python скрипты",
                "action": "Оставить только backend/main.py",
                "details": "Удалить legacy Python файлы в корне"
            },
            {
                "category": "Унификация баз данных",
                "action": "Оставить только рабочую БД",
                "details": "Удалить demo.db, working_demo.db и прочие тестовые"
            }
        ]

        self.analysis_result["cleanup_recommendations"] = recommendations

    def save_analysis(self):
        """Сохранение анализа"""

        report_file = self.project_root / "CLEANUP_ANALYSIS_REPORT.json"

        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(self.analysis_result, f, indent=2, ensure_ascii=False)

        print(f"📊 Отчет сохранен: {report_file}")
        return report_file

def main():
    """Главная функция анализа"""

    project_root = Path(__file__).parent
    analyzer = ProjectAnalyzer(project_root)

    print("🚀 UK Financial Services - Анализ проекта")
    print("=" * 50)

    result = analyzer.analyze_project()
    report_file = analyzer.save_analysis()

    # Краткая статистика
    print("\n📈 СТАТИСТИКА:")
    print(f"✅ Важных файлов: {len(result['essential_files'])}")
    print(f"🔄 Групп дубликатов: {len(result['duplicate_files'])}")
    print(f"❌ Устаревших файлов: {len(result['obsolete_files'])}")

    print(f"\n📋 РЕКОМЕНДАЦИИ ({len(result['cleanup_recommendations'])} пунктов):")
    for i, rec in enumerate(result['cleanup_recommendations'], 1):
        print(f"{i}. {rec['category']}: {rec['action']}")

    print(f"\n📄 Полный отчет: {report_file}")

    return result

if __name__ == "__main__":
    main()
