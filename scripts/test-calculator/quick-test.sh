#!/bin/bash

# Швидкий тест калькулятора - просто запустіть і подивіться чи працює

echo "🔥 Швидкий тест калькулятора AKSI..."

# Простий тест піджака
curl -X POST http://localhost:8080/api/calculate/item \
  -H "Content-Type: application/json" \
  -d '{
    "priceListItemId": "8",
    "quantity": 1,
    "appliedModifiers": [],
    "urgency": "NORMAL"
  }' | jq '.'

echo ""
echo "✅ Якщо бачите JSON відповідь з finalPrice: 480.0 - калькулятор працює!"
echo "❌ Якщо помилка - перевірте що backend запущений на localhost:8080"
