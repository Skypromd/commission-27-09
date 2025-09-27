# PowerShell скрипт для запуска тестов
Write-Host "==================================="
Write-Host "Запуск тестов" -ForegroundColor Cyan
Write-Host "==================================="

# Проверка структуры проекта
if (Test-Path -Path "frontend\package.json") {
    # Проект в директории frontend
    Write-Host "Проект находится в директории frontend" -ForegroundColor Yellow
    Set-Location -Path "frontend"
    $in_frontend = $true
} else {
    # Проект в корневой директории
    Write-Host "Проект находится в корневой директории" -ForegroundColor Yellow
    $in_frontend = $false
}

# Запуск тестов
$test_all = Read-Host "Запустить все тесты? (y/n, по умолчанию: y)"
if ($test_all -eq "" -or $test_all -eq "y") {
    npm run test -- --watchAll
} else {
    npm test
}

# Возвращаемся в исходную директорию
if ($in_frontend) {
    Set-Location -Path ".."
}

Write-Host "==================================="
Write-Host "Завершено!" -ForegroundColor Green
Write-Host "==================================="
