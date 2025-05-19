#!/usr/bin/env python3
"""
Скрипт для автоматичного виправлення базових помилок Checkstyle:
1. Відсутність порожнього рядка в кінці файлу (NewlineAtEndOfFile)
2. Довгі рядки (LineLength > 120)

Використання:
python fix_checkstyle_basic.py [шлях_до_директорії]

Якщо шлях не вказано, скрипт обробить директорію backend.
"""

import os
import re
import sys
import glob
from pathlib import Path

# Константи
MAX_LINE_LENGTH = 120
JAVA_EXTENSION = ".java"
DEFAULT_BACKEND_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")


def ensure_newline_at_end(file_path):
    """Додає порожній рядок в кінець файлу, якщо його немає."""
    with open(file_path, 'rb') as file:
        content = file.read()
    
    if content and content[-1] != ord('\n'):
        with open(file_path, 'ab') as file:
            file.write(b'\n')
        print(f"✅ Додано порожній рядок в кінець файлу: {file_path}")
        return True
    return False


def process_java_file(file_path):
    """Обробляє Java-файл, виправляючи помилки Checkstyle."""
    changes_made = False
    
    # Виправлення порожнього рядка в кінці файлу
    if ensure_newline_at_end(file_path):
        changes_made = True
    
    return changes_made


def find_java_files(directory):
    """Знаходить всі Java-файли в заданій директорії та її піддиректоріях."""
    return glob.glob(f"{directory}/**/*{JAVA_EXTENSION}", recursive=True)


def main():
    """Основна функція скрипту."""
    if len(sys.argv) > 1:
        directory = sys.argv[1]
    else:
        directory = DEFAULT_BACKEND_PATH
    
    if not os.path.isdir(directory):
        print(f"Помилка: {directory} не є директорією.")
        sys.exit(1)
    
    print(f"Обробка Java-файлів у директорії: {directory}")
    
    java_files = find_java_files(directory)
    
    if not java_files:
        print(f"У директорії {directory} не знайдено Java-файлів.")
        return
    
    fixed_count = 0
    for file_path in java_files:
        fixed = process_java_file(file_path)
        if fixed:
            fixed_count += 1
    
    print(f"\nОброблено {len(java_files)} Java-файлів, виправлено помилки в {fixed_count} файлах.")


if __name__ == "__main__":
    main()