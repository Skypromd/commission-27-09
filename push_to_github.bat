@echo off
cd /d %~dp0

if not exist ".git" (
    git init
)

set /p branch_name="Введите имя новой ветки для Pull Request (оставьте пустым для отправки в текущую): "

if defined branch_name (
    git checkout -b "%branch_name%"
)

git add .

git diff --quiet --cached
if errorlevel 1 (
    set /p commit_message="Введите сообщение коммита (оставьте пустым для 'Update'): "
    if not defined commit_message set commit_message=Update
    git commit -m "%commit_message%"
) else (
    echo Нет изменений для коммита.
)

git remote | findstr origin >nul
if errorlevel 1 (
    git remote add origin https://github.com/Skypromd/uk-commission-admin-panel.git
)

for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do (
    set current_branch=%%a
)

echo Отправка на ветку %current_branch%...
git push -u origin %current_branch%

if defined branch_name (
    echo.
    echo Чтобы создать Pull Request, перейдите по ссылке:
    echo https://github.com/Skypromd/uk-commission-admin-panel/pull/new/%current_branch%
)

echo.
echo Готово.
pause
