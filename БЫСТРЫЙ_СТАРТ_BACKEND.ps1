
# 🚨 ЭКСТРЕННЫЙ ЗАПУСК DJANGO BACKEND 🚨
$Host.UI.RawUI.WindowTitle = "🚨 ЭКСТРЕННЫЙ ЗАПУСК DJANGO BACKEND 🚨"
$Host.UI.RawUI.BackgroundColor = "DarkRed"
$Host.UI.RawUI.ForegroundColor = "White"
Clear-Host

Write-Host "🚨============================================🚨"
Write-Host "   ЭКСТРЕННЫЙ ЗАПУСК DJANGO BACKEND"
Write-Host "🚨============================================🚨"
Write-Host

# Устанавливаем рабочую директорию в местоположение скрипта
Set-Location $PSScriptRoot

# --- Проверка ключевых файлов ---
Write-Host "[1] Проверка файла manage.py..."
if (-not (Test-Path ".\manage.py")) {
    Write-Host "❌ КРИТИЧЕСКАЯ ОШИБКА: Файл 'manage.py' не найден!"
    Write-Host "   Запуск невозможен."
    Read-Host "Нажмите Enter для выхода..."
    exit
}
Write-Host "✅ 'manage.py' найден."
Write-Host

# --- Определение интерпретатора Python ---
Write-Host "[2] Поиск интерпретатора Python..."
$pythonExecutable = ""
if (Test-Path ".\venv\Scripts\python.exe") {
    $pythonExecutable = ".\venv\Scripts\python.exe"
    Write-Host "✅ Найден Python в виртуальном окружении 'venv'."
} else {
    $pythonExecutable = "python"
    Write-Host "⚠️ ВНИМАНИЕ: Виртуальное окружение 'venv' не найдено."
    Write-Host "   Будет использован глобальный 'python'."
    Write-Host "   Это может привести к ошибкам зависимостей."
}
Write-Host

# --- Запуск сервера ---
Write-Host "[3] Запуск Django development server..."
Write-Host "--------------------------------------------------"
Write-Host "Команда: $pythonExecutable manage.py runserver"
Write-Host "URL: http://127.0.0.1:8000"
Write-Host "Для остановки сервера нажмите CTRL+C в этом окне."
Write-Host "--------------------------------------------------"
Write-Host

# Сбрасываем цвета перед запуском, чтобы вывод сервера был читаемым
Reset-HostColors
& $pythonExecutable manage.py runserver

# Функция для сброса цветов консоли
function Reset-HostColors {
    $Host.UI.RawUI.BackgroundColor = "Black"
    $Host.UI.RawUI.ForegroundColor = "Gray"
}

# Сбрасываем цвета при выходе
Reset-HostColors
Write-Host "Сервер остановлен."
Read-Host "Нажмите Enter для закрытия окна..."
