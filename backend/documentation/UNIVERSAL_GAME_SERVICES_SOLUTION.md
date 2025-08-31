# 🏗️ **УНІВЕРСАЛЬНЕ РІШЕННЯ GAME SERVICES**

## 📋 **ЗАГАЛЬНИЙ ОГЛЯД ПРОЕКТУ**

На основі детального аналізу Excel файлу "OGEdge All Services test.xlsx" було розроблено універсальну архітектуру системи Game Services. Цей документ описує трансформацію специфічних даних Excel в гнучку систему без хардкодування.

---

## 🎯 **НОРМАЛІЗАЦІЯ ДАНИХ**

### **Аналіз вихідних даних:**

#### **Ігри (56 унікальних):**

- **Топ ігор**: WOW Classic, LOL, COD, Apex Legends, TFT, FIFA
- **Категорії**: MMORPG, FPS, MOBA, Battle Royale, Sports
- **Структура**: кожна гра має унікальні рівні складності та типи послуг

#### **Виконавці (73 записів):**

- **Контакти**: Discord (100%), Email (98.6%)
- **Спеціалізації**: 2-3 ігри в середньому на виконавця
- **Платіжні методи**: BTC, Zelle, Skrill (PayPal не використовується)

#### **Цінова структура:**

- **Діапазон цін**: $0.20 - $1000+
- **Типи розрахунків**: лінійні, діапазонні, формульні
- **Модифікатори**: швидкість, преміум акаунти, placement матчі

---

## 🏛️ **УНІВЕРСАЛЬНА АРХІТЕКТУРА ДАНИХ**

### **1. Домени системи:**

#### **Game Domain:**

```json
{
  "code": "WOW",
  "name": "World of Warcraft",
  "category": "MMORPG",
  "description": "MMORPG гра від Blizzard Entertainment",
  "active": true,
  "sortOrder": 1
}
```

#### **Difficulty Level Domain:**

```json
{
  "gameCode": "WOW",
  "code": "01-05",
  "name": "Level 1-5",
  "levelValue": 1,
  "sortOrder": 1,
  "active": true
}
```

#### **Service Type Domain:**

```json
{
  "gameCode": "WOW",
  "code": "LEVEL_BOOST",
  "name": "Character Leveling",
  "description": "Швидкий підйом рівня персонажа",
  "active": true,
  "sortOrder": 1
}
```

#### **Price Configuration Domain:**

```json
{
  "gameCode": "WOW",
  "difficultyLevelCode": "01-05",
  "serviceTypeCode": "LEVEL_BOOST",
  "basePrice": 1.0,
  "pricePerLevel": 1.0,
  "calculationFormula": "{\"type\": \"LINEAR\"}",
  "active": true
}
```

#### **Booster Domain:**

```json
{
  "discordUsername": "Gnomercy#5489",
  "contactEmail": "fallowmar@hotmail.com",
  "displayName": "Gnomercy",
  "rating": 4.8,
  "active": true
}
```

#### **Specialization Domain:**

```json
{
  "boosterDiscord": "Gnomercy#5489",
  "gameCode": "WOW",
  "specializationLevel": "EXPERT"
}
```

---

## 🔧 **КАЛЬКУЛЯТОР ENGINE - УНІВЕРСАЛЬНИЙ ПІДХІД**

### **Типи розрахунків (з Excel формул):**

#### **1. Лінійний розрахунок:**

```
Формула: (toLevel - fromLevel) × pricePerLevel + basePrice
Приклад: (10 - 1) × $1.00 + $0 = $9.00
```

#### **2. Діапазонний розрахунок:**

```
Формула: Σ (levelsInRange × priceForRange)
Приклад: (5 × $1.00) + (5 × $1.50) = $12.50
```

#### **3. Формульний розрахунок:**

```
Формула: basePrice + (levelDiff × pricePerLevel) × multiplier
Приклад: $10 + (5 × $2) × 1.5 = $25.00
```

### **Універсальна конфігурація:**

```json
{
  "gameCode": "WOW",
  "calculationType": "LINEAR",
  "basePrice": 1.0,
  "pricePerLevel": 1.0,
  "modifiers": [
    {
      "code": "EXPRESS_SERVICE",
      "type": "MULTIPLIER",
      "value": 1.5,
      "condition": "express_service"
    }
  ]
}
```

---

## 💰 **МОДИФІКАТОРИ - КОНФІГУРОВАНА СИСТЕМА**

### **Вбудовані модифікатори:**

