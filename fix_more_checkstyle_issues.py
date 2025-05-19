#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для автоматичного виправлення різних типів помилок Checkstyle у Java файлах.
Фокусується на виправленні:
1. Trailing spaces (завершальні пробіли в кінці рядків)
2. Whitespace навколо тернарного оператора '?'
3. Неправильна структура імпортів (автоматично може виправити лише деякі випадки)
"""

import os
import sys
import re
from pathlib import Path

def fix_trailing_spaces(content):
    """Видаляє зайві пробіли в кінці рядків."""
    lines = content.split('\n')
    fixed = False
    
    for i in range(len(lines)):
        original = lines[i]
        lines[i] = lines[i].rstrip()
        if original != lines[i]:
            fixed = True
    
    return '\n'.join(lines), fixed

def fix_whitespace_around_operators(content):
    """Додає пробіли навколо тернарного оператора ?, але ігнорує дженерики."""
    fixed = False
    
    # Ігноруємо дженерики типу ResponseEntity<?> або List<?>
    # Шаблон для знаходження тернарного оператора без пробілів, але не в дженериках
    new_content = re.sub(r'([^\s<])\?([^\s>])', r'\1 ? \2', content)
    
    if new_content != content:
        fixed = True
        content = new_content
        
    return content, fixed

def process_file(file_path):
    """Обробляє файл для виправлення типових помилок Checkstyle."""
    changes_made = False
    
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Збережемо оригінальний контент для порівняння
    original_content = content
        
    # 1. Видалення зайвих пробілів у кінці рядків
    content, fixed_spaces = fix_trailing_spaces(content)
    if fixed_spaces:
        changes_made = True
        print(f"✅ Видалено зайві пробіли в кінці рядків: {file_path}")
    
    # 2. Виправлення пробілів навколо тернарного оператора
    if file_path.endswith(".java"):
        content, fixed_whitespace = fix_whitespace_around_operators(content)
        if fixed_whitespace:
            changes_made = True
            print(f"✅ Додано пробіли навколо оператора ?: {file_path}")
    
    # Записуємо зміни, якщо вони були
    if changes_made:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
    
    return changes_made

def process_directory(directory_path):
    """Рекурсивно обробляє всі Java-файли та властивості в каталозі."""
    processed_files = 0
    modified_files = 0
    target_files = []

    for root, dirs, files in os.walk(directory_path):
        for file in files:
            # Обробляємо Java файли та properties файли
            if file.endswith((".java", ".properties", ".xml")):
                target_files.append(os.path.join(root, file))

    for file_path in target_files:
        try:
            processed_files += 1
            if process_file(file_path):
                modified_files += 1
        except Exception as e:
            print(f"⚠️ Помилка при обробці файлу {file_path}: {e}")

    print(f"\nОброблено {processed_files} файлів, виправлено помилки в {modified_files} файлах.")


if __name__ == "__main__":
    target_path = "./backend" if len(sys.argv) < 2 else sys.argv[1]
    process_directory(target_path)
