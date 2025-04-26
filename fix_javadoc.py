#!/usr/bin/env python3
"""
Скрипт для автоматичного виправлення попереджень checkstyle Java файлів.
Виправляє наступні типи попереджень:
1. "First sentence should end with a period" - додає крапку в кінці першого речення JavaDoc
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

def fix_javadoc_first_sentence_period(content):
    """
    Виправляє відсутність крапки в кінці першого речення JavaDoc.
    Шукає JavaDoc коментарі та додає крапку після першого речення, якщо її немає.
    """
    # Шаблон для пошуку JavaDoc коментарів
    # Пошук /** ... */ блоків, потім перевірка першого речення
    def replace_javadoc(match):
        javadoc = match.group(0)
        
        # Розділення на рядки
        lines = javadoc.split('\n')
        
        # Пропускаємо перший рядок з /**
        for i in range(1, len(lines)):
            line = lines[i].strip()
            
            # Пропускаємо порожні рядки або рядки лише з '*'
            if not line or line == '*' or line == '*/':
                continue
                
            # Видаляємо початкові зірочки та пробіли
            if line.startswith('*'):
                line = line[1:].lstrip()
                
            # Якщо рядок не закінчується на крапку, знак питання або знак оклику,
            # і це не параметр чи повернення (@param, @return, etc.)
            if (not line.endswith('.') and not line.endswith('?') and not line.endswith('!') and 
                not line.startswith('@') and len(line) > 0):
                lines[i] = lines[i] + '.'
                
            # Якщо знайшли перше речення, виходимо
            break
            
        return '\n'.join(lines)
    
    # Шаблон пошуку JavaDoc коментарів
    pattern = r'/\*\*[\s\S]*?\*/'
    return re.sub(pattern, replace_javadoc, content)

def process_file(file_path):
    """Обробка окремого файлу."""
    content = read_file(file_path)
    if content is None:
        return False
        
    # Виправляємо JavaDoc
    modified_content = fix_javadoc_first_sentence_period(content)
    
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
        print("Використання: python fix_javadoc.py <шлях_до_директорії>")
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
