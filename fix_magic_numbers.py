#!/usr/bin/env python3
"""
Скрипт для виявлення та пропозиції виправлень "магічних чисел" у Java-файлах.
Магічні числа - це безпосередньо використані числові літерали, які варто замінити на іменовані константи.
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

def detect_magic_numbers(content, file_path):
    """
    Виявляє магічні числа в коді та пропонує виправлення.
    Повертає список рядків з магічними числами та пропозиціями для їх виправлення.
    """
    # Регулярний вираз для пошуку магічних чисел
    # Виключаємо 0, 1, -1, які часто не вважаються магічними
    magic_number_pattern = r'(?<!\bcase\s)(?<!\w\.)(?<!\breturn\s)(?<!=[^=])(?<![<>!]=)\s(\d{2,}|[2-9])\b'
    
    lines = content.split('\n')
    results = []
    
    # Знаходимо всі класи/інтерфейси в коді
    class_match = re.search(r'(?:public|private|protected)\s+(?:class|interface|enum)\s+(\w+)', content)
    class_name = class_match.group(1) if class_match else "UnknownClass"
    
    # Шукаємо магічні числа в кожному рядку
    for i, line in enumerate(lines):
        matches = re.finditer(magic_number_pattern, line)
        for match in matches:
            number = match.group(1)
            # Створюємо ім'я константи на основі контексту
            constant_name = derive_constant_name(line, number)
            
            # Пропонуємо додати константу в клас
            constant_declaration = f"private static final int {constant_name} = {number};"
            
            results.append({
                'line_number': i + 1,
                'line_content': line,
                'magic_number': number,
                'file_path': file_path,
                'suggestion': f"Замініть число {number} на константу {constant_name}",
                'constant_declaration': constant_declaration
            })
    
    return results

def derive_constant_name(line, number):
    """
    Виводить ім'я константи на основі контексту рядка.
    Наприклад, якщо рядок містить 'timeout' і число 1000, ім'я буде TIMEOUT_MILLISECONDS.
    """
    # Набір загальних контекстів для чисел
    contexts = {
        'timeout': 'TIMEOUT',
        'delay': 'DELAY',
        'size': 'SIZE',
        'length': 'LENGTH',
        'count': 'COUNT',
        'limit': 'LIMIT',
        'max': 'MAX',
        'min': 'MIN',
        'port': 'PORT',
    }
    
    line = line.lower()
    
    # Шукаємо контекст у рядку
    for context_keyword, constant_prefix in contexts.items():
        if context_keyword in line:
            if 'millisecond' in line or 'ms' in line:
                return f"{constant_prefix}_MILLISECONDS"
            elif 'second' in line or 'sec' in line:
                return f"{constant_prefix}_SECONDS"
            elif 'minute' in line or 'min' in line:
                return f"{constant_prefix}_MINUTES"
            elif 'hour' in line or 'hr' in line:
                return f"{constant_prefix}_HOURS"
            elif 'day' in line:
                return f"{constant_prefix}_DAYS"
            else:
                return constant_prefix
    
    # Якщо контекст не знайдено, використовуємо значення числа у назві
    return f"CONSTANT_{number}"

def process_file(file_path):
    """
    Обробляє один файл: виявляє магічні числа та виводить рекомендації.
    """
    content = read_file(file_path)
    if content is None:
        return False
    
    magic_numbers = detect_magic_numbers(content, file_path)
    
    if magic_numbers:
        print(f"\nЗнайдено {len(magic_numbers)} магічних чисел у {file_path}:")
        for item in magic_numbers:
            print(f"  Рядок {item['line_number']}: {item['line_content'].strip()}")
            print(f"    Пропозиція: {item['suggestion']}")
            print(f"    Додайте константу: {item['constant_declaration']}")
        
        # Виводимо рекомендації щодо констант
        print(f"\nРекомендовані константи для додавання у клас:")
        for item in magic_numbers:
            print(f"  {item['constant_declaration']}")
        
        return True
    else:
        print(f"Не знайдено магічних чисел у {file_path}")
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
        print("Використання: python fix_magic_numbers.py <директорія> [шаблон]")
        print("Шаблон за замовчуванням: **/*.java")
        return False
    
    directory = sys.argv[1]
    pattern = sys.argv[2] if len(sys.argv) > 2 else "**/*.java"
    
    return process_directory(directory, pattern)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
