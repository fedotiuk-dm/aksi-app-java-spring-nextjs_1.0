#!/usr/bin/env python3
"""
Скрипт для виправлення проблем в OpenAPI файлах:
1. Заміна format: decimal на format: double
2. Виправлення некоректних operationId
"""

import yaml
import re
from pathlib import Path

def fix_decimal_format(content):
    """Замінює format: decimal на format: double"""
    return content.replace('format: decimal', 'format: double')

def fix_openapi_file(file_path):
    """Виправляє OpenAPI файл"""
    print(f"Обробка файлу: {file_path}")

    # Читаємо як текст для заміни format
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Виправляємо format: decimal
    original_content = content
    content = fix_decimal_format(content)

    if content != original_content:
        print(f"  Виправлено format: decimal -> format: double")

    # Записуємо назад
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    # Тепер працюємо з YAML для operationId
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)

        if 'paths' not in data:
            return

        changes_made = False
        used_operation_ids = set()

        # Збираємо всі існуючі operationId
        for path, path_data in data['paths'].items():
            for method, operation in path_data.items():
                if method.lower() in ['get', 'post', 'put', 'patch', 'delete']:
                    if 'operationId' in operation:
                        used_operation_ids.add(operation['operationId'])

        # Виправляємо проблемні operationId
        for path, path_data in data['paths'].items():
            for method, operation in path_data.items():
                if method.lower() in ['get', 'post', 'put', 'patch', 'delete']:
                    if 'operationId' in operation:
                        old_id = operation['operationId']
                        new_id = fix_operation_id(old_id, method, path)

                        if new_id != old_id:
                            # Перевіряємо унікальність
                            counter = 1
                            original_new_id = new_id
                            while new_id in used_operation_ids:
                                new_id = f"{original_new_id}{counter}"
                                counter += 1

                            operation['operationId'] = new_id
                            used_operation_ids.remove(old_id)
                            used_operation_ids.add(new_id)
                            changes_made = True
                            print(f"  Виправлено operationId: {old_id} -> {new_id}")

        if changes_made:
            with open(file_path, 'w', encoding='utf-8') as f:
                yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

    except Exception as e:
        print(f"  Помилка обробки YAML: {e}")

def fix_operation_id(operation_id, method, path):
    """Виправляє некоректні operationId"""
    # Видаляємо дефіси та робимо camelCase
    if '-' in operation_id:
        parts = operation_id.split('-')
        operation_id = parts[0] + ''.join(word.capitalize() for word in parts[1:])

    # Виправляємо специфічні проблеми
    fixes = {
        'generateGenerate': 'generateQrCode',
        'getQrcodeById': 'getQrCodeById',
        'createDigitalsignature': 'createDigitalSignature',
        'getDigitalsignatureById': 'getDigitalSignatureById',
        'getDigitalsignatureById1': 'getDigitalSignatureImageById',
    }

    if operation_id in fixes:
        return fixes[operation_id]

    # Видаляємо цифри в кінці (getOrderById1 -> getOrderById)
    operation_id = re.sub(r'\d+$', '', operation_id)

    return operation_id

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
    print("Виправлення завершено!")
    print("Тепер запустіть: mvn clean generate-sources")

if __name__ == '__main__':
    main()
