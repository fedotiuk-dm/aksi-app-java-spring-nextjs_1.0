#!/bin/bash

# Тестові скрипти для калькулятора замовлень
# Переконайтесь що backend запущений на порту 8080

API_BASE="http://localhost:8080/api"
CONTENT_TYPE="Content-Type: application/json"

echo "🧮 Тестування калькулятора замовлень AKSI Dry Cleaning System"
echo "================================================================"

# Колір для output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функція для відображення результатів
print_test() {
    echo -e "\n${BLUE}📋 ТЕСТ: $1${NC}"
    echo "➤ $2"
}

print_response() {
    echo -e "${GREEN}✅ Відповідь сервера:${NC}"
    echo "$1" | jq '.' 2>/dev/null || echo "$1"
    echo "================================================"
}

print_error() {
    echo -e "${RED}❌ Помилка:${NC}"
    echo "$1"
    echo "================================================"
}

# 1. ТЕСТ: Простий розрахунок піджака без модифікаторів
print_test "Піджак (ID 8) - базова ціна 480 грн x 1 шт" \
    "curl -X POST $API_BASE/calculate/item -H '$CONTENT_TYPE'"

RESPONSE=$(curl -s -X POST "$API_BASE/calculate/item" \
  -H "$CONTENT_TYPE" \
  -d '{
    "priceListItemId": "8",
    "quantity": 1,
    "appliedModifiers": [],
    "urgency": "NORMAL"
  }')

if [ $? -eq 0 ]; then
    print_response "$RESPONSE"
else
    print_error "Не вдалося з'єднатися з сервером"
fi

# 2. ТЕСТ: Піджак з терміновістю 48 годин (+50%)
print_test "Піджак (ID 8) з терміновістю 48 годин" \
    "Очікуємо: 480 + 50% = 720 грн"

RESPONSE=$(curl -s -X POST "$API_BASE/calculate/item" \
  -H "$CONTENT_TYPE" \
  -d '{
    "priceListItemId": "8",
    "quantity": 1,
    "appliedModifiers": [],
    "urgency": "URGENT_48H"
  }')

print_response "$RESPONSE"

# 3. ТЕСТ: Піджак з терміновістю 24 години (+100%)
print_test "Піджак (ID 8) з терміновістю 24 години" \
    "Очікуємо: 480 + 100% = 960 грн"

RESPONSE=$(curl -s -X POST "$API_BASE/calculate/item" \
  -H "$CONTENT_TYPE" \
  -d '{
    "priceListItemId": "8",
    "quantity": 1,
    "appliedModifiers": [],
    "urgency": "URGENT_24H"
  }')

print_response "$RESPONSE"

# 4. ТЕСТ: Піджак x 2 штуки
print_test "Піджак (ID 8) x 2 штуки" \
    "Очікуємо: 480 * 2 = 960 грн"

RESPONSE=$(curl -s -X POST "$API_BASE/calculate/item" \
  -H "$CONTENT_TYPE" \
  -d '{
    "priceListItemId": "8",
    "quantity": 2,
    "appliedModifiers": [],
    "urgency": "NORMAL"
  }')

print_response "$RESPONSE"

# 5. ТЕСТ: Брюки (ID 1) базова ціна 380 грн
print_test "Брюки (ID 1) - базова ціна 380 грн" \
    "Тестуємо інший предмет з прайсу"

RESPONSE=$(curl -s -X POST "$API_BASE/calculate/item" \
  -H "$CONTENT_TYPE" \
  -d '{
    "priceListItemId": "1",
    "quantity": 1,
    "appliedModifiers": [],
    "urgency": "NORMAL"
  }')

print_response "$RESPONSE"

# 6. ТЕСТ: Розрахунок замовлення з декількома предметами
print_test "Розрахунок замовлення: Піджак + Брюки" \
    "Піджак 480 + Брюки 380 = 860 грн"

RESPONSE=$(curl -s -X POST "$API_BASE/calculate/order-summary" \
  -H "$CONTENT_TYPE" \
  -d '{
    "items": [
      {
        "priceListItemId": "8",
        "quantity": 1,
        "appliedModifiers": [],
        "urgency": "NORMAL"
      },
      {
        "priceListItemId": "1",
        "quantity": 1,
        "appliedModifiers": [],
        "urgency": "NORMAL"
      }
    ]
  }')

print_response "$RESPONSE"

# 7. ТЕСТ: Замовлення зі знижкою Еверкард (10%)
print_test "Замовлення зі знижкою Еверкард 10%" \
    "Піджак + Брюки = 860 грн - 10% = 774 грн"

RESPONSE=$(curl -s -X POST "$API_BASE/calculate/order-summary" \
  -H "$CONTENT_TYPE" \
  -d '{
    "items": [
      {
        "priceListItemId": "8",
        "quantity": 1,
        "appliedModifiers": [],
        "urgency": "NORMAL"
      },
      {
        "priceListItemId": "1",
        "quantity": 1,
        "appliedModifiers": [],
        "urgency": "NORMAL"
      }
    ],
    "discount": {
      "type": "EVERCARD",
      "value": 10.0
    }
  }')

print_response "$RESPONSE"

# 8. ТЕСТ: Перевірка попереднього перегляду (preview)
print_test "Попередній перегляд ціни піджака" \
    "Тестуємо endpoint preview"

RESPONSE=$(curl -s -X POST "$API_BASE/calculate/item/preview" \
  -H "$CONTENT_TYPE" \
  -d '{
    "priceListItemId": "8",
    "quantity": 1,
    "appliedModifiers": [],
    "urgency": "NORMAL"
  }')

print_response "$RESPONSE"

# 9. ТЕСТ: Помилка - неіснуючий предмет
print_test "Тест помилки - неіснуючий предмет ID 999" \
    "Очікуємо HTTP 404 Not Found"

RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" -X POST "$API_BASE/calculate/item" \
  -H "$CONTENT_TYPE" \
  -d '{
    "priceListItemId": "999",
    "quantity": 1,
    "appliedModifiers": [],
    "urgency": "NORMAL"
  }')

print_response "$RESPONSE"

# 10. ТЕСТ: Валідація - від'ємна кількість
print_test "Тест валідації - від'ємна кількість" \
    "Очікуємо HTTP 400 Bad Request"

RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" -X POST "$API_BASE/calculate/item" \
  -H "$CONTENT_TYPE" \
  -d '{
    "priceListItemId": "8",
    "quantity": -1,
    "appliedModifiers": [],
    "urgency": "NORMAL"
  }')

print_response "$RESPONSE"

echo -e "\n${YELLOW}🎯 Завершено тестування основних сценаріїв калькулятора${NC}"
echo "Перевірте логи backend сервера для детальної інформації про обробку запитів."
