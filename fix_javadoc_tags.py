#!/usr/bin/env python3
"""
Скрипт для додавання відсутніх тегів @return та @param у JavaDoc коментарі
згідно з попередженнями checkstyle.
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

def extract_javadoc_warnings(logs_path):
    """Видобуває попередження про відсутні теги JavaDoc з логів."""
    content = read_file(logs_path)
    if not content:
        return {}
    
    # Шаблон для пошуку попереджень про відсутні @return теги
    return_pattern = r'\[WARN\] (\/[^\s]+):([0-9]+):[^:]*: @return tag should be present and have description'
    
    # Шаблон для пошуку попереджень про відсутні @param теги
    param_pattern = r'\[WARN\] (\/[^\s]+):([0-9]+):[^:]*: Expected @param tag for \'([^\']+)\''
    
    return_matches = re.findall(return_pattern, content)
    param_matches = re.findall(param_pattern, content)
    
    warnings = {}
    
    # Обробка попереджень про @return
    for file_path, line_num, in return_matches:
        if file_path not in warnings:
            warnings[file_path] = {'return': [], 'param': {}}
        warnings[file_path]['return'].append(int(line_num))
    
    # Обробка попереджень про @param
    for file_path, line_num, param_name in param_matches:
        if file_path not in warnings:
            warnings[file_path] = {'return': [], 'param': {}}
        if int(line_num) not in warnings[file_path]['param']:
            warnings[file_path]['param'][int(line_num)] = []
        warnings[file_path]['param'][int(line_num)].append(param_name)
    
    return warnings

def find_method_declaration(content, line_num):
    """Знаходить оголошення методу для рядка з номером line_num."""
    lines = content.split('\n')
    
    # Якщо line_num виходить за межі, повертаємо None
    if line_num < 0 or line_num >= len(lines):
        return None
    
    # Шукаємо оголошення методу в цьому рядку або в наступних рядках
    for i in range(line_num, min(line_num + 5, len(lines))):
        line = lines[i]
        
        # Шаблон для пошуку оголошення методу
        method_pattern = r'(\s*)(?:public|protected|private|static|\s)*(?:[a-zA-Z0-9_\.<>\[\]]+\s+)+([a-zA-Z0-9_]+)\s*\(([^)]*)\)'
        match = re.match(method_pattern, line)
        
        if match:
            indentation = match.group(1)
            method_name = match.group(2)
            params_str = match.group(3)
            
            # Розбір параметрів
            params = []
            if params_str.strip():
                # Розділяємо параметри за комами
                param_parts = params_str.split(',')
                for part in param_parts:
                    # Отримуємо ім'я параметра (останнє слово перед можливими пробілами)
                    param_match = re.search(r'([a-zA-Z0-9_]+)(?:\s*=.*)?$', part.strip())
                    if param_match:
                        params.append(param_match.group(1))
            
            # Визначаємо тип повернення (береться з рядка вище декларації методу)
            return_type = "void"  # За замовчуванням
            if i > 0:
                return_type_match = re.search(r'(?:public|protected|private|static|\s)*([a-zA-Z0-9_\.<>\[\]]+)\s+' + re.escape(method_name), line)
                if return_type_match:
                    return_type = return_type_match.group(1)
            
            return {
                'method_name': method_name,
                'params': params,
                'return_type': return_type,
                'line': i,
                'indentation': indentation
            }
    
    return None

def find_javadoc_comment(content, method_info):
    """Знаходить JavaDoc коментар для методу."""
    if not method_info:
        return None
    
    lines = content.split('\n')
    method_line = method_info['line']
    
    # Шукаємо коментар перед методом
    javadoc_start = -1
    javadoc_end = -1
    
    for i in range(method_line - 1, max(0, method_line - 20), -1):
        line = lines[i].strip()
        
        if line.endswith('*/'):
            javadoc_end = i
        elif '/**' in line:
            javadoc_start = i
            break
    
    if javadoc_start >= 0 and javadoc_end >= 0:
        return {
            'start': javadoc_start,
            'end': javadoc_end,
            'content': '\n'.join(lines[javadoc_start:javadoc_end+1])
        }
    
    return None

def add_javadoc_tags(content, warnings):
    """Додає відсутні теги @return та @param у JavaDoc коментарі."""
    lines = content.split('\n')
    modified = False
    
    # Спочатку обробляємо @return
    for line_num in sorted(warnings['return'], reverse=True):
        method_info = find_method_declaration(content, line_num - 1)
        if not method_info:
            continue
        
        javadoc_info = find_javadoc_comment(content, method_info)
        if not javadoc_info:
            continue
        
        return_type = method_info['return_type']
        
        # Не додаємо @return для void методів
        if return_type.lower() == 'void':
            continue
        
        # Додаємо тег @return перед кінцем коментаря
        javadoc_lines = lines[javadoc_info['start']:javadoc_info['end']+1]
        insert_line = javadoc_info['end']
        
        # Визначаємо відступ для нового тегу
        indentation = method_info['indentation'] + ' * '
        
        # Створюємо тег @return з описом відповідно до типу
        return_desc = f"повертає результат операції"
        if "list" in return_type.lower() or "collection" in return_type.lower():
            return_desc = f"список результатів"
        elif "boolean" in return_type.lower():
            return_desc = f"true, якщо операція успішна, інакше false"
        elif "optional" in return_type.lower():
            return_desc = f"опціональний результат операції"
        
        return_tag = f"{indentation}@return {return_desc}"
        
        # Вставляємо тег @return
        lines.insert(insert_line, return_tag)
        modified = True
        
        # Оновлюємо позиції після вставки
        for i in range(len(warnings['param'])):
            if list(warnings['param'].keys())[i] > insert_line:
                new_key = list(warnings['param'].keys())[i] + 1
                warnings['param'][new_key] = warnings['param'].pop(list(warnings['param'].keys())[i])
    
    # Потім обробляємо @param
    for line_num in sorted(warnings['param'].keys(), reverse=True):
        param_names = warnings['param'][line_num]
        method_info = find_method_declaration(content, line_num - 1)
        
        if not method_info:
            continue
        
        javadoc_info = find_javadoc_comment(content, method_info)
        if not javadoc_info:
            continue
        
        # Додаємо теги @param перед кінцем коментаря або перед @return, якщо він є
        javadoc_lines = lines[javadoc_info['start']:javadoc_info['end']+1]
        insert_line = javadoc_info['end']
        
        # Знаходимо рядок з @return, якщо він є
        for i, line in enumerate(javadoc_lines):
            if '@return' in line:
                insert_line = javadoc_info['start'] + i
                break
        
        # Визначаємо відступ
        indentation = method_info['indentation'] + ' * '
        
        # Вставляємо теги @param у зворотному порядку, щоб зберегти правильні позиції
        for param_name in reversed(param_names):
            # Створюємо стандартний опис
            param_desc = f"параметр {param_name}"
            
            # Визначаємо більш змістовний опис для деяких загальних назв параметрів
            common_params = {
                'id': "ідентифікатор",
                'name': "ім'я",
                'request': "запит",
                'response': "відповідь",
                'dto': "об'єкт передачі даних",
                'entity': "сутність",
                'config': "конфігурація",
                'http': "об'єкт HttpSecurity"
            }
            
            for key, value in common_params.items():
                if key in param_name.lower():
                    param_desc = value
            
            param_tag = f"{indentation}@param {param_name} {param_desc}"
            
            # Вставляємо тег @param
            lines.insert(insert_line, param_tag)
            modified = True
    
    if modified:
        return '\n'.join(lines)
    return content

def process_file(file_path, warnings):
    """Обробляє файл, додаючи відсутні теги JavaDoc."""
    content = read_file(file_path)
    if content is None:
        return False
    
    if file_path in warnings:
        new_content = add_javadoc_tags(content, warnings[file_path])
        if new_content != content:
            print(f"Виправлення JavaDoc тегів у файлі: {file_path}")
            return write_file(file_path, new_content)
    
    return False

def main():
    if len(sys.argv) < 2:
        print("Використання: python fix_javadoc_tags.py <шлях_до_логів_checkstyle>")
        sys.exit(1)
    
    logs_path = sys.argv[1]
    if not os.path.isfile(logs_path):
        print(f"Файл логів {logs_path} не існує")
        sys.exit(1)
    
    warnings = extract_javadoc_warnings(logs_path)
    
    if not warnings:
        print("Не знайдено попереджень про відсутні теги JavaDoc у логах")
        sys.exit(0)
    
    files_fixed = 0
    for file_path in warnings:
        if process_file(file_path, warnings):
            files_fixed += 1
    
    print(f"Всього виправлено файлів: {files_fixed}")

if __name__ == "__main__":
    main()
