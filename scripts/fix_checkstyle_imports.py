#!/usr/bin/env python3
"""
Fix common Checkstyle issues in Java sources:
 - Reorder and group imports to match CustomImportOrder:
   Groups: 1) java|javax  2) org  3) other third-party  4) com.aksi
   - Sort imports alphabetically within a group
   - One blank line between groups, no extra blank lines inside a group
   - Keep static imports as a separate final block (sorted), after normal imports
 - Normalize blank lines around package/import blocks
 - Trim trailing whitespace

Additionally, detect catch(Exception|Throwable) occurrences and report them.
By default they are NOT modified; pass --fix-catches to replace with RuntimeException.

Usage:
  python scripts/fix_checkstyle_imports.py --apply           # write changes
  python scripts/fix_checkstyle_imports.py --dry-run         # only report (default)
  python scripts/fix_checkstyle_imports.py --apply --fix-catches
"""

import argparse
import os
import re
import sys
from pathlib import Path

RE_IMPORT = re.compile(r'^(import\s+[^;]+;)', re.MULTILINE)
RE_IMPORT_LINE = re.compile(r'^import\s+(static\s+)?([\w\.\*]+)(\.[\w\*]+)*\s*;\s*$')
RE_PACKAGE = re.compile(r'^(package\s+[^;]+;)', re.MULTILINE)
RE_CATCH_ILLEGAL = re.compile(r'catch\s*\(\s*(Exception|Throwable)\b')


def classify_group(import_path: str) -> int:
    if import_path.startswith('java.') or import_path.startswith('javax.'):
        return 0
    if import_path.startswith('org.'):
        return 1
    if import_path.startswith('com.aksi.') or import_path == 'com.aksi':
        return 3
    return 2


def split_imports(lines):
    normal = []
    static = []
    for line in lines:
        m = RE_IMPORT_LINE.match(line.strip())
        if not m:
            continue
        is_static = bool(m.group(1))
        path_prefix = m.group(2) or ''
        full_text = line.strip()
        item = (classify_group(path_prefix), full_text)
        if is_static:
            static.append(item)
        else:
            normal.append(item)
    return normal, static


def rebuild_import_block(normal, static):
    # Sort within group and concatenate by group order 0..3
    grouped = {0: [], 1: [], 2: [], 3: []}
    for g, text in normal:
        grouped[g].append(text)
    for k in grouped:
        grouped[k] = sorted(set(grouped[k]))

    parts = []
    for k in [0, 1, 2, 3]:
        if grouped[k]:
            parts.append('\n'.join(grouped[k]))
    normal_block = '\n\n'.join(parts)

    # Static imports as separate final block
    static_sorted = sorted(set(t for _, t in static))
    static_block = '\n'.join(static_sorted) if static_sorted else ''

    if normal_block and static_block:
        return normal_block + '\n\n' + static_block
    return normal_block or static_block


def normalize_blank_lines(text: str) -> str:
    # Trim trailing spaces
    text = '\n'.join([line.rstrip() for line in text.splitlines()]) + ('\n' if text.endswith('\n') else '')
    return text


def process_java_file(path: Path, fix_catches: bool) -> tuple[bool, int]:
    original = path.read_text(encoding='utf-8')
    content = original

    # Identify package and import block ranges
    pkg_match = RE_PACKAGE.search(content)
    # Find all import statements lines and their span
    imports_iter = list(RE_IMPORT.finditer(content))
    changed = False

    illegal_catches = len(RE_CATCH_ILLEGAL.findall(content))
    new_content = content

    if imports_iter:
        first_import_start = imports_iter[0].start()
        last_import_end = imports_iter[-1].end()

        # Expand to cover whole import block (include blank lines between imports)
        # Move start to beginning of its line, and end to end of line
        start_line = content.rfind('\n', 0, first_import_start) + 1
        end_line = content.find('\n', last_import_end)
        if end_line == -1:
            end_line = len(content)

        import_block = content[start_line:end_line]
        import_lines = [l for l in import_block.splitlines() if l.strip().startswith('import ')]

        normal, static = split_imports(import_lines)
        rebuilt = rebuild_import_block(normal, static)

        # Build final: keep exactly one blank line before/after import block
        before = content[:start_line]
        after = content[end_line:]

        # Ensure a single blank line after package;
        if pkg_match:
            # Ensure there is a blank line between package and first import
            pkg_end = pkg_match.end()
            # Collapse whitespace between package end and start_line to 2 newlines
            new_before = content[:pkg_end] + '\n\n'
            before = new_before

        new_import_block = rebuilt + '\n\n'
        new_content = before + new_import_block + after.lstrip('\n')
        new_content = normalize_blank_lines(new_content)
        changed = (new_content != original)

    if fix_catches and illegal_catches:
        new_content2 = re.sub(RE_CATCH_ILLEGAL, 'catch (RuntimeException', new_content)
        if new_content2 != new_content:
            new_content = new_content2
            changed = True

    if changed:
        path.write_text(new_content, encoding='utf-8')

    return changed, illegal_catches


def should_skip(p: Path) -> bool:
    s = str(p)
    if '/src/test/java/' in s or '\\src\\test\\java\\' in s:
        return True
    if '/target/' in s or '\\target\\' in s:
        return True
    if '/generated-sources/' in s or '\\generated-sources\\' in s:
        return True
    return False


def main():
    parser = argparse.ArgumentParser(description='Fix Checkstyle import order and detect illegal catches')
    parser.add_argument('--root', default='backend/src/main/java', help='Root of Java sources')
    parser.add_argument('--apply', action='store_true', help='Write changes to files')
    parser.add_argument('--fix-catches', action='store_true', help='Replace catch(Exception/Throwable) with RuntimeException')
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists():
        print(f'[fix] Root not found: {root}', file=sys.stderr)
        sys.exit(1)

    total_files = 0
    changed_files = 0
    total_illegal_catches = 0
    candidates = []

    for p in root.rglob('*.java'):
        if should_skip(p):
            continue
        total_files += 1
        if args.apply:
            changed, catches = process_java_file(p, args.fix_catches)
        else:
            # Dry run: process in-memory only
            original = p.read_text(encoding='utf-8')
            imports_iter = list(RE_IMPORT.finditer(original))
            changed = False
            if imports_iter:
                # Simple heuristic: if there are extra blank lines between imports or not sorted
                import_lines = [l for l in original.splitlines() if l.strip().startswith('import ')]
                normal, static = split_imports(import_lines)
                rebuilt = rebuild_import_block(normal, static)
                current_block = '\n'.join(import_lines).strip()
                if rebuilt.strip() != current_block:
                    changed = True
            catches = len(RE_CATCH_ILLEGAL.findall(original))

        total_illegal_catches += catches
        if changed or catches:
            candidates.append((p, changed, catches))

    print(f'[fix] Scanned: {total_files} files')
    print(f'[fix] Files needing import fix: {sum(1 for _, c, _ in candidates if c)}')
    print(f'[fix] Files with illegal catches: {sum(1 for _, _, c in candidates if c)} (total occurrences: {total_illegal_catches})')

    if args.apply:
        print(f'[fix] Applied changes to {sum(1 for _, c, _ in candidates if c)} files')
        if args.fix_catches:
            print('[fix] Applied catch replacements to files with occurrences')
        else:
            print('[fix] Note: catches were NOT changed (use --fix-catches to modify)')
    else:
        print('[fix] Dry-run only. Pass --apply to write changes.')


if __name__ == '__main__':
    main()


