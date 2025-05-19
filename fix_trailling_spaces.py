#!/usr/bin/env python3
"""
Script to remove trailing spaces from all files.
This fixes RegexpSingleline warnings from Checkstyle about "Line has trailing spaces".
"""

import os
import re
import sys
from pathlib import Path

def fix_trailing_spaces(file_path):
    """
    Remove trailing spaces from a file.
    Returns the number of lines that were modified.
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace trailing spaces with nothing
    new_content = re.sub(r'[ \t]+$', '', content, flags=re.MULTILINE)
    
    # Count modified lines
    original_lines = content.split('\n')
    new_lines = new_content.split('\n')
    modified_count = sum(1 for old, new in zip(original_lines, new_lines) if old != new)
    
    # Only write if there were changes
    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(new_content)
            
    return modified_count

def process_directory(directory_path):
    """Process all files in a directory and its subdirectories."""
    total_files = 0
    modified_files = 0
    total_modified_lines = 0
    
    # Список розширень файлів для обробки
    extensions = ('.java', '.xml', '.properties', '.yml', '.yaml', '.md', '.txt')
    
    for root, _, files in os.walk(directory_path):
        for file in files:
            if file.endswith(extensions):
                file_path = os.path.join(root, file)
                total_files += 1
                
                try:
                    modified_lines = fix_trailing_spaces(file_path)
                    if modified_lines > 0:
                        modified_files += 1
                        total_modified_lines += modified_lines
                        print(f"Fixed {modified_lines} lines in {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
    
    return total_files, modified_files, total_modified_lines

def main():
    # Use the current directory if no directory is specified
    if len(sys.argv) > 1:
        directory = sys.argv[1]
    else:
        directory = os.path.join(os.getcwd(), 'backend')  # Default to backend directory
    
    if not os.path.isdir(directory):
        print(f"Error: {directory} is not a valid directory")
        sys.exit(1)
    
    print(f"Processing files in {directory}...")
    total_files, modified_files, total_modified_lines = process_directory(directory)
    
    print(f"\nSummary:")
    print(f"  Total files processed: {total_files}")
    print(f"  Files with trailing spaces fixed: {modified_files}")
    print(f"  Total lines modified: {total_modified_lines}")

if __name__ == "__main__":
    main()