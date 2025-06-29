#!/bin/bash

# 🔧 Скрипт для автоматичного виправлення API імпортів
# Замінює довгі шляхи на короткі alias з tsconfig.json

echo "🚀 Починаю виправлення API імпортів..."

# Функція для заміни імпортів в певній директорії
fix_imports_in_dir() {
    local dir=$1
    local old_pattern=$2
    local new_pattern=$3

    echo "📁 Обробляю директорію: $dir"
    echo "🔄 Замінюю: $old_pattern → $new_pattern"

    find "$dir" -name "*.ts" -type f -exec sed -i "s|$old_pattern|$new_pattern|g" {} \;

    local count=$(find "$dir" -name "*.ts" -type f -exec grep -l "$new_pattern" {} \; | wc -l)
    echo "✅ Оброблено файлів: $count"
    echo ""
}

# Виправлення для всіх API модулів
echo "🎯 Виправляю імпорти в domains/wizard/..."

# Stage API
fix_imports_in_dir "domains/wizard" "@/shared/api/generated/stage1" "@api/stage1"
fix_imports_in_dir "domains/wizard" "@/shared/api/generated/stage2" "@api/stage2"
fix_imports_in_dir "domains/wizard" "@/shared/api/generated/stage3" "@api/stage3"
fix_imports_in_dir "domains/wizard" "@/shared/api/generated/stage4" "@api/stage4"

# Substep API
fix_imports_in_dir "domains/wizard" "@/shared/api/generated/substep1" "@api/substep1"
fix_imports_in_dir "domains/wizard" "@/shared/api/generated/substep2" "@api/substep2"
fix_imports_in_dir "domains/wizard" "@/shared/api/generated/substep3" "@api/substep3"
fix_imports_in_dir "domains/wizard" "@/shared/api/generated/substep4" "@api/substep4"
fix_imports_in_dir "domains/wizard" "@/shared/api/generated/substep5" "@api/substep5"

# Main та Auth API
fix_imports_in_dir "domains/wizard" "@/shared/api/generated/main" "@api/main"
fix_imports_in_dir "domains/wizard" "@/shared/api/generated/auth" "@api/auth"

echo "🎉 Виправлення завершено!"
echo "💡 Тепер запустіть TypeScript перевірку:"
echo "   npx tsc --noEmit"
