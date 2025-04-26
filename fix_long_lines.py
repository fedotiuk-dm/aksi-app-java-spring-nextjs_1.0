#!/usr/bin/env python3
"""
Скрипт для виправлення довгих рядків у Java-файлах (довших ніж 120 символів).
Розбиває довгі рядки з кодом на декілька коротших з правильним форматуванням.
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

def extract_long_line_warnings(logs_path):
    """Видобуває попередження про довгі рядки з логів."""
    content = read_file(logs_path)
    if not content:
        return {}
    
    # Шаблон для пошуку попереджень про довгі рядки
    pattern = r'\[WARN\] (\/[^\s]+):([0-9]+): Line is longer than 120 characters \(found ([0-9]+)\)'
    matches = re.findall(pattern, content)
    
    warnings = {}
    
    for file_path, line_num, length in matches:
        if file_path not in warnings:
            warnings[file_path] = []
        warnings[file_path].append((int(line_num), int(length)))
    
    return warnings

def split_long_line(line, indent=""):
    """Розбиває довгий рядок на кілька коротших."""
    max_length = 120
    
    # Якщо рядок коротший за максимальну довжину, повертаємо його без змін
    if len(line) <= max_length:
        return line
    
    # Визначаємо початковий відступ
    original_indent = re.match(r'^(\s*)', line).group(1)
    
    # Особливі випадки для різних типів рядків
    
    # 1. Розбиття рядка з методом, що має багато параметрів
    method_call_match = re.match(r'(\s*)(.*?)(\([^)]*\))(.*)', line)
    if method_call_match and len(method_call_match.group(3)) > 30:
        prefix = method_call_match.group(1) + method_call_match.group(2)
        params_str = method_call_match.group(3)
        suffix = method_call_match.group(4)
        
        # Розбиваємо параметри
        params = params_str.strip('()').split(',')
        
        # Додаємо відступ для параметрів
        param_indent = original_indent + " " * 4
        
        # Формуємо новий рядок
        result = prefix + "(\n"
        for i, param in enumerate(params):
            param = param.strip()
            if i < len(params) - 1:
                result += param_indent + param + ",\n"
            else:
                result += param_indent + param + "\n"
        result += original_indent + ")" + suffix
        
        return result
    
    # 2. Розбиття рядка з створенням нового об'єкта
    new_obj_match = re.match(r'(\s*)(.*?)new\s+([a-zA-Z0-9_<>]+)(\([^)]*\))(.*)', line)
    if new_obj_match and len(new_obj_match.group(4)) > 30:
        prefix = new_obj_match.group(1) + new_obj_match.group(2) + "new " + new_obj_match.group(3)
        params_str = new_obj_match.group(4)
        suffix = new_obj_match.group(5)
        
        # Розбиваємо параметри
        params = params_str.strip('()').split(',')
        
        # Додаємо відступ для параметрів
        param_indent = original_indent + " " * 4
        
        # Формуємо новий рядок
        result = prefix + "(\n"
        for i, param in enumerate(params):
            param = param.strip()
            if i < len(params) - 1:
                result += param_indent + param + ",\n"
            else:
                result += param_indent + param + "\n"
        result += original_indent + ")" + suffix
        
        return result
    
    # 3. Розбиття довгого оператора if
    if_match = re.match(r'(\s*)if\s*\((.*)\)(.*)', line)
    if if_match and len(if_match.group(2)) > 60:
        prefix = if_match.group(1) + "if ("
        condition = if_match.group(2)
        suffix = ")" + if_match.group(3)
        
        # Шукаємо логічні оператори для розбиття
        condition_parts = []
        current_part = ""
        
        # Розбиваємо на логічні оператори && та ||
        for char in condition:
            current_part += char
            if len(current_part) >= 2 and current_part[-2:] in ["&&", "||"]:
                condition_parts.append(current_part[:-2])
                condition_parts.append(current_part[-2:])
                current_part = ""
        
        if current_part:
            condition_parts.append(current_part)
        
        # Формуємо новий рядок
        condition_indent = original_indent + " " * 4
        result = prefix + "\n"
        
        current_line = condition_indent
        
        for i, part in enumerate(condition_parts):
            if i > 0 and part in ["&&", "||"]:
                # Додаємо оператор на новий рядок
                result += current_line + "\n" + condition_indent + part + " "
                current_line = ""
            else:
                current_line += part
        
        if current_line:
            result += current_line + "\n"
        
        result += original_indent + suffix
        
        return result
    
    # 4. Розбиття рядка оголошення змінної з довгим виразом
    var_decl_match = re.match(r'(\s*)((?:final\s+)?[a-zA-Z0-9_<>[\]]+\s+[a-zA-Z0-9_]+)\s*=\s*(.*?);', line)
    if var_decl_match:
        prefix = var_decl_match.group(1) + var_decl_match.group(2) + " ="
        expr = var_decl_match.group(3)
        
        # Розбиваємо вираз на новий рядок з відступом
        expr_indent = original_indent + " " * 4
        
        return prefix + "\n" + expr_indent + expr + ";"
    
    # 5. Розбиття довгого рядка з багатьма аргументами для анотацій
    annotation_match = re.match(r'(\s*)(@[a-zA-Z0-9_]+)(\([^)]*\))', line)
    if annotation_match and len(annotation_match.group(3)) > 30:
        prefix = annotation_match.group(1) + annotation_match.group(2)
        params_str = annotation_match.group(3)
        
        # Розбиваємо параметри
        params = params_str.strip('()').split(',')
        
        # Додаємо відступ для параметрів
        param_indent = original_indent + " " * 4
        
        # Формуємо новий рядок
        result = prefix + "(\n"
        for i, param in enumerate(params):
            param = param.strip()
            if i < len(params) - 1:
                result += param_indent + param + ",\n"
            else:
                result += param_indent + param + "\n"
        result += original_indent + ")"
        
        return result
    
    # 6. Розбиття рядків, які містять багато операторів +
    concat_match = re.match(r'(\s*)(.*?)(\s*\+\s*.*)', line)
    if concat_match and "+" in line:
        parts = line.split("+")
        
        # Формуємо новий рядок
        result = parts[0].rstrip() + "\n"
        concat_indent = original_indent + " " * 4
        
        for part in parts[1:]:
            result += concat_indent + "+ " + part.lstrip() + "\n"
        
        return result.rstrip()
    
    # 7. Розбиття рядка з викликом методу і параметрами
    method_call = re.match(r'(\s*)([a-zA-Z0-9_]+\.[a-zA-Z0-9_]+\([^)]*\))(.*)', line)
    if method_call:
        prefix = method_call.group(1)
        method = method_call.group(2)
        suffix = method_call.group(3)
        
        if suffix.startswith("."):
            # Ланцюжок викликів методів
            chain_parts = suffix.split(".")
            
            result = prefix + method + "\n"
            chain_indent = original_indent + " " * 4
            
            for part in chain_parts:
                if part:
                    result += chain_indent + "." + part + "\n"
            
            return result.rstrip()
    
    # 8. Загальний випадок - розбиваємо рядок після 120 символів
    # Шукаємо гарне місце для розбиття (після коми, крапки, пробілу, тощо)
    cutoff = max_length - len(indent)
    if cutoff <= 0:
        cutoff = max_length
    
    for i in range(cutoff, cutoff // 2, -1):
        if i >= len(line):
            continue
        
        # Пріоритети для розбиття
        if line[i] in [',', ';', ' ', '.', ')', ']', '}']:
            return line[:i+1] + '\n' + indent + line[i+1:].lstrip()
    
    # Якщо не знайдено гарне місце, розбиваємо просто на 120 символів
    return line[:cutoff] + '\n' + indent + line[cutoff:]

def fix_long_lines(content, warning_lines):
    """Виправляє довгі рядки у вмісті файлу."""
    lines = content.split('\n')
    modified = False
    
    # Сортуємо попередження у зворотному порядку, щоб не змінювати позиції
    for line_num, _ in sorted(warning_lines, reverse=True):
        # Індекси рядків у лістингу починаються з 0, а в попередженнях - з 1
        idx = line_num - 1
        
        if idx < 0 or idx >= len(lines):
            continue
        
        # Виправляємо довгий рядок
        line = lines[idx]
        new_line = split_long_line(line)
        
        if new_line != line:
            # Розбиваємо на нові рядки і вставляємо їх
            new_lines = new_line.split('\n')
            lines.pop(idx)
            for i, new_l in enumerate(reversed(new_lines)):
                lines.insert(idx, new_l)
            
            modified = True
    
    if modified:
        return '\n'.join(lines)
    return content

def process_file(file_path, warnings):
    """Обробляє файл, виправляючи довгі рядки."""
    content = read_file(file_path)
    if content is None:
        return False
    
    if file_path in warnings:
        new_content = fix_long_lines(content, warnings[file_path])
        if new_content != content:
            print(f"Виправлення довгих рядків у файлі: {file_path}")
            return write_file(file_path, new_content)
    
    return False

def main():
    if len(sys.argv) < 2:
        print("Використання: python fix_long_lines.py <шлях_до_логів_checkstyle>")
        sys.exit(1)
    
    logs_path = sys.argv[1]
    if not os.path.isfile(logs_path):
        print(f"Файл логів {logs_path} не існує")
        sys.exit(1)
    
    warnings = extract_long_line_warnings(logs_path)
    
    if not warnings:
        print("Не знайдено попереджень про довгі рядки у логах")
        sys.exit(0)
    
    files_fixed = 0
    for file_path in warnings:
        if process_file(file_path, warnings):
            files_fixed += 1
    
    print(f"Всього виправлено файлів: {files_fixed}")

if __name__ == "__main__":
    main()
