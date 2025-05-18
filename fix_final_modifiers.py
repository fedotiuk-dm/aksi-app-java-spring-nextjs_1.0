#!/usr/bin/env python3
"""
Скрипт для додавання модифікатора 'final' до параметрів методів і локальних змінних.
Виправляє дві поширені проблеми Checkstyle:
1. FinalParameters - параметри методів не позначені як final
2. FinalLocalVariable - локальні змінні не позначені як final
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

def fix_final_parameters(content):
    """Додає модифікатор 'final' до параметрів методів."""
    # Регулярний вираз для пошуку параметрів методів
    # Шукаємо оголошення методів та їх параметри
    method_pattern = r'(public|protected|private|static|\s) +[\w\<\>\[\]]+\s+(\w+) *\([^)]*\) *(\{?|[^;])'
    
    # Замінюємо параметри, додаючи 'final', якщо його ще немає
    def add_final_to_params(match):
        full_method = match.group(0)
        # Знаходимо параметри між дужками
        params_match = re.search(r'\((.*?)\)', full_method)
        if params_match and params_match.group(1).strip():
            params = params_match.group(1)
            # Розділяємо параметри по комах
            param_list = params.split(',')
            # Додаємо 'final' до кожного параметра, якщо його немає
            for i, param in enumerate(param_list):
                param = param.strip()
                # Якщо параметр не починається з 'final' і не є анотацією
                if not param.startswith('final ') and not param.startswith('@'):
                    # Перевіряємо тип параметра
                    param_parts = param.split()
                    if len(param_parts) >= 2:  # Має бути хоча б тип і ім'я
                        # Додаємо 'final' перед типом
                        param_list[i] = 'final ' + param
            
            # Збираємо параметри назад
            new_params = ', '.join(param_list)
            # Замінюємо оригінальні параметри на нові
            return full_method.replace(params, new_params)
        return full_method
    
    return re.sub(method_pattern, add_final_to_params, content)

def fix_final_local_variables(content):
    """Додає модифікатор 'final' до локальних змінних."""
    # Регулярний вираз для пошуку оголошень локальних змінних
    var_pattern = r'(?<!\bfinal\s)(?<=\s|\()([\w\<\>\[\]]+)\s+(\w+)\s*='
    
    # Замінюємо оголошення змінних, додаючи 'final'
    def add_final_to_var(match):
        var_type = match.group(1)
        var_name = match.group(2)
        # Перевіряємо, чи це дійсно тип (а не ключове слово return тощо)
        if var_type not in ['return', 'if', 'else', 'while', 'for', 'do', 'switch', 'case', 'break', 'continue']:
            return f"final {var_type} {var_name} ="
        return match.group(0)
    
    return re.sub(var_pattern, add_final_to_var, content)

def process_file(file_path):
    """Обробляє один файл: додає модифікатор 'final'."""
    content = read_file(file_path)
    if content is None:
        return False
    
    # Спочатку виправляємо параметри методів
    fixed_content = fix_final_parameters(content)
    # Потім виправляємо локальні змінні
    fixed_content = fix_final_local_variables(fixed_content)
    
    # Перевіряємо, чи були зміни
    if fixed_content != content:
        print(f"Додано модифікатор 'final' у {file_path}")
        return write_file(file_path, fixed_content)
    else:
        print(f"Не знайдено параметрів для додавання 'final' у {file_path}")
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
        print("Використання: python fix_final_modifiers.py <директорія> [шаблон]")
        print("Шаблон за замовчуванням: **/*.java")
        return False
    
    directory = sys.argv[1]
    pattern = sys.argv[2] if len(sys.argv) > 2 else "**/*.java"
    
    return process_directory(directory, pattern)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
