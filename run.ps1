
# Основной скрипт для управления проектом UK Commission Admin Panel

# Устанавливаем рабочую директорию в местоположение скрипта
Set-Location $PSScriptRoot

# --- Функции ---
function Show-Menu {
    Clear-Host
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host "   Панель управления UK Commission Project   " -ForegroundColor Green
    Write-Host "============================================="
    Write-Host
    Write-Host " [1] Полная настройка проекта (Setup)" -ForegroundColor Cyan
    Write-Host " [2] Запустить Backend (Django Server)" -ForegroundColor Cyan
    Write-Host " [3] Запустить Frontend (React App)" -ForegroundColor Cyan
    Write-Host " [4] Запустить полный стек (Backend + Frontend)" -ForegroundColor Cyan
    Write-Host " [5] Проверить статус проекта" -ForegroundColor Yellow
    Write-Host " [6] Открыть проект в PyCharm" -ForegroundColor Magenta
    Write-Host
    Write-Host " [Q] Выход" -ForegroundColor Red
    Write-Host
}

function Setup-Project {
    Write-Host "`n--- [1] Настройка проекта ---" -ForegroundColor Green

    # Проверка Python
    if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
        Write-Host "❌ ОШИБКА: Python не найден. Установите его и добавьте в PATH." -ForegroundColor Red
        return
    }
    Write-Host "✅ Python найден: $((python --version) 2>&1)"

    # Создание виртуального окружения
    if (-not (Test-Path ".\venv")) {
        Write-Host "`n🐍 Создание виртуального окружения 'venv'..."
        python -m venv venv
        Write-Host "✅ Виртуальное окружение создано."
    } else {
        Write-Host "`n✅ Виртуальное окружение 'venv' уже существует."
    }

    # Активация и установка зависимостей
    Write-Host "`n📦 Установка Python зависимостей из requirements.txt..."
    # Подавляем вывод pip для чистоты
    & ".\venv\Scripts\pip.exe" install -r requirements.txt --quiet
    Write-Host "✅ Backend зависимости установлены."

    # Установка Frontend зависимостей
    if (Test-Path ".\frontend\package.json") {
        Write-Host "`n📦 Установка Frontend зависимостей (npm install)..."
        Push-Location -Path ".\frontend"
        npm install --quiet
        Pop-Location
        Write-Host "✅ Frontend зависимости установлены."
    }
    Write-Host "`n🎉 Настройка проекта завершена!" -ForegroundColor Green
}

function Start-Backend {
    Write-Host "`n--- [2] Запуск Backend (Django) ---" -ForegroundColor Green
    if (-not (Test-Path ".\venv\Scripts\activate.ps1")) {
        Write-Host "❌ ОШИБКА: Виртуальное окружение не найдено. Запустите настройку (пункт 1)." -ForegroundColor Red
        return
    }
    Write-Host "Выполнение миграций..."
    & ".\venv\Scripts\python.exe" manage.py migrate
    Write-Host "🚀 Запуск Django сервера на http://127.0.0.1:8000"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '.\venv\Scripts\python.exe' manage.py runserver"
}

function Start-Frontend {
    Write-Host "`n--- [3] Запуск Frontend (React) ---" -ForegroundColor Green
    if (-not (Test-Path ".\frontend\node_modules")) {
        Write-Host "❌ ОШИБКА: Зависимости Frontend не установлены. Запустите настройку (пункт 1)." -ForegroundColor Red
        return
    }
    Write-Host "🚀 Запуск React dev-сервера на http://localhost:3000"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"
}

function Check-Status {
    Write-Host "`n--- [5] Проверка статуса проекта ---" -ForegroundColor Yellow
    $statusScriptPath = Join-Path $PSScriptRoot "project_status.ps1"
    if (Test-Path $statusScriptPath) {
        # Используем Invoke-Expression для запуска скрипта в текущей области видимости
        Invoke-Expression "& `"$statusScriptPath`""
    } else {
        Write-Host "❌ Файл project_status.ps1 не найден!" -ForegroundColor Red
    }
}

function Open-PyCharm {
    Write-Host "`n--- [6] Открытие проекта в PyCharm ---" -ForegroundColor Magenta
    if (Get-Command pycharm -ErrorAction SilentlyContinue) {
        Write-Host "✅ Запускаю PyCharm..."
        pycharm .
    } else {
        Write-Host "❌ ОШИБКА: Команда 'pycharm' не найдена." -ForegroundColor Red
        Write-Host "   Убедитесь, что PyCharm установлен и путь к исполняемому файлу добавлен в PATH." -ForegroundColor Yellow
    }
}

# --- Основной цикл ---
while ($true) {
    Show-Menu
    $choice = Read-Host "➡️  Выберите действие"

    switch ($choice) {
        "1" {
            Setup-Project
        }
        "2" {
            Start-Backend
            Write-Host "`nBackend запущен в новом окне."
        }
        "3" {
            Start-Frontend
            Write-Host "`nFrontend запущен в новом окне."
        }
        "4" {
            Write-Host "`n--- [4] Запуск полного стека ---" -ForegroundColor Green
            Start-Backend
            Start-Frontend
            Write-Host "`n✅ Полный стек запущен в новых окнах."
        }
        "5" {
            Check-Status
        }
        "6" {
            Open-PyCharm
        }
        "q" {
            Write-Host "👋 До свидания!"
            break
        }
        default {
            Write-Host "❌ Неверный выбор. Попробуйте снова." -ForegroundColor Red
        }
    }

    # Пауза для просмотра вывода перед возвратом в меню
    if ($choice -ne "q") {
        Read-Host "`nНажмите Enter для возврата в меню..."
    }
}
