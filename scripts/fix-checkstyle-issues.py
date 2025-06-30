#!/usr/bin/env python3
"""
Скрипт для автоматичного виправлення Checkstyle помилок в Java проекті
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

def fix_javadoc_periods(content: str) -> Tuple[str, int]:
    """
    Виправляє SummaryJavadoc - додає крапку в кінці першого речення Javadoc
    """
    fixed_count = 0

    # 1. Багаторядкові Javadoc коментарі
    multiline_pattern = r'(/\*\*\s*\n\s*\*\s+)([^.]*?)(\s*\n\s*\*(?:\s+@|\s*/))'

    def multiline_replacer(match):
        nonlocal fixed_count
        start = match.group(1)
        summary = match.group(2).strip()
        end = match.group(3)

        # Перевіряємо чи немає крапки в кінці
        if not summary.endswith('.') and not summary.endswith('?') and not summary.endswith('!'):
            fixed_count += 1
            return f"{start}{summary}.{end}"
        return match.group(0)

    # 2. Одноряддові Javadoc коментарі /** ... */
    oneline_pattern = r'(/\*\*\s+)([^*/]*?)(\s+\*/)'

    def oneline_replacer(match):
        nonlocal fixed_count
        start = match.group(1)
        summary = match.group(2).strip()
        end = match.group(3)

        # Перевіряємо чи немає крапки в кінці і чи не містить @ теги
        if (not summary.endswith('.') and not summary.endswith('?') and
            not summary.endswith('!') and '@' not in summary):
            fixed_count += 1
            return f"{start}{summary}.{end}"
        return match.group(0)

    # Застосовуємо обидва паттерни
    fixed_content = re.sub(multiline_pattern, multiline_replacer, content, flags=re.MULTILINE | re.DOTALL)
    fixed_content = re.sub(oneline_pattern, oneline_replacer, fixed_content, flags=re.MULTILINE)

    return fixed_content, fixed_count

def fix_missing_throws_tags(content: str) -> Tuple[str, int]:
    """
    Додає відсутні @throws теги для методів що кидають виключення
    """
    fixed_count = 0

    # Знаходимо методи що кидають виключення без @throws в Javadoc
    method_pattern = r'(/\*\*.*?\*/)\s*([^{]*?throws\s+(\w+(?:Exception|Error)[^{]*?)\{)'

    def replacer(match):
        nonlocal fixed_count
        javadoc = match.group(1)
        method_signature = match.group(2)
        throws_part = match.group(3)

        # Витягуємо назви виключень
        exceptions = re.findall(r'(\w+(?:Exception|Error))', throws_part)

        # Перевіряємо які @throws відсутні в Javadoc
        missing_throws = []
        for exception in exceptions:
            if f"@throws {exception}" not in javadoc:
                missing_throws.append(exception)

        if missing_throws:
            # Додаємо відсутні @throws теги перед закриваючим */
            throws_tags = "\n".join([f"     * @throws {exc} якщо виникла помилка" for exc in missing_throws])
            updated_javadoc = javadoc.replace("     */", f"     * {throws_tags}\n     */")
            fixed_count += len(missing_throws)
            return f"{updated_javadoc}{method_signature}"

        return match.group(0)

    fixed_content = re.sub(method_pattern, replacer, content, flags=re.MULTILINE | re.DOTALL)
    return fixed_content, fixed_count

def fix_missing_param_tags(content: str) -> Tuple[str, int]:
    """
    Додає відсутні @param теги для generic типів
    """
    fixed_count = 0

    # Знаходимо generic класи без @param тегів
    generic_pattern = r'(/\*\*.*?\*/)\s*(?:public\s+)?(?:class|interface)\s+\w+<([^>]+)>'

    def replacer(match):
        nonlocal fixed_count
        javadoc = match.group(1)
        generic_params = match.group(2)

        # Витягуємо generic параметри
        params = [p.strip() for p in generic_params.split(',')]

        # Перевіряємо які @param відсутні
        missing_params = []
        for param in params:
            if f"@param <{param}>" not in javadoc:
                missing_params.append(param)

        if missing_params:
            # Додаємо відсутні @param теги
            param_tags = "\n".join([f"     * @param <{param}> тип параметра" for param in missing_params])
            updated_javadoc = javadoc.replace("     */", f"     * {param_tags}\n     */")
            fixed_count += len(missing_params)
            return javadoc.replace(javadoc, updated_javadoc) + match.group(0)[len(javadoc):]

        return match.group(0)

    fixed_content = re.sub(generic_pattern, replacer, content, flags=re.MULTILINE | re.DOTALL)
    return fixed_content, fixed_count

def fix_html_in_javadoc(content: str) -> Tuple[str, int]:
    """
    Виправляє HTML помилки в Javadoc - замінює < > на HTML entities
    """
    fixed_count = 0

    # Знаходимо Javadoc коментарі з проблемними типами в <>
    html_pattern = r'(/\*\*.*?\*/)'

    def replacer(match):
        nonlocal fixed_count
        javadoc = match.group(1)
        original_javadoc = javadoc

        # Замінюємо проблемні типи в Javadoc на безпечні варіанти
        javadoc = re.sub(r'<(CommunicationMethodType|CommunicationMethod)>', r'`\1`', javadoc)

        if javadoc != original_javadoc:
            fixed_count += 1

        return javadoc

    fixed_content = re.sub(html_pattern, replacer, content, flags=re.MULTILINE | re.DOTALL)
    return fixed_content, fixed_count

def process_java_file(file_path: Path) -> dict:
    """Обробляє один Java файл"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        fixes = {}

        # Застосовуємо виправлення
        content, period_fixes = fix_javadoc_periods(content)
        fixes['javadoc_periods'] = period_fixes

        content, throws_fixes = fix_missing_throws_tags(content)
        fixes['missing_throws'] = throws_fixes

        content, param_fixes = fix_missing_param_tags(content)
        fixes['missing_params'] = param_fixes

        content, html_fixes = fix_html_in_javadoc(content)
        fixes['html_fixes'] = html_fixes

        # Записуємо файл тільки якщо є зміни
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
    print_colored("🔧 Автоматичне виправлення Checkstyle помилок...", "blue")
    print_colored("", "white")

    # Знаходимо всі Java файли в src/main/java
    backend_path = Path("backend")
    if not backend_path.exists():
        backend_path = Path(".")

    java_files = list(backend_path.glob("src/main/java/**/*.java"))

    if not java_files:
        print_colored("❌ Не знайдено Java файлів в src/main/java", "red")
        return

    print_colored(f"📁 Знайдено {len(java_files)} Java файлів", "blue")
    print_colored("", "white")

    total_fixes = {
        'javadoc_periods': 0,
        'missing_throws': 0,
        'missing_params': 0,
        'html_fixes': 0,
        'files_changed': 0
    }

    # Обробляємо кожен файл
    for java_file in java_files:
        relative_path = java_file.relative_to(backend_path if backend_path.name == "backend" else Path("."))
        print(f"🔍 Обробка: {relative_path}")

        fixes = process_java_file(java_file)

        if 'error' in fixes:
            continue

        if fixes['file_changed']:
            total_fixes['files_changed'] += 1
            file_total = (fixes['javadoc_periods'] + fixes['missing_throws'] +
                         fixes['missing_params'] + fixes['html_fixes'])
            print_colored(f"  ✅ Виправлено {file_total} проблем", "green")
        else:
            print_colored(f"  ℹ️  Проблем не знайдено", "yellow")

        # Додаємо до загальної статистики
        total_fixes['javadoc_periods'] += fixes['javadoc_periods']
        total_fixes['missing_throws'] += fixes['missing_throws']
        total_fixes['missing_params'] += fixes['missing_params']
        total_fixes['html_fixes'] += fixes['html_fixes']

    # Підсумок
    print_colored("", "white")
    print_colored("📊 Підсумок виправлень:", "blue")
    print_colored(f"   • Javadoc крапки: {total_fixes['javadoc_periods']}", "green")
    print_colored(f"   • @throws теги: {total_fixes['missing_throws']}", "green")
    print_colored(f"   • @param теги: {total_fixes['missing_params']}", "green")
    print_colored(f"   • HTML помилки: {total_fixes['html_fixes']}", "green")
    print_colored(f"   • Файлів змінено: {total_fixes['files_changed']}", "green")

    total_issues = (total_fixes['javadoc_periods'] + total_fixes['missing_throws'] +
                   total_fixes['missing_params'] + total_fixes['html_fixes'])
    print_colored(f"   🎯 Загалом виправлено: {total_issues} проблем", "green")

    if total_issues > 0:
        print_colored("", "white")
        print_colored("🔄 Рекомендації:", "blue")
        print_colored("1. Перевірте зміни: git diff", "white")
        print_colored("2. Запустіть checkstyle: mvn checkstyle:check", "white")
        print_colored("3. Закомітьте зміни: git add . && git commit -m 'Fix checkstyle issues'", "white")

if __name__ == "__main__":
    main()
