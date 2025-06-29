#!/usr/bin/env python3
"""
Скрипт для автоматичного додавання title до всіх OpenAPI схем без title.
Це усуває warnings типу "Inline schema created as SchemeName_property".
"""

import os
import re
import sys
from pathlib import Path


def add_title_to_schema(content, schema_name, schema_start_pos):
    """Додає title до схеми якщо його немає"""

    # Знаходимо початок схеми
    lines = content.split('\n')
    schema_line_num = content[:schema_start_pos].count('\n')

    # Перевіряємо чи вже є title
    schema_content = ""
    indent_level = None
    i = schema_line_num + 1

    # Знаходимо рівень відступу схеми
    schema_line = lines[schema_line_num]
    schema_indent = len(schema_line) - len(schema_line.lstrip())

    # Перевіряємо чи є title в наступних рядках схеми
    while i < len(lines):
        line = lines[i]
        if line.strip() == "":
            i += 1
            continue

        line_indent = len(line) - len(line.lstrip())

        # Якщо відступ менший або рівний схемі - схема закінчилась
        if line_indent <= schema_indent and line.strip():
            break

        if 'title:' in line:
            return content  # Title вже є

        i += 1

    # Додаємо title після "type: object"
    type_line_pattern = f'^{" " * schema_indent}{schema_name}:\\s*$'
    type_object_pattern = f'^{" " * (schema_indent + 2)}type: object\\s*$'

    new_lines = []
    schema_found = False
    title_added = False

    for i, line in enumerate(lines):
        new_lines.append(line)

        # Знаходимо нашу схему
        if re.match(type_line_pattern, line):
            schema_found = True
            continue

        # Якщо знайшли схему і type: object, додаємо title
        if schema_found and re.match(type_object_pattern, line) and not title_added:
            title_line = f'{" " * (schema_indent + 2)}title: {schema_name}'
            new_lines.append(title_line)
            title_added = True
            schema_found = False

    return '\n'.join(new_lines)


def fix_openapi_file(file_path):
    """Виправляє один OpenAPI файл"""
    print(f"Обробка файлу: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Знаходимо всі схеми верхнього рівня
    schema_pattern = r'^([A-Za-z][A-Za-z0-9_]*):?\s*$'
    type_object_pattern = r'^(\s+)type: object\s*$'

    lines = content.split('\n')

    for i, line in enumerate(lines):
        # Якщо це схема верхнього рівня (без відступу)
        if re.match(r'^[A-Za-z][A-Za-z0-9_]*:\s*$', line):
            schema_name = line.rstrip(':').strip()

            # Перевіряємо наступні рядки на type: object
            j = i + 1
            while j < len(lines) and (lines[j].strip() == '' or lines[j].startswith('  ')):
                if re.match(r'^\s+type: object\s*$', lines[j]):
                    # Перевіряємо чи є title після type: object
                    has_title = False
                    k = j + 1
                    while k < len(lines) and lines[k].startswith('  '):
                        if 'title:' in lines[k]:
                            has_title = True
                            break
                        if lines[k].strip() and not lines[k].startswith('    '):
                            break
                        k += 1

                    # Якщо немає title, додаємо його
                    if not has_title:
                        indent = '  '
                        title_line = f'{indent}title: {schema_name}'
                        description_line = f'{indent}description: {schema_name} схема'

                        # Вставляємо після type: object
                        lines.insert(j + 1, title_line)
                        print(f"  Додано title для схеми: {schema_name}")
                    break
                j += 1

    # Записуємо оновлений контент
    updated_content = '\n'.join(lines)

    if updated_content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"  ✅ Файл оновлено")
        return True
    else:
        print(f"  ℹ️  Зміни не потрібні")
        return False


def main():
    """Головна функція"""
    backend_dir = Path(__file__).parent.parent / 'backend' / 'src' / 'main' / 'resources' / 'openapi'

    if not backend_dir.exists():
        print(f"❌ Директорія не знайдена: {backend_dir}")
        sys.exit(1)

    print(f"🔍 Пошук OpenAPI файлів в: {backend_dir}")

    yaml_files = list(backend_dir.rglob('*.yaml'))

    if not yaml_files:
        print("❌ OpenAPI файли не знайдені")
        sys.exit(1)

    print(f"📁 Знайдено {len(yaml_files)} YAML файлів")

    updated_count = 0

    for yaml_file in yaml_files:
        try:
            if fix_openapi_file(yaml_file):
                updated_count += 1
        except Exception as e:
            print(f"❌ Помилка обробки {yaml_file}: {e}")

    print(f"\n✅ Обробка завершена!")
    print(f"📊 Оновлено файлів: {updated_count}")
    print(f"📊 Всього файлів: {len(yaml_files)}")


if __name__ == '__main__':
    main()
