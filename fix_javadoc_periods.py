#!/usr/bin/env python3
"""
Скрипт для додавання крапок у кінці першого речення Javadoc.
Виправляє поширену проблему SummaryJavadoc в Checkstyle.
"""

import os
import re
import sys
import glob

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

def fix_javadoc_first_sentence(content):
    """
    Додає крапку в кінці першого речення Javadoc, якщо її немає.
    Шукає коментарі вигляду /** ... */ і додає крапку, якщо перший рядок не закінчується на розділовий знак.
    """
    # Регулярний вираз для пошуку блоків Javadoc
    javadoc_pattern = r'/\*\*\s*\n\s*\*\s*([^.\n]*?)(\s*\n)'
    
    def add_period(match):
        """Додає крапку в кінці речення, якщо її немає."""
        sentence = match.group(1).strip()
        if sentence and not sentence.endswith(('.', '!', '?', ',')):
            return f"/**\n * {sentence}.\n"
        return match.group(0)
    
    return re.sub(javadoc_pattern, add_period, content)

def process_file(file_path):
    """Обробляє один файл: додає крапки в кінці речень Javadoc."""
    content = read_file(file_path)
    if content is None:
        return False
    
    fixed_content = fix_javadoc_first_sentence(content)
    
    # Перевіряємо, чи були зміни
    if fixed_content != content:
        print(f"Виправлено Javadoc у {file_path}")
        return write_file(file_path, fixed_content)
    else:
        print(f"Не знайдено проблем з Javadoc у {file_path}")
        return True

def process_directory(directory, pattern="**/*.java"):
    """Обробляє всі Java-файли в директорії та її підкаталогах."""
    if not os.path.isdir(directory):
        print(f"Директорія {directory} не існує")
        return False
    
    files = glob.glob(os.path.join(directory, pattern), recursive=True)
    success = True
    
    for file_path in files:
        if not process_file(file_path):
            success = False
    
    return success

def main():
    """Головна функція скрипта."""
    if len(sys.argv) < 2:
        print("Використання: python fix_javadoc_periods.py <директорія> [шаблон]")
        print("Шаблон за замовчуванням: **/*.java")
        return False
    
    directory = sys.argv[1]
    pattern = sys.argv[2] if len(sys.argv) > 2 else "**/*.java"
    
    return process_directory(directory, pattern)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