1. **EXPRESS_SERVICE** - множник 1.5x (+50%)
2. **PREMIUM_ACCOUNT** - фіксована надбавка $5.00
3. **PLACEMENT_MATCHES** - фіксована надбавка $15.00
4. **WIN_BOOST** - множник для перемог
5. **DIVISION_BOOST** - надбавка за дивізіони

### **Структура модифікатора:**

```json
{
  "code": "EXPRESS_SERVICE",
  "name": "Швидке виконання",
  "type": "MULTIPLIER",
  "value": 1.5,
  "description": "Надбавка за швидке виконання (+50%)",
  "active": true
}
```

---

## 📊 **СТАТИСТИКА ТА АНАЛІТИКА ДАНИХ**

### **Розподіл ігор по виконавцям:**

- **LOL**: 11 виконавців (15%)
- **COD**: 7 виконавців (10%)
- **Apex**: 6 виконавців (8%)
- **Facebook Friend**: 6 виконавців (8%)
- **TFT**: 5 виконавців (7%)
- **FIFA**: 5 виконавців (7%)

### **Платіжні методи:**

- **Zelle**: 11 виконавців (15%)
- **Skrill**: 9 виконавців (12%)
- **BTC**: 7 виконавців (10%)
- **Coinbase**: 2 виконавців (3%)
- **PayPal**: 0 виконавців (0%)

### **Діапазон цін:**

- **Мінімальна**: $0.20 (New World professions)
- **Максимальна**: $1000+ (складні бусти)
- **Середня**: $5-15 за одиницю послуги
- **Найпоширеніші**: $1.00, $2.00, $5.00, $10.00

---

## 🔄 **МІГРАЦІЯ ДАНИХ - УНІВЕРСАЛЬНИЙ ПРОЦЕС**

### **Етап 1: Нормалізація ігор**

```
Excel: "WOW C", "Everquest 1", "LOL"
БД: Game(code="WOW", name="World of Warcraft")
   Game(code="EQ", name="Everquest")
   Game(code="LOL", name="League of Legends")
```

### **Етап 2: Створення діапазонів рівнів**

```
Excel: "01-05", "05-10", "10-15"
БД: DifficultyLevel(code="01-05", levelValue=1)
   DifficultyLevel(code="05-10", levelValue=5)
```

### **Етап 3: Конфігурація цін**

```
Excel формули → JSON конфігурації
=$O$2*4 → {"type": "MULTIPLICATION", "factor": 4}
```

### **Етап 4: Спеціалізації виконавців**

```
Excel: Game 1, Game 2, Game 3
БД: BoosterGameSpecialization таблиця
```

---

## 🎯 **ПЕРЕВАГИ УНІВЕРСАЛЬНОГО РІШЕННЯ**

### **Гнучкість:**

- ✅ Додавання нових ігор без зміни коду
- ✅ Динамічна зміна цін через інтерфейс
- ✅ Підтримка будь-яких типів розрахунків

### **Масштабованість:**

- ✅ Уніфікована структура для всіх ігор
- ✅ Незалежність компонентів
- ✅ Легке розширення

### **Підтримуваність:**

- ✅ Відсутність хардкодування
- ✅ Чітка архітектура
- ✅ Легке тестування

---

## 📋 **СТРУКТУРА ДЛЯ РОЗРОБКИ**

### **Ключові компоненти системи:**

#### **1. Domain Layer:**

- Game, DifficultyLevel, ServiceType entities
- PriceConfiguration, Booster entities
- Business rules та валідації

#### **2. Calculation Engine:**

- CalculationService - основний сервіс
- FormulaParser - парсер JSON формул
- ModifierProcessor - обробка модифікаторів

#### **3. Data Access Layer:**

- JPA репозиторії з specifications
- Міграції для всіх сутностей
- Оптимізація запитів

#### **4. API Layer:**

- REST контролери для всіх операцій
- DTO для запитів та відповідей
- Валідація вхідних даних

---

## 🚀 **ІМПЛЕМЕНТАЦІЙНИЙ ПЛАН**

### **Фаза 1: Базова структура**

1. Створення всіх JPA сутностей
2. Налаштування репозиторіїв
3. Базові міграції

### **Фаза 2: Calculation Engine**

1. Інтерфейси калькуляторів
2. JSON парсер формул
3. Система модифікаторів

### **Фаза 3: API та інтеграція**

1. REST API для управління
2. Інтеграція з Order Wizard
3. Адмін інтерфейс

### **Фаза 4: Міграція та тестування**

1. Імпорт даних з Excel
2. Валідація всіх розрахунків
3. Інтеграційне тестування

---

**Це рішення трансформує специфічні дані Excel в універсальну систему, де всі параметри конфігуруються через базу даних без необхідності зміни програмного коду.**
