import re

settings_path = r'A:\skypromd\uk-commission-admin-panel\backend\config\settings.py'
try:
    with open(settings_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Ищем блок INSTALLED_APPS
    match = re.search(r'INSTALLED_APPS\s*=\s*\[(.*?)\]', content, re.DOTALL)

    if match:
        installed_apps_content = match.group(1)
        print("--- INSTALLED_APPS FOUND ---")
        print(installed_apps_content.strip())
        print("--------------------------")
    else:
        print("--- ERROR: INSTALLED_APPS not found in settings.py ---")

except FileNotFoundError:
    print(f"--- ERROR: File not found at {settings_path} ---")
except Exception as e:
    print(f"--- ERROR: An error occurred: {e} ---")

