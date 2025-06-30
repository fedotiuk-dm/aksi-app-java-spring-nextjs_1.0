#!/usr/bin/env python3
"""
КОНСЕРВАТИВНИЙ скрипт для виправлення ТІЛЬКИ безпечних Checkstyle помилок
"""
import os
import re
import sys
from pathlib import Path
from typing import List, Tuple

def print_colored(text: str, color: str = "white"):
    """Друк кольорового тексту"""
    colors = {
        "red": "\033[91m",
        "green": "\033[92m",
        "yellow": "\033[93m",
        "blue": "\033[94m",
        "white": "\033[97m",
        "reset": "\033[0m"
    }
    print(f"{colors.get(color, colors['white'])}{text}{colors['reset']}")

def fix_javadoc_periods_safe(content: str) -> Tuple[str, int]:
    """
    БЕЗПЕЧНО додає крапки в кінці Javadoc коментарів
    """
    fixed_count = 0

    # Тільки для ОДНОРЯДДОВИХ Javadoc коментарів (найбезпечніше)
    pattern = r'(/\*\*\s*)([^*\n]+?)(\s*\*/)'

    def replacer(match):
        nonlocal fixed_count
        start = match.group(1)
        content_text = match.group(2).strip()
        end = match.group(3)

        # Перевіряємо чи немає крапки в кінці
        if not content_text.endswith('.') and not content_text.endswith('?') and not content_text.endswith('!'):
            # Перевіряємо що це не @return або @param рядок
            if not content_text.strip().startswith('@'):
                fixed_count += 1
                return f"{start}{content_text}.{end}"

        return match.group(0)

    fixed_content = re.sub(pattern, replacer, content)
    return fixed_content, fixed_count

def fix_simple_throws_tags(content: str) -> Tuple[str, int]:
    """
    БЕЗПЕЧНО додає @throws теги для IllegalArgumentException та RuntimeException
    """
    fixed_count = 0

    # Шукаємо методи з throws IllegalArgumentException
    pattern = r'(/\*\*[^}]*?\*/)\s*([^{]*?throws\s+IllegalArgumentException[^{]*?\{)'

    def replacer(match):
        nonlocal fixed_count
        javadoc = match.group(1)
        method_part = match.group(2)

        # Перевіряємо чи вже є @throws IllegalArgumentException
        if '@throws IllegalArgumentException' not in javadoc:
            # Додаємо перед закриттям Javadoc
            updated_javadoc = javadoc.replace('     */', '     * @throws IllegalArgumentException if invalid argument\n     */')
            fixed_count += 1
            return f"{updated_javadoc}{method_part}"

        return match.group(0)

    fixed_content = re.sub(pattern, replacer, content, flags=re.MULTILINE | re.DOTALL)
    return fixed_content, fixed_count

def process_java_file_safe(file_path: Path) -> dict:
    """Безпечно обробляє один Java файл"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        fixes = {}

        # Тільки БЕЗПЕЧНІ виправлення
        content, period_fixes = fix_javadoc_periods_safe(content)
        fixes['javadoc_periods'] = period_fixes

        content, throws_fixes = fix_simple_throws_tags(content)
        fixes['simple_throws'] = throws_fixes

        # Записуємо тільки якщо є зміни
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            fixes['file_changed'] = True
        else:
            fixes['file_changed'] = False

        return fixes

    except Exception as e:
        print_colored(f"❌ Помилка обробки {file_path}: {e}", "red")
        return {'error': str(e)}

def main():
    """Основна функція"""
    print_colored("🛡️  КОНСЕРВАТИВНЕ виправлення Checkstyle помилок...", "blue")
    print_colored("   Виправляються ТІЛЬКИ безпечні речі:", "yellow")
    print_colored("   • Крапки в одноряддових Javadoc", "white")
    print_colored("   • @throws для IllegalArgumentException", "white")
    print_colored("", "white")

    # Знаходимо Java файли
    backend_path = Path("backend")
    if not backend_path.exists():
        backend_path = Path(".")

    java_files = list(backend_path.glob("src/main/java/**/*.java"))

    if not java_files:
        print_colored("❌ Не знайдено Java файлів", "red")
        return

    print_colored(f"📁 Знайдено {len(java_files)} Java файлів", "blue")
    print_colored("", "white")

    total_fixes = {
        'javadoc_periods': 0,
        'simple_throws': 0,
        'files_changed': 0
    }

    # Обробляємо кожен файл
    for java_file in java_files:
        relative_path = java_file.relative_to(backend_path if backend_path.name == "backend" else Path("."))
        print(f"🔍 {relative_path}")

        fixes = process_java_file_safe(java_file)

        if 'error' in fixes:
            continue

        if fixes['file_changed']:
            total_fixes['files_changed'] += 1
            file_total = fixes['javadoc_periods'] + fixes['simple_throws']
            print_colored(f"  ✅ Виправлено {file_total} проблем", "green")
        else:
            print_colored(f"  ℹ️  Безпечних проблем не знайдено", "yellow")

        # Статистика
        total_fixes['javadoc_periods'] += fixes['javadoc_periods']
        total_fixes['simple_throws'] += fixes['simple_throws']

    # Підсумок
    print_colored("", "white")
    print_colored("📊 Підсумок БЕЗПЕЧНИХ виправлень:", "blue")
    print_colored(f"   • Javadoc крапки: {total_fixes['javadoc_periods']}", "green")
    print_colored(f"   • @throws теги: {total_fixes['simple_throws']}", "green")
    print_colored(f"   • Файлів змінено: {total_fixes['files_changed']}", "green")

    total_issues = total_fixes['javadoc_periods'] + total_fixes['simple_throws']
    print_colored(f"   🎯 Загалом виправлено: {total_issues} проблем", "green")

    if total_issues > 0:
        print_colored("", "white")
        print_colored("✅ Наступні кроки:", "blue")
        print_colored("1. git diff - перевірте зміни", "white")
        print_colored("2. mvn checkstyle:check - перевірте скільки залишилось", "white")
        print_colored("3. git add . && git commit -m 'Fix safe checkstyle issues'", "white")
    else:
        print_colored("", "white")
        print_colored("ℹ️  Безпечних проблем для автоматичного виправлення не знайдено", "yellow")

if __name__ == "__main__":
    main()
