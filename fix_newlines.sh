#!/bin/bash

# Знаходимо всі файли без newline в кінці і додаємо його
find_files() {
  local extensions=("java" "xml" "yaml" "yml" "properties")
  local find_cmd="find $1 -type f"
  
  # Додаємо фільтр розширень
  local filter=""
  for ext in "${extensions[@]}"; do
    filter="$filter -o -name \"*.$ext\""
  done
  filter=${filter:3} # Видаляємо перший " -o "
  find_cmd="$find_cmd \( $filter \)"
  
  eval "$find_cmd"
}

fix_newlines() {
  local file="$1"
  if [ -f "$file" ]; then
    # Перевіряємо, чи файл закінчується новим рядком
    if [ "$(tail -c 1 "$file" | wc -l)" -eq 0 ]; then
      echo "Fixing file: $file"
      echo "" >> "$file"
    fi
  fi
}

# Основний скрипт
PROJECT_DIR="/home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0"
echo "Looking for files without trailing newline..."
find_files "$PROJECT_DIR" | while read -r file; do
  fix_newlines "$file"
done

echo "Done!"
