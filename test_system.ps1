# UK Financial Services - PowerShell Test Script
# Тестирование всех основных endpoints системы

Write-Host "🚀 UK FINANCIAL SERVICES - ТЕСТИРОВАНИЕ СИСТЕМЫ" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Gray

$baseUrl = "http://localhost:8000"
$testResults = @()

# Функция для HTTP запросов
function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Description
    )

    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET -UseBasicParsing -TimeoutSec 5
        $statusCode = $response.StatusCode
        $contentLength = $response.Content.Length

        if ($statusCode -eq 200) {
            Write-Host "✅ $Description" -ForegroundColor Green
            Write-Host "   URL: $Url" -ForegroundColor Gray
            Write-Host "   Status: $statusCode | Size: $contentLength bytes" -ForegroundColor Gray

            # Если это JSON, попробуем показать краткую информацию
            if ($response.Headers.'Content-Type' -match 'application/json') {
                try {
                    $json = $response.Content | ConvertFrom-Json
                    if ($json.status) {
                        Write-Host "   Status: $($json.status)" -ForegroundColor Cyan
                    }
                    if ($json.version) {
                        Write-Host "   Version: $($json.version)" -ForegroundColor Cyan
                    }
                } catch {
                    # Ignore JSON parsing errors for display
                }
            }

            $script:testResults += @{
                Endpoint = $Description
                Url = $Url
                Status = "✅ Success"
                Code = $statusCode
            }
        } else {
            Write-Host "⚠️ $Description" -ForegroundColor Yellow
            Write-Host "   URL: $Url" -ForegroundColor Gray
            Write-Host "   Status: $statusCode" -ForegroundColor Yellow

            $script:testResults += @{
                Endpoint = $Description
                Url = $Url
                Status = "⚠️ Warning"
                Code = $statusCode
            }
        }
    } catch {
        Write-Host "❌ $Description" -ForegroundColor Red
        Write-Host "   URL: $Url" -ForegroundColor Gray
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red

        $script:testResults += @{
            Endpoint = $Description
            Url = $Url
            Status = "❌ Failed"
            Code = "Error"
        }
    }

    Write-Host ""
}

# Основные endpoints для тестирования
Write-Host "🔍 ТЕСТИРОВАНИЕ ОСНОВНЫХ ENDPOINTS" -ForegroundColor Yellow
Write-Host ""

$endpoints = @(
    @{ Url = "$baseUrl/"; Description = "🏠 Главная страница (исправленная)" },
    @{ Url = "$baseUrl/health"; Description = "🏥 Health Check" },
    @{ Url = "$baseUrl/docs"; Description = "📚 API Documentation" },
    @{ Url = "$baseUrl/api/modules"; Description = "🎯 Available Modules" },
    @{ Url = "$baseUrl/api/dashboard/stats"; Description = "📊 Dashboard Statistics" },
    @{ Url = "$baseUrl/api/clients"; Description = "👥 Clients API" },
    @{ Url = "$baseUrl/api/commissions"; Description = "💰 Commissions API" },
    @{ Url = "$baseUrl/api/consultants"; Description = "👔 Consultants API" },
    @{ Url = "$baseUrl/api/sales"; Description = "📈 Sales API" },
    @{ Url = "$baseUrl/api/processes"; Description = "⚙️ Processes API" },
    @{ Url = "$baseUrl/api/finances"; Description = "💰 Finances API" },
    @{ Url = "$baseUrl/api/reports"; Description = "📋 Reports API" },
    @{ Url = "$baseUrl/api/settings"; Description = "⚙️ Settings API" },
    @{ Url = "$baseUrl/api/ml_analytics/predictions"; Description = "🧠 ML Analytics" },
    @{ Url = "$baseUrl/api/ai_analytics/insights"; Description = "🤖 AI Analytics" },
    @{ Url = "$baseUrl/api/properties"; Description = "🏠 Properties API" },
    @{ Url = "$baseUrl/api/excellence/metrics"; Description = "🏆 Excellence Metrics" },
    @{ Url = "$baseUrl/api/system/info"; Description = "ℹ️ System Information" }
)

foreach ($endpoint in $endpoints) {
    Test-Endpoint -Url $endpoint.Url -Description $endpoint.Description
}

# Итоговая статистика
Write-Host "📊 ИТОГИ ТЕСТИРОВАНИЯ" -ForegroundColor Yellow
Write-Host "=" * 30 -ForegroundColor Gray

$successCount = ($testResults | Where-Object { $_.Status -eq "✅ Success" }).Count
$warningCount = ($testResults | Where-Object { $_.Status -eq "⚠️ Warning" }).Count
$failedCount = ($testResults | Where-Object { $_.Status -eq "❌ Failed" }).Count
$totalCount = $testResults.Count

Write-Host "Всего endpoints: $totalCount" -ForegroundColor Gray
Write-Host "✅ Успешных: $successCount" -ForegroundColor Green
Write-Host "⚠️ Предупреждений: $warningCount" -ForegroundColor Yellow
Write-Host "❌ Ошибок: $failedCount" -ForegroundColor Red

$successRate = [math]::Round(($successCount / $totalCount) * 100, 1)
Write-Host ""
Write-Host "🎯 ОБЩИЙ РЕЗУЛЬТАТ: $successRate% успешных запросов" -ForegroundColor Cyan

if ($successRate -ge 90) {
    Write-Host "🏆 ОТЛИЧНО! Система работает превосходно!" -ForegroundColor Green
} elseif ($successRate -ge 75) {
    Write-Host "✅ ХОРОШО! Система работает стабильно" -ForegroundColor Green
} elseif ($successRate -ge 50) {
    Write-Host "⚠️ Система работает частично" -ForegroundColor Yellow
} else {
    Write-Host "❌ Требуется диагностика системы" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 ДОСТУПНЫЕ АДРЕСА:" -ForegroundColor Yellow
Write-Host "• Главная страница: http://localhost:8000" -ForegroundColor Cyan
Write-Host "• API документация: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "• Health check: http://localhost:8000/health" -ForegroundColor Cyan
Write-Host "• Frontend (если запущен): http://localhost:5173" -ForegroundColor Cyan

Write-Host ""
Write-Host "✅ Тестирование завершено!" -ForegroundColor Green
