#!/usr/bin/env python3
"""
UK Commission Admin Panel - Universal Setup Script
Кросс-платформенный скрипт для настройки и управления проектом
"""

import os
import sys
import subprocess
import platform
import json
import shutil
from pathlib import Path
from typing import List, Dict, Optional

class ProjectManager:
    """Универсальный менеджер проекта"""

    def __init__(self):
        self.root_dir = Path(__file__).parent
        self.backend_dir = self.root_dir / "backend"
        self.frontend_dir = self.root_dir / "frontend"
        self.system = platform.system().lower()
        self.python_cmd = self._get_python_cmd()
        self._npm_cmd = None

    def _get_python_cmd(self) -> str:
        """Определяем команду Python для текущей системы"""
        for cmd in ['python3', 'python', 'py']:
            try:
                result = subprocess.run([cmd, '--version'],
                                        capture_output=True, text=True)
                if result.returncode == 0 and '3.' in result.stdout:
                    return cmd
            except FileNotFoundError:
                continue
        raise RuntimeError("Python 3 не найден в системе")

    @property
    def npm_cmd(self) -> str:
        """Определяем команду npm/yarn для текущей системы при первом обращении."""
        if self._npm_cmd is None:
            for cmd in ['npm', 'yarn']:
                try:
                    subprocess.run([cmd, '--version'],
                                   capture_output=True, check=True)
                    self._npm_cmd = cmd
                    return self._npm_cmd
                except (FileNotFoundError, subprocess.CalledProcessError):
                    continue
            raise RuntimeError("npm или yarn не найден в системе. Установите Node.js для работы с frontend.")
        return self._npm_cmd

    def _run_command(self, cmd: List[str], cwd: Optional[Path] = None,
                     shell: bool = None) -> subprocess.CompletedProcess:
        """Выполнение команды с учетом операционной системы"""
        if shell is None:
            shell = self.system == 'windows'

        print(f"🔧 Выполняется: {' '.join(cmd)}")
        return subprocess.run(cmd, cwd=cwd, shell=shell, check=True)

    def setup_project(self):
        """Полная настройка проекта"""
        print("🚀 Начало настройки Commission Tracker...")

        # 1. Проверка системы
        self._check_system_requirements()

        # 2. Настройка backend
        self._setup_backend()

        # 3. Настройка frontend
        self._setup_frontend()

        # 4. Настройка git hooks
        self._setup_git_hooks()

        # 5. Создание конфигурационных файлов
        self._create_config_files()

        print("✅ Проект успешно настроен!")
        print("\n📋 Доступные команды:")
        print("  python setup-project.py start-backend  - Запуск backend")
        print("  python setup-project.py start-frontend - Запуск frontend")
        print("  python setup-project.py start-full     - Запуск всего стека")
        print("  python setup-project.py test           - Запуск тестов")

    def _check_system_requirements(self):
        """Проверка системных требований"""
        print("🔍 Проверка системных требований...")

        requirements = {
            'Python 3.8+': self.python_cmd,
            'Node.js 16+': 'node',
            'npm/yarn': self.npm_cmd
        }

        for name, cmd in requirements.items():
            try:
                # Для npm/yarn проверка будет внутри свойства
                if name == 'npm/yarn':
                    command_to_run = [cmd, '--version']
                else:
                    command_to_run = [cmd, '--version']

                result = subprocess.run(command_to_run,
                                        capture_output=True, text=True, check=True, shell=self.system=='windows')
                version = result.stdout.strip()
                print(f"  ✅ {name}: {version}")

            except (subprocess.CalledProcessError, FileNotFoundError) as e:
                print(f"  ❌ {name}: Не найден или ошибка выполнения. ({str(e)})")
                sys.exit(1)
            except Exception as e:
                print(f"  ❌ {name}: {str(e)}")
                sys.exit(1)


    def _setup_backend(self):
        """Настройка backend environment"""
        print("🐍 Настройка Python backend...")

        # Создание виртуального окружения
        venv_path = self.backend_dir / ".venv"
        if not venv_path.exists():
            self._run_command([self.python_cmd, '-m', 'venv', str(venv_path)])

        # Активация venv и установка зависимостей
        if self.system == 'windows':
            pip_cmd = str(venv_path / "Scripts" / "pip")
        else:
            pip_cmd = str(venv_path / "bin" / "pip")

        # Установка зависимостей
        requirements_file = self.backend_dir / "requirements.txt"
        if requirements_file.exists():
            self._run_command([pip_cmd, 'install', '-r', str(requirements_file)])

        # Создание .env файла если не существует
        env_file = self.backend_dir / ".env"
        if not env_file.exists():
            env_content = """# UK Commission Admin Panel - Environment Configuration
DATABASE_URL=sqlite:///./sql_app.db
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:3000"]
DEBUG=True
"""
            env_file.write_text(env_content)

    def _setup_frontend(self):
        """Настройка frontend environment"""
        print("⚛️ Настройка React frontend...")

        # Установка зависимостей
        package_json = self.frontend_dir / "package.json"
        if package_json.exists():
            self._run_command([self.npm_cmd, 'install'], cwd=self.frontend_dir)

        # Создание .env файла для frontend
        env_file = self.frontend_dir / ".env"
        if not env_file.exists():
            env_content = """# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:8000
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
GENERATE_SOURCEMAP=true
"""
            env_file.write_text(env_content)

    def _setup_git_hooks(self):
        """Настройка git hooks для качества кода"""
        print("🔗 Настройка git hooks...")

        git_dir = self.root_dir / ".git"
        if not git_dir.exists():
            print("  ⚠️ Git репозиторий не инициализирован")
            return

        hooks_dir = git_dir / "hooks"
        hooks_dir.mkdir(exist_ok=True)

        # Pre-commit hook
        pre_commit_hook = hooks_dir / "pre-commit"
        pre_commit_content = f"""#!/bin/bash
# UK Commission Admin Panel - Pre-commit Hook

echo "🔍 Запуск pre-commit проверок..."

# Проверка Python кода
echo "🐍 Проверка Python кода..."
cd backend
if command -v ruff &> /dev/null; then
    ruff check .
    if [ $? -ne 0 ]; then
        echo "❌ Найдены ошибки в Python коде"
        exit 1
    fi
fi

# Проверка frontend кода  
echo "⚛️ Проверка React кода..."
cd ../frontend
if command -v npm &> /dev/null; then
    npm run lint --silent
    if [ $? -ne 0 ]; then
        echo "❌ Найдены ошибки в React коде"
        exit 1
    fi
fi

echo "✅ Все проверки пройдены!"
exit 0
"""
        pre_commit_hook.write_text(pre_commit_content)
        pre_commit_hook.chmod(0o755)

    def _create_config_files(self):
        """Создание конфигурационных файлов"""
        print("📄 Создание конфигурационных файлов...")

        # Docker Compose для разработки
        docker_compose = self.root_dir / "docker-compose.dev.yml"
        docker_compose_content = """version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=sqlite:///./sql_app.db
      - DEBUG=True
    depends_on:
      - redis
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      - backend

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: commission_db
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
"""
        docker_compose.write_text(docker_compose_content)

        # Makefile для удобства
        makefile = self.root_dir / "Makefile"
        makefile_content = """# UK Commission Admin Panel - Makefile

.PHONY: setup start-backend start-frontend start-full test clean build

setup:
	python setup-project.py setup

start-backend:
	python setup-project.py start-backend

start-frontend:
	python setup-project.py start-frontend

start-full:
	python setup-project.py start-full

test:
	python setup-project.py test

clean:
	python setup-project.py clean

build:
	python setup-project.py build

docker-dev:
	docker-compose -f docker-compose.dev.yml up --build

docker-prod:
	docker-compose -f docker-compose.yml up --build

lint:
	cd backend && ruff check .
	cd frontend && npm run lint

format:
	cd backend && ruff format .
	cd frontend && npm run format
"""
        makefile.write_text(makefile_content)

    def start_backend(self):
        """Запуск backend сервера"""
        print("🚀 Запуск backend сервера...")

        venv_path = self.backend_dir / ".venv"
        if self.system == 'windows':
            python_venv = str(venv_path / "Scripts" / "python")
        else:
            python_venv = str(venv_path / "bin" / "python")

        # Запуск FastAPI сервера
        self._run_command([
            python_venv, '-m', 'uvicorn',
            'app.main:app',
            '--reload',
            '--host', '0.0.0.0',
            '--port', '8000'
        ], cwd=self.backend_dir)

    def start_frontend(self):
        """Запуск frontend сервера"""
        print("🚀 Запуск frontend сервера...")
        self._run_command([self.npm_cmd, 'start'], cwd=self.frontend_dir)

    def start_full(self):
        """Запуск полного стека через Docker Compose"""
        print("🚀 Запуск полного стека...")
        self._run_command(['docker-compose', '-f', 'docker-compose.dev.yml', 'up', '--build'])

    def test(self):
        """Запуск тестов"""
        print("🧪 Запуск тестов...")

        # Backend тесты
        print("🐍 Тесты backend...")
        try:
            self._run_command([self.python_cmd, '-m', 'pytest', 'tests/'],
                              cwd=self.backend_dir)
        except subprocess.CalledProcessError:
            print("⚠️ Backend тесты не настроены или завершились с ошибкой")

        # Frontend тесты
        print("⚛️ Тесты frontend...")
        try:
            self._run_command([self.npm_cmd, 'test', '--watchAll=false'],
                              cwd=self.frontend_dir)
        except subprocess.CalledProcessError:
            print("⚠️ Frontend тесты не настроены или завершились с ошибкой")

    def clean(self):
        """Очистка проекта"""
        print("🧹 Очистка проекта...")

        # Очистка Python кэша
        for cache_dir in self.root_dir.rglob("__pycache__"):
            shutil.rmtree(cache_dir, ignore_errors=True)

        for pyc_file in self.root_dir.rglob("*.pyc"):
            pyc_file.unlink(missing_ok=True)

        # Очистка node_modules если нужно
        node_modules = self.frontend_dir / "node_modules"
        if node_modules.exists():
            answer = input("Удалить node_modules? (y/N): ")
            if answer.lower() == 'y':
                shutil.rmtree(node_modules)

        print("✅ Очистка завершена")

    def build(self):
        """Сборка продакшен версии"""
        print("🏗️ Сборка продакшен версии...")

        # Сборка frontend
        self._run_command([self.npm_cmd, 'run', 'build'], cwd=self.frontend_dir)

        # Копирование статики в backend
        build_dir = self.frontend_dir / "build"
        static_dir = self.backend_dir / "static"

        if build_dir.exists():
            if static_dir.exists():
                shutil.rmtree(static_dir)
            shutil.copytree(build_dir, static_dir)

        print("✅ Продакшен сборка готова")

    def status(self):
        """Показать статус проекта"""
        print("📊 Статус проекта Commission Tracker")
        print("=" * 50)

        # Проверка структуры
        dirs = {
            'Backend': self.backend_dir,
            'Frontend': self.frontend_dir,
            'Backend venv': self.backend_dir / '.venv',
            'Frontend node_modules': self.frontend_dir / 'node_modules'
        }

        for name, path in dirs.items():
            status = "✅" if path.exists() else "❌"
            print(f"{status} {name}: {path}")

        # Проверка файлов конфигурации
        configs = {
            'Backend .env': self.backend_dir / '.env',
            'Frontend .env': self.frontend_dir / '.env',
            'Docker Compose': self.root_dir / 'docker-compose.dev.yml'
        }

        print("\n📄 Конфигурационные файлы:")
        for name, path in configs.items():
            status = "✅" if path.exists() else "❌"
            print(f"{status} {name}: {path}")

def main():
    """Главная функция"""
    manager = ProjectManager()

    if len(sys.argv) < 2:
        print("Использование: python setup-project.py <command>")
        print("Команды:")
        print("  setup         - Первоначальная настройка")
        print("  start-backend - Запуск backend")
        print("  start-frontend- Запуск frontend")
        print("  start-full    - Запуск полного стека")
        print("  test          - Запуск тестов")
        print("  clean         - Очистка проекта")
        print("  build         - Сборка продакшен версии")
        print("  status        - Статус проекта")
        return

    command = sys.argv[1]

    try:
        if command == 'setup':
            manager.setup_project()
        elif command == 'start-backend':
            manager.start_backend()
        elif command == 'start-frontend':
            manager.start_frontend()
        elif command == 'start-full':
            manager.start_full()
        elif command == 'test':
            manager.test()
        elif command == 'clean':
            manager.clean()
        elif command == 'build':
            manager.build()
        elif command == 'status':
            manager.status()
        else:
            print(f"Неизвестная команда: {command}")
    except Exception as e:
        print(f"❌ Ошибка: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
