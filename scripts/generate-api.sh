#!/bin/bash

# Скрипт для генерації API класів з OpenAPI схем
# Використовується для односторінкової системи замовлень хімчистки

echo "🚀 Генерація API класів для системи замовлень хімчистки..."

# Перевірка наявності Java та Maven
if ! command -v java &> /dev/null; then
    echo "❌ Java не знайдено. Встановіть Java 21+"
    exit 1
fi

if ! command -v mvn &> /dev/null; then
    echo "❌ Maven не знайдено. Встановіть Apache Maven"
    exit 1
fi

# Перехід до директорії backend
cd backend

echo "📋 Перевірка наявності OpenAPI схем..."

# Перевірка наявності всіх OpenAPI файлів
SCHEMA_FILES=(
    "src/main/resources/openapi/client-api.yaml"
    "src/main/resources/openapi/order-api.yaml"
    "src/main/resources/openapi/item-api.yaml"
    "src/main/resources/openapi/branch-api.yaml"
    "src/main/resources/openapi/document-api.yaml"
)

for file in "${SCHEMA_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Файл $file не знайдено"
        exit 1
    fi
    echo "✅ $file"
done

echo ""
echo "🔧 Очистка попередніх згенерованих файлів..."
mvn clean -q

echo ""
echo "🏗️  Генерація API класів..."
mvn generate-sources -q

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ API класи успішно згенеровано!"
    echo ""
    echo "📂 Згенеровані файли знаходяться в:"
    echo "   - target/generated-sources/openapi/src/main/java/com/aksi/api/"
    echo ""
    echo "🎯 Наступні кроки:"
    echo "   1. Реалізуйте контролери для кожного домену"
    echo "   2. Запустіть mvn compile для компіляції"
    echo "   3. Запустіть додаток: mvn spring-boot:run"
    echo ""
else
    echo ""
    echo "❌ Помилка генерації API класів"
    echo "Перевірте логи Maven для деталей"
    exit 1
fi
