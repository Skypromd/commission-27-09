# Как узнать структуру фронтенда

Чтобы увидеть полную структуру папок и файлов вашего фронтенд-приложения, выполните в терминале PowerShell следующую команду:

```powershell
Get-ChildItem -Path 'C:\Users\piese\PcharmProjects\commission-tracker\frontend' -Recurse | Format-Table FullName
```

Эта команда рекурсивно обойдет все директории, начиная с `frontend/`, и выведет полный путь к каждому файлу и папке.

