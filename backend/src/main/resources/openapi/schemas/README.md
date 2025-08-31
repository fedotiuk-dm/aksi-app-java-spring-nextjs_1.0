# 🏗️ Game Services API - Модульна Архітектура

## Огляд

Цей проект реалізує **модульну архітектуру** для Game Services API з окремими файлами для кожного домену. Такий підхід дозволяє легко підтримувати та розвивати кожен модуль окремо.

## 📂 Структура Файлів

```
backend/src/main/resources/openapi/
├── common.yaml                           # Спільні компоненти
├── game-services-api.yaml               # Головний API файл з $ref
└── schemas/
    ├── games.yaml                       # Управління іграми
    ├── difficulty-levels.yaml           # Рівні складності
    ├── service-types.yaml              # Типи послуг
    ├── price-configurations.yaml       # Конфігурації цін
    ├── boosters.yaml                   # Управління бустерами
    ├── calculator.yaml                 # Калькулятор цін
    ├── paths.yaml                      # Усі API paths
    └── README.md                       # Цей файл
```

## 🎯 Особливості Архітектури

### ✅ **Integer Ціни (в центах)**

- Всі ціни зберігаються як `integer` в центах
- `100` = $1.00, `15000` = $150.00
- Ніяких `float` обчислень на бекенді
- Мінімальні ціни: `0` центів

### ✅ **Повний CRUD**

- Кожен домен має повний набір операцій:
  - `GET /domain` - список з пагінацією
  - `POST /domain` - створення
  - `GET /domain/{id}` - отримання по ID
  - `PUT /domain/{id}` - оновлення
  - `DELETE /domain/{id}` - видалення

### ✅ **Модульність**

- Кожен домен в окремому файлі
- Легко додавати нові домени
- Незалежна розробка та тестування

## 📋 Домени API

### 🎮 **Games** (`games.yaml`)

**Шляхи:** `/game-services/games`

| Метод  | Шлях                        | Опис                      |
| ------ | --------------------------- | ------------------------- |
| GET    | `/game-services/games`      | Список ігор з фільтрацією |
| POST   | `/game-services/games`      | Створити гру              |
| GET    | `/game-services/games/{id}` | Отримати гру              |
| PUT    | `/game-services/games/{id}` | Оновити гру               |
| DELETE | `/game-services/games/{id}` | Видалити гру              |

**Поля:**

- `id` (UUID)
- `name` (string, 1-100 символів)
- `code` (string, унікальний код A-Z0-9\_-)
- `category` (enum: MMORPG, FPS, MOBA, etc.)
- `description` (string, до 1000 символів)
- `active` (boolean)
- `sortOrder` (integer)

### 📊 **Difficulty Levels** (`difficulty-levels.yaml`)

**Шляхи:** `/game-services/difficulty-levels`

| Метод  | Шлях                                    | Опис                     |
| ------ | --------------------------------------- | ------------------------ |
| GET    | `/game-services/difficulty-levels`      | Список рівнів складності |
| POST   | `/game-services/difficulty-levels`      | Створити рівень          |
| GET    | `/game-services/difficulty-levels/{id}` | Отримати рівень          |
| PUT    | `/game-services/difficulty-levels/{id}` | Оновити рівень           |
| DELETE | `/game-services/difficulty-levels/{id}` | Видалити рівень          |

**Поля:**

