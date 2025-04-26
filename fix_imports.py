#!/usr/bin/env python3
"""
Скрипт для автоматичного виправлення проблем з імпортами в Java файлах.
Виправляє наступні проблеми:
1. Зіркові імпорти (import package.*) замінюємо на конкретні імпорти
2. Сортування імпортів у правильному порядку
"""

import os
import re
import sys
import glob
import importlib.util
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

def fix_star_imports(content, file_path):
    """
    Замінює зіркові імпорти на конкретні.
    Ця функція використовує jdeps для визначення фактично використовуваних класів.
    """
    # Знаходимо всі зіркові імпорти
    star_import_pattern = r'import\s+([a-zA-Z0-9_\.]+)\.\*;'
    star_imports = re.findall(star_import_pattern, content)
    
    if not star_imports:
        return content
    
    # Створюємо тимчасовий файл для аналізу
    temp_file = "/tmp/temp_java_file.java"
    write_file(temp_file, content)
    
    # Використовуємо jdeps для визначення залежностей
    for package in star_imports:
        try:
            # Запускаємо jdeps для отримання використовуваних класів
            result = subprocess.run(
                ["jdeps", "-v", temp_file],
                capture_output=True,
                text=True
            )
            
            # Аналізуємо вихід jdeps
            output = result.stdout
            used_classes = []
            
            for line in output.split('\n'):
                if f" {package}." in line:
                    class_name = line.split(" ")[-1].strip()
                    if class_name.startswith(f"{package}."):
                        used_class = class_name.split(".")[-1]
                        used_classes.append(used_class)
            
            # Якщо знайдено використовувані класи, замінюємо зірковий імпорт
            if used_classes:
                star_import = f"import {package}.*;"
                specific_imports = "\n".join([f"import {package}.{cls};" for cls in used_classes])
                content = content.replace(star_import, specific_imports)
                
        except Exception as e:
            print(f"Помилка при обробці зіркового імпорту {package}: {e}")
    
    # Видаляємо тимчасовий файл
    os.remove(temp_file)
    
    return content

def sort_imports(content):
    """
    Сортує імпорти у правильному порядку згідно з Java конвенціями:
    1. java.*
    2. javax.*
    3. org.*
    4. com.*
    5. Інші імпорти
    """
    # Знаходимо блок імпортів
    import_block_pattern = r'((?:import\s+[a-zA-Z0-9_\.]+(?:\.\*)?;\s*)+)'
    import_pattern = r'import\s+([a-zA-Z0-9_\.]+(?:\.\*)?);'
    
    # Знаходимо блок імпортів
    match = re.search(import_block_pattern, content)
    if not match:
        return content
        
    import_block = match.group(1)
    imports = re.findall(import_pattern, import_block)
    
    # Розділяємо імпорти на категорії
    java_imports = []
    javax_imports = []
    org_imports = []
    com_imports = []
    other_imports = []
    
    for imp in imports:
        if imp.startswith('java.'):
            java_imports.append(imp)
        elif imp.startswith('javax.'):
            javax_imports.append(imp)
        elif imp.startswith('org.'):
            org_imports.append(imp)
        elif imp.startswith('com.'):
            com_imports.append(imp)
        else:
            other_imports.append(imp)
    
    # Сортуємо кожну категорію
    java_imports.sort()
    javax_imports.sort()
    org_imports.sort()
    com_imports.sort()
    other_imports.sort()
    
    # Об'єднуємо відсортовані імпорти з розділювачами
    sorted_imports = []
    if java_imports:
        sorted_imports.extend([f"import {imp};" for imp in java_imports])
    if javax_imports:
        if sorted_imports:
            sorted_imports.append("")
        sorted_imports.extend([f"import {imp};" for imp in javax_imports])
    if org_imports:
        if sorted_imports:
            sorted_imports.append("")
        sorted_imports.extend([f"import {imp};" for imp in org_imports])
    if com_imports:
        if sorted_imports:
            sorted_imports.append("")
        sorted_imports.extend([f"import {imp};" for imp in com_imports])
    if other_imports:
        if sorted_imports:
            sorted_imports.append("")
        sorted_imports.extend([f"import {imp};" for imp in other_imports])
    
    # Створюємо новий блок імпортів
    sorted_import_block = "\n".join(sorted_imports)
    
    # Замінюємо старий блок імпортів на новий
    return content.replace(import_block, sorted_import_block + "\n\n")

def process_file(file_path):
    """Обробка окремого файлу."""
    content = read_file(file_path)
    if content is None:
        return False
        
    # Виправляємо зіркові імпорти
    modified_content = fix_star_imports(content, file_path)
    
    # Сортуємо імпорти
    modified_content = sort_imports(modified_content)
    
    # Якщо були зміни, записуємо файл
    if modified_content != content:
        print(f"Виправлення файлу: {file_path}")
        return write_file(file_path, modified_content)
    
    return False

def process_directory(directory, extensions=None):
    """Рекурсивна обробка директорії."""
    if extensions is None:
        extensions = ['.java']
    
    changes_count = 0
    
    # Шукаємо всі файли з вказаними розширеннями
    for ext in extensions:
        for file_path in glob.glob(os.path.join(directory, f'**/*{ext}'), recursive=True):
            if process_file(file_path):
                changes_count += 1
    
    return changes_count

def main():
    if len(sys.argv) < 2:
        print("Використання: python fix_imports.py <шлях_до_директорії>")
        sys.exit(1)
        
    directory = sys.argv[1]
    if not os.path.isdir(directory):
        print(f"Директорія {directory} не існує")
        sys.exit(1)
        
    print(f"Обробка директорії: {directory}")
    changes_count = process_directory(directory)
    
    print(f"Всього змінено файлів: {changes_count}")

if __name__ == "__main__":
    main()
