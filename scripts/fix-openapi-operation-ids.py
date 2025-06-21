#!/usr/bin/env python3
"""
Скрипт для автоматичного додавання operationId до всіх операцій в OpenAPI файлах.
Генерує осмислені назви методів замість автоматично згенерованих.
"""

import yaml
import os
import re
from pathlib import Path

def camel_case(text):
    """Конвертує текст в camelCase"""
    # Видаляємо спеціальні символи та розділяємо на слова
    words = re.findall(r'[a-zA-Z0-9]+', text)
    if not words:
        return text
    # Перше слово маленькими літерами, решта з великої літери
    return words[0].lower() + ''.join(word.capitalize() for word in words[1:])

def generate_operation_id(method, path, summary=""):
    """Генерує operationId на основі HTTP методу, шляху та summary"""

    # Видаляємо /api/ префікс
    clean_path = path.replace('/api/', '')

    # Розділяємо шлях на частини
    path_parts = [part for part in clean_path.split('/') if part and not part.startswith('{')]

    # Базові дії для HTTP методів
    method_actions = {
        'get': 'get',
        'post': 'create',
        'put': 'update',
        'patch': 'update',
        'delete': 'delete'
    }

    if len(path_parts) == 0:
        return method_actions.get(method, method)

    resource = path_parts[0].rstrip('s')  # singular form
    action = method_actions.get(method, method)

    # Спеціальні випадки для складних шляхів
    if 'search' in clean_path:
        if 'advanced' in clean_path:
            return f"advancedSearch{resource.capitalize()}s"
        return f"search{resource.capitalize()}s"

    if 'contacts' in clean_path:
        if method == 'get':
            return f"get{resource.capitalize()}Contacts"
        elif method == 'put':
            return f"update{resource.capitalize()}Contacts"
        elif method == 'post':
            return f"create{resource.capitalize()}Contacts"

    if 'statistics' in clean_path:
        return f"get{resource.capitalize()}Statistics"

    if 'pdf' in clean_path:
        if method == 'get':
            return f"get{resource.capitalize()}Pdf"
        elif method == 'post':
            return f"generate{resource.capitalize()}Pdf"

    if 'print' in clean_path:
        return f"print{resource.capitalize()}"

    if 'download' in clean_path:
        return f"download{resource.capitalize()}"

    if 'generate' in clean_path:
        if len(path_parts) > 1:
            return f"generate{path_parts[1].capitalize()}"
        return f"generate{resource.capitalize()}"

    if 'number' in clean_path:
        return f"get{resource.capitalize()}ByNumber"

    # Для GET з ID параметром
    if method == 'get' and '{id}' in path:
        return f"get{resource.capitalize()}ById"

    # Для списків (GET без ID)
    if method == 'get' and '{id}' not in path:
        return f"get{path_parts[0].capitalize()}"

    # Для інших методів
    return f"{action}{resource.capitalize()}"

def fix_openapi_file(file_path):
    """Виправляє один OpenAPI файл, додаючи operationId"""
    print(f"Обробка файлу: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    if 'paths' not in data:
        print(f"  Пропускаємо {file_path} - немає paths")
        return

    changes_made = False
    used_operation_ids = set()

    # Спочатку збираємо всі існуючі operationId
    for path, path_data in data['paths'].items():
        for method, operation in path_data.items():
            if method.lower() in ['get', 'post', 'put', 'patch', 'delete']:
                if 'operationId' in operation:
                    used_operation_ids.add(operation['operationId'])

    # Тепер додаємо нові operationId
    for path, path_data in data['paths'].items():
        for method, operation in path_data.items():
            if method.lower() in ['get', 'post', 'put', 'patch', 'delete']:
                if 'operationId' not in operation:
                    summary = operation.get('summary', '')
                    operation_id = generate_operation_id(method.lower(), path, summary)

                    # Перевіряємо унікальність
                    counter = 1
                    original_operation_id = operation_id
                    while operation_id in used_operation_ids:
                        operation_id = f"{original_operation_id}{counter}"
                        counter += 1

                    operation['operationId'] = operation_id
                    used_operation_ids.add(operation_id)
                    changes_made = True
                    print(f"  Додано operationId: {method.upper()} {path} -> {operation_id}")

    if changes_made:
        with open(file_path, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
        print(f"  Файл {file_path} оновлено")
    else:
        print(f"  Файл {file_path} не потребує змін")

def main():
    """Головна функція"""
    openapi_dir = Path('backend/src/main/resources/openapi')

    if not openapi_dir.exists():
        print(f"Директорія {openapi_dir} не існує")
        return

    yaml_files = list(openapi_dir.glob('*.yaml')) + list(openapi_dir.glob('*.yml'))

    if not yaml_files:
        print(f"OpenAPI файли не знайдені в {openapi_dir}")
        return

    print(f"Знайдено {len(yaml_files)} OpenAPI файлів")
    print("=" * 50)

    for yaml_file in yaml_files:
        try:
            fix_openapi_file(yaml_file)
            print()
        except Exception as e:
            print(f"Помилка обробки {yaml_file}: {e}")
            print()

    print("=" * 50)
    print("Обробка завершена!")
    print("Тепер запустіть: mvn clean generate-sources")

if __name__ == '__main__':
    main()