- `id` (UUID)
- `gameId` (UUID, обов'язковий)
- `name` (string, 1-100 символів)
- `code` (string, унікальний код A-Z0-9\_-)
- `levelValue` (integer, 1-1000)
- `description` (string, до 500 символів)
- `active` (boolean)
- `sortOrder` (integer)

### 🔧 **Service Types** (`service-types.yaml`)

**Шляхи:** `/game-services/service-types`

| Метод  | Шлях                                | Опис                 |
| ------ | ----------------------------------- | -------------------- |
| GET    | `/game-services/service-types`      | Список типів послуг  |
| POST   | `/game-services/service-types`      | Створити тип послуги |
| GET    | `/game-services/service-types/{id}` | Отримати тип послуги |
| PUT    | `/game-services/service-types/{id}` | Оновити тип послуги  |
| DELETE | `/game-services/service-types/{id}` | Видалити тип послуги |

**Поля:**

- `id` (UUID)
- `gameId` (UUID, обов'язковий)
- `name` (string, 1-100 символів)
- `code` (string, унікальний код A-Z0-9\_-)
- `description` (string, до 500 символів)
- `baseMultiplier` (integer, 1-1000, в basis points: 100 = 1.0x)
- `active` (boolean)
- `sortOrder` (integer)

### 💰 **Price Configurations** (`price-configurations.yaml`)

**Шляхи:** `/game-services/price-configurations`

| Метод  | Шлях                                       | Опис                    |
| ------ | ------------------------------------------ | ----------------------- |
| GET    | `/game-services/price-configurations`      | Список конфігурацій цін |
| POST   | `/game-services/price-configurations`      | Створити конфігурацію   |
| GET    | `/game-services/price-configurations/{id}` | Отримати конфігурацію   |
| PUT    | `/game-services/price-configurations/{id}` | Оновити конфігурацію    |
| DELETE | `/game-services/price-configurations/{id}` | Видалити конфігурацію   |

**Поля:**

- `id` (UUID)
- `gameId` (UUID, обов'язковий)
- `difficultyLevelId` (UUID, обов'язковий)
- `serviceTypeId` (UUID, обов'язковий)
- `basePrice` (integer, в центах, min: 0)
- `pricePerLevel` (integer, в центах, min: 0, default: 0)
- `currency` (string, default: "USD")
- `calculationType` (enum: LINEAR, RANGE, FORMULA, TIME_BASED)
- `calculationFormula` (string, JSON)
- `active` (boolean)
- `sortOrder` (integer)

### 👥 **Boosters** (`boosters.yaml`)

**Шляхи:** `/game-services/boosters`

| Метод  | Шлях                           | Опис             |
| ------ | ------------------------------ | ---------------- |
| GET    | `/game-services/boosters`      | Список бустерів  |
| POST   | `/game-services/boosters`      | Створити бустера |
| GET    | `/game-services/boosters/{id}` | Отримати бустера |
| PUT    | `/game-services/boosters/{id}` | Оновити бустера  |
| DELETE | `/game-services/boosters/{id}` | Видалити бустера |

**Поля:**

- `id` (UUID)
- `discordUsername` (string, 1-100 символів)
- `displayName` (string, 1-50 символів)
- `contactEmail` (string, email)
- `phoneNumber` (string, опціонально)
- `rating` (integer, 0-500, в basis points: 100 = 1.0 зірки)
- `totalOrders` (integer, min: 0)
- `successRate` (integer, 0-10000, в basis points: 10000 = 100.00%)
- `averageCompletionTime` (integer, в хвилинах)
- `active` (boolean)
- `verified` (boolean)

### 🧮 **Calculator** (`calculator.yaml`)

**Шляхи:** `/game-services/calculate`

| Метод | Шлях                       | Опис                     |
| ----- | -------------------------- | ------------------------ |
| POST  | `/game-services/calculate` | Розрахувати ціну послуги |

**Вхідні дані:**

```json
{
  "gameCode": "WOW",
  "serviceTypeCode": "LEVEL_BOOST",
  "difficultyLevelCode": "01-60",
  "targetLevel": 60,
  "startLevel": 1
}
```

**Результат:**

```json
{
  "finalPrice": 15000,
  "currency": "USD",
  "breakdown": {
    "basePrice": 10000,
    "difficultyMultiplier": 100,
    "serviceMultiplier": 100,
    "levelAdjustment": 2500,
    "totalAdjustment": 2500
  }
}
```

## 🚀 Початок Роботи

### 1. **Генерація API файлів**

```bash
# В директорії backend
mvn clean generate-sources
```

### 2. **Створення контролерів**

Для кожного домену створіть відповідний контролер:

```java
@RestController
@RequiredArgsConstructor
public class GamesController implements GamesApi {

    private final GameService gameService;

    @Override
    public ResponseEntity<GameListResponse> listGames(...) {
        // Implementation
    }

    // ... other methods
}
```

### 3. **Базові дані**

Створіть ігри, рівні складності, типи послуг та конфігурації цін через API:

```bash
# Створити гру
curl -X POST http://localhost:8080/game-services/games \
  -H "Content-Type: application/json" \
  -d '{
    "name": "World of Warcraft",
    "code": "WOW",
    "category": "MMORPG"
  }'

# Створити рівень складності
curl -X POST http://localhost:8080/game-services/difficulty-levels \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "...",
    "name": "Level 1-60",
    "code": "01-60",
    "levelValue": 60
  }'

# Створити тип послуги
curl -X POST http://localhost:8080/game-services/service-types \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "...",
    "name": "Character Leveling",
    "code": "LEVEL_BOOST",
    "baseMultiplier": 100
  }'

# Створити конфігурацію ціни
curl -X POST http://localhost:8080/game-services/price-configurations \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "...",
    "difficultyLevelId": "...",
    "serviceTypeId": "...",
    "basePrice": 100,
    "pricePerLevel": 10,
    "calculationType": "LINEAR"
  }'
```

### 4. **Тестування калькулятора**

```bash
curl -X POST http://localhost:8080/game-services/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "gameCode": "WOW",
    "serviceTypeCode": "LEVEL_BOOST",
    "difficultyLevelCode": "01-60",
    "targetLevel": 60,
    "startLevel": 1
  }'
```

## 📊 Фільтри та Пагінація

### **Пагінація**

Всі GET endpoints підтримують пагінацію:

- `page` (integer, 0-based, default: 0)
- `size` (integer, 1-100, default: 20)

### **Фільтри**

- `active` (boolean) - фільтр по активності
- `search` (string) - текстовий пошук
- `gameId` (UUID) - фільтр по грі (для підпорядкованих сутностей)

## 🔄 Міграція з монолітного API

### **Крок 1: Перегенерація**

```bash
mvn clean
mvn generate-sources
```

### **Крок 2: Оновлення контролерів**

Оновіть існуючі контролери щоб вони імплементували нові інтерфейси з окремих файлів.

### **Крок 3: Міграція даних**

Перенесіть існуючі дані в нову структуру використовуючи API endpoints.

### **Крок 4: Тестування**

Перевірте всі CRUD операції для кожного домену.

## 🎯 Переваги Модульної Архітектури

✅ **Масштабованість** - додавайте нові домени без зміни існуючих
✅ **Підтримуваність** - кожен файл має чітку відповідальність
✅ **Тестованість** - ізолюйте тести по доменах
✅ **Гнучкість** - змінюйте один домен без впливу на інші
✅ **Читабельність** - файли меншого розміру, легше орієнтуватися

## 📝 Примітки

- **Ціни:** Завжди в integer (центах) для уникнення проблем з округленням
- **UUID:** Використовуйте UUID для всіх ідентифікаторів
- **Коди:** Унікальні коди повинні бути в форматі A-Z0-9\_-
- **Множники:** В basis points (100 = 1.0x, 200 = 2.0x)
- **Рейтинги:** В basis points (100 = 1.0 зірка, 500 = 5.0 зірок)

Тепер ви маєте повноцінну модульну архітектуру Game Services API з окремими файлами для кожного домену! 🎉
