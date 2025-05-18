#!/usr/bin/env python3
import os
import re
from pathlib import Path

def replace_in_file(file_path, replacements):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        original_content = content
        changes_made = False
        
        # Робимо всі заміни для точних співпадінь
        for old, new in replacements.items():
            if old in content:
                content = content.replace(old, new)
                changes_made = True
        
        # Додатково обробляємо варіанти з суфіксами (_1, _2, тощо)
        for old, new in replacements.items():
            # Видаляємо лапки для пошуку голого слова
            old_clean = old.strip("'\"")
            new_clean = new.strip("'\"")
            
            # Знаходимо всі входження шаблону "old_число"
            pattern = re.compile(rf'({re.escape(old_clean)}_\d+\b)')
            matches = pattern.findall(content)
            
            # Робимо заміни для кожного знайденого варіанту
            for match in set(matches):  # використовуємо set для унікальних значень
                suffix = match.replace(old_clean, '')
                new_with_suffix = f"{new_clean}{suffix}"
                
                # Замінюємо тільки якщо це окреме слово (не частина іншого слова)
                content = re.sub(rf'\b{re.escape(match)}\b', new_with_suffix, content)
                changes_made = True
        
        # Якщо зміни були, зберігаємо файл
        if changes_made and content != original_content:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(content)
            return True
        return False
    except Exception as e:
        print(f"Помилка при обробці файлу {file_path}: {e}")
        return False

def main():
    # Визначаємо кореневу директорію проекту
    project_root = Path(__file__).parent.absolute()
    
    # Словник замін: старі коди -> нові коди
    replacements = {
        # Латинські коди -> Англійські коди (з подвійними лапками)
        '"odiah"': '"CLOTHING"',
        '"prania_bilyzny"': '"LAUNDRY"',
        '"prasuvanya"': '"IRONING"',
        '"dublyanky"': '"PADDING"',
        '"farbuvannia"': '"DYEING"',
        '"dodatkovi_poslugy"': '"ADDITIONAL_SERVICES"',
        '"hutriani_vyroby"': '"FUR"',
        '"shkiriani_vyroby"': '"LEATHER"',
        
        # Варіанти з одинарними лапками
        "'odiah'": "'CLOTHING'",
        "'prania_bilyzny'": "'LAUNDRY'",
        "'prasuvanya'": "'IRONING'",
        "'dublyanky'": "'PADDING'",
        "'farbuvannia'": "'DYEING'",
        "'dodatkovi_poslugy'": "'ADDITIONAL_SERVICES'",
        "'hutriani_vyroby'": "'FUR'",
        "'shkiriani_vyroby'": "'LEATHER'",
        
        # Варіанти без лапок (для пошуку в тексті)
        'odiah': 'CLOTHING',
        'prania_bilyzny': 'LAUNDRY',
        'prasuvanya': 'IRONING',
        'dublyanky': 'PADDING',
        'farbuvannia': 'DYEING',
        'dodatkovi_poslugy': 'ADDITIONAL_SERVICES',
        'hutriani_vyroby': 'FUR',
        'shkiriani_vyroby': 'LEATHER'
    }
    
    # Шукаємо всі файли у проекті, крім віртуального оточення та інших службових директорій
    excluded_dirs = {'.git', '.idea', 'node_modules', 'target', 'build', 'dist', 'venv', '__pycache__'}
    
    # Розширення файлів, які будемо перевіряти
    included_extensions = {
        '.java', '.ts', '.tsx', '.js', '.jsx', 
        '.json', '.yaml', '.yml', '.properties', '.csv', 
        '.sql', '.md', '.xml', '.html', '.css', '.scss'
    }
    
    changed_files = 0
    
    print("Починаємо оновлення кодів категорій у файлах...\n")
    
    for root, dirs, files in os.walk(project_root, topdown=True):
        # Видаляємо виключені директорії з пошуку
        dirs[:] = [d for d in dirs if d not in excluded_dirs]
        
        for file in files:
            file_path = Path(root) / file
            
            # Перевіряємо розширення файлу
            if file_path.suffix.lower() not in included_extensions:
                continue
                
            # Пропускаємо сам скрипт
            if file_path.name == 'update_category_codes.py':
                continue
                
            # Виконуємо заміни у файлі
            if replace_in_file(file_path, replacements):
                print(f"Оновлено: {file_path.relative_to(project_root)}")
                changed_files += 1
    
    print(f"\nГотово! Оновлено {changed_files} файлів.")

if __name__ == "__main__":
    main()
