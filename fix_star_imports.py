#!/usr/bin/env python3
"""
Скрипт для заміни зіркових імпортів (import package.*) на конкретні імпорти в Java файлах.
Цей скрипт шукає файли з попередженнями про зіркові імпорти у логах checkstyle
і замінює зіркові імпорти на конкретні, використовуючи інформацію про те,
які класи фактично використовуються у файлі.
"""

import os
import re
import sys
import glob
import subprocess

def read_file(file_path):
    """Читає вміст файлу."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        print(f"Помилка при читанні файлу {file_path}: {e}")
        return None

def write_file(file_path, content):
    """Записує вміст у файл."""
    try:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
        return True
    except Exception as e:
        print(f"Помилка при записі у файл {file_path}: {e}")
        return False

def extract_star_import_warnings(logs_path):
    """Видобуває шляхи до файлів з попередженнями про зіркові імпорти з логів."""
    content = read_file(logs_path)
    if not content:
        return []
    
    # Шаблон для пошуку попереджень про зіркові імпорти
    pattern = r'\[WARN\] (\/[^\s]+):[0-9]+:[0-9]+: Using the \'\.\*\' form of import should be avoided'
    matches = re.findall(pattern, content)
    return list(set(matches))  # Повертаємо унікальні шляхи

def find_star_imports(content):
    """Знаходить всі зіркові імпорти у вмісті файлу."""
    # Шаблон для пошуку зіркових імпортів
    pattern = r'import\s+([a-zA-Z0-9_\.]+)\.\*;'
    return re.findall(pattern, content)

def find_classes_used_from_package(content, package):
    """Знаходить всі класи з пакета, які використовуються у файлі."""
    # Регулярний вираз для пошуку використання класів у коді
    # Це складний паттерн, який шукає різні контексти використання класів
    
    # Спочатку створимо список можливих класів з пакета
    common_classes = set()
    
    # Пакети і класи, які часто імпортуються
    common_package_classes = {
        'jakarta.persistence': [
            'Entity', 'Table', 'Id', 'GeneratedValue', 'Column', 'JoinColumn', 
            'ManyToOne', 'OneToMany', 'ManyToMany', 'OneToOne', 'Enumerated', 
            'ElementCollection', 'CollectionTable', 'Temporal', 'Transient', 
            'EnumType', 'CascadeType', 'FetchType', 'GenerationType', 'OrderBy',
            'Embedded', 'Embeddable', 'EmbeddedId', 'MapKeyColumn', 'MapKey'
        ],
        'org.springframework.web.bind.annotation': [
            'RestController', 'RequestMapping', 'GetMapping', 'PostMapping', 
            'PutMapping', 'DeleteMapping', 'PatchMapping', 'RequestBody', 
            'PathVariable', 'RequestParam', 'ResponseBody', 'ResponseStatus',
            'ExceptionHandler', 'ControllerAdvice', 'CrossOrigin'
        ],
        'java.util': [
            'List', 'ArrayList', 'Map', 'HashMap', 'Set', 'HashSet', 'Optional',
            'Collection', 'Collections', 'Date', 'UUID', 'Arrays', 'Objects',
            'Iterator', 'stream', 'Stream', 'Comparator'
        ]
    }
    
    # Якщо пакет є у нашому словнику, використовуємо ці класи
    if package in common_package_classes:
        common_classes = set(common_package_classes[package])
    
    # Шукаємо фактичне використання класів
    used_classes = set()
    
    # Перевіряємо використання класів зі списку
    for cls in common_classes:
        # Різні патерни використання класів
        patterns = [
            rf'@{cls}[^a-zA-Z0-9_]',  # анотації
            rf'\s{cls}[^a-zA-Z0-9_]',  # використання як тип
            rf'<{cls}[^a-zA-Z0-9_]',   # використання в дженериках
            rf'{cls}\.',               # статичні методи
            rf'new\s+{cls}[^a-zA-Z0-9_]',  # створення об'єктів
            rf'extends\s+{cls}[^a-zA-Z0-9_]',  # наслідування
            rf'implements\s+{cls}[^a-zA-Z0-9_]'  # імплементація інтерфейсів
        ]
        
        for pattern in patterns:
            if re.search(pattern, content):
                used_classes.add(cls)
                break
    
    # Додаємо додаткові класи, які можемо автоматично визначити
    # Це не ідеальний спосіб, але може виявити деякі класи
    if 'jakarta.persistence' == package:
        if '@Entity' in content:
            used_classes.add('Entity')
        if '@Table' in content:
            used_classes.add('Table')
        if '@Id' in content:
            used_classes.add('Id')
        if '@GeneratedValue' in content:
            used_classes.add('GeneratedValue')
        if '@Column' in content:
            used_classes.add('Column')
        if '@JoinColumn' in content:
            used_classes.add('JoinColumn')
        if '@OneToMany' in content:
            used_classes.add('OneToMany')
        if '@ManyToOne' in content:
            used_classes.add('ManyToOne')
        if '@OneToOne' in content:
            used_classes.add('OneToOne')
        if '@ManyToMany' in content:
            used_classes.add('ManyToMany')
        if '@Enumerated' in content:
            used_classes.add('Enumerated')
        if 'EnumType.STRING' in content or 'EnumType.ORDINAL' in content:
            used_classes.add('EnumType')
        if 'FetchType.LAZY' in content or 'FetchType.EAGER' in content:
            used_classes.add('FetchType')
        if 'CascadeType.ALL' in content or 'CascadeType.' in content:
            used_classes.add('CascadeType')
        if 'GenerationType.' in content:
            used_classes.add('GenerationType')
    
    if 'org.springframework.web.bind.annotation' == package:
        if '@RestController' in content:
            used_classes.add('RestController')
        if '@RequestMapping' in content:
            used_classes.add('RequestMapping')
        if '@GetMapping' in content:
            used_classes.add('GetMapping')
        if '@PostMapping' in content:
            used_classes.add('PostMapping')
        if '@PutMapping' in content:
            used_classes.add('PutMapping')
        if '@DeleteMapping' in content:
            used_classes.add('DeleteMapping')
        if '@RequestBody' in content:
            used_classes.add('RequestBody')
        if '@PathVariable' in content:
            used_classes.add('PathVariable')
        if '@RequestParam' in content:
            used_classes.add('RequestParam')
        if '@ResponseStatus' in content:
            used_classes.add('ResponseStatus')
        
    return used_classes

def replace_star_import(content, package, used_classes):
    """Замінює зірковий імпорт на конкретні імпорти класів."""
    star_import = f"import {package}.*;"
    
    if not used_classes:
        # Якщо неможливо автоматично визначити використовувані класи,
        # залишаємо зірковий імпорт незмінним
        return content
    
    # Сортуємо імена класів
    used_classes = sorted(list(used_classes))
    
    # Створюємо рядки для конкретних імпортів
    specific_imports = [f"import {package}.{cls};" for cls in used_classes]
    
    # Об'єднуємо в один блок
    specific_imports_text = "\n".join(specific_imports)
    
    # Замінюємо зірковий імпорт на блок конкретних імпортів
    return content.replace(star_import, specific_imports_text)

def process_file(file_path):
    """Обробляє файл, замінюючи зіркові імпорти на конкретні."""
    content = read_file(file_path)
    if content is None:
        return False
    
    modified = False
    star_imports = find_star_imports(content)
    
    for package in star_imports:
        used_classes = find_classes_used_from_package(content, package)
        if used_classes:
            new_content = replace_star_import(content, package, used_classes)
            if new_content != content:
                content = new_content
                modified = True
    
    if modified:
        print(f"Виправлення зіркових імпортів у файлі: {file_path}")
        return write_file(file_path, content)
    
    return False

def main():
    if len(sys.argv) < 2:
        print("Використання: python fix_star_imports.py <шлях_до_логів_checkstyle>")
        sys.exit(1)
    
    logs_path = sys.argv[1]
    if not os.path.isfile(logs_path):
        print(f"Файл логів {logs_path} не існує")
        sys.exit(1)
    
    files_with_warnings = extract_star_import_warnings(logs_path)
    
    if not files_with_warnings:
        print("Не знайдено попереджень про зіркові імпорти у логах")
        sys.exit(0)
    
    files_fixed = 0
    for file_path in files_with_warnings:
        if process_file(file_path):
            files_fixed += 1
    
    print(f"Всього виправлено файлів: {files_fixed}")

if __name__ == "__main__":
    main()
