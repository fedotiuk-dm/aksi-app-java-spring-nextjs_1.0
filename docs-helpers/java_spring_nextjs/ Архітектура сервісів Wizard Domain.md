# Архітектура сервісів Wizard Domain - Мінімалістський підхід

domain/wizard/
├── store/ # 🏪 Zustand - Стан (що зберігаємо)
├── hooks/ # 🔗 Композиція - Інтеграція (як поєднуємо)
├── services/ # ⚙️ Тонкий шар - Композиція (мінімальна логіка)
├── adapters/ # 🌐 API - Зовнішній світ (звідки беремо)
├── schemas/ # ✅ Валідація - Правила (що перевіряємо)
└── machines/ # 🚦 Навігація - Крок за кроком (куди йдемо)

## 🎯 Основний принцип - МІНІМАЛІЗМ

**НЕ створюємо гігантські сервіси!**
Сервіси = тонкий шар композиції існуючих компонентів.
Розмір сервісу: 50-100 рядків максимум.

## 🚫 Що ЗАБОРОНЕНО в сервісах

### ❌ НЕ дублюємо адаптери:

```typescript
// ❌ НЕПРАВИЛЬНО - дублюємо адаптер
class WrongService {
  async getCategories() {
    const response = await api.getCategories(); // Це вже є в адаптері!
    return response.map((x) => ({ id: x.id })); // Це вже є в адаптері!
  }
}

// ✅ ПРАВИЛЬНО - використовуємо адаптер
class CorrectService {
  async getCategories() {
    return await this.categoryAdapter.getAll(); // Адаптер вже все зробив
  }
}
```

### ❌ НЕ дублюємо Zustand:

```typescript
// ❌ НЕПРАВИЛЬНО - керуємо станом в сервісі
class WrongService {
  private data = [];
  setState(data) {
    this.data = data;
  } // Це роль Zustand!
}

// ✅ ПРАВИЛЬНО - повертаємо дані для Zustand
class CorrectService {
  processData(data) {
    return data.filter((x) => x.active); // Тільки обробка
  }
}
```

### ❌ НЕ дублюємо TanStack Query:

```typescript
// ❌ НЕПРАВИЛЬНО - кешуємо в сервісі
class WrongService {
  private cache = new Map(); // Це роль TanStack Query!
}

// ✅ ПРАВИЛЬНО - працюємо з закешованими даними
class CorrectService {
  processDataFromCache(cachedData) {
    return this.applyBusinessRules(cachedData);
  }
}
```

## ✅ Що сервіси РОБЛЯТЬ - Мінімум

### 1. Композиція адаптерів (2-3 рядки)

```typescript
class ItemService {
  async getItemWithPrice(itemId: string) {
    const item = await this.itemAdapter.getById(itemId);
    const price = await this.pricingAdapter.getPrice(itemId);
    return { ...item, price }; // Мінімальна композиція
  }
}
```

### 2. Валідація через Zod (1-2 рядки)

```typescript
class OrderService {
  validateOrder(data: unknown) {
    return orderSchema.parse(data); // Тільки валідація
  }
}
```

### 3. Мінімальна бізнес-логіка (5-10 рядків)

```typescript
class PricingService {
  calculateDiscount(basePrice: number, clientType: string): number {
    const discountMap = { vip: 0.1, regular: 0.05, new: 0 };
    return basePrice * (1 - (discountMap[clientType] || 0));
  }
}
```

## 📏 Розміри сервісів - Жорсткі ліміти

### Розмір файлу:

- **Максимум: 150 рядків**
- **Оптимально: 50-80 рядків**
- **Якщо більше - розбивати!**

### Кількість методів:

- **Максимум: 5-7 методів**
- **Оптимально: 3-4 методи**
- **Один метод = одна відповідальність**

### Складність методу:

- **Максимум: 15 рядків на метод**
- **Оптимально: 5-8 рядків**
- **Якщо більше - виносити в приватні методи**

## 🏗️ Правильна структура сервісів

```
services/
├── stage-1-client-and-order/
│   ├── client-management.service.ts        # 60 рядків
│   ├── branch-selection.service.ts         # 40 рядків
│   └── order-initialization.service.ts     # 70 рядків
│
├── stage-2-item-management/
│   ├── item-manager.service.ts             # 50 рядків - координатор
│   ├── basic-info.service.ts               # 80 рядків - основна інформація
│   ├── characteristics.service.ts          # 90 рядків - характеристики
│   ├── defects-stains.service.ts          # 60 рядків - дефекти
│   ├── pricing-calculation.service.ts      # 70 рядків - розрахунки
│   └── photo-management.service.ts         # 40 рядків - фото
│
├── stage-3-order-params/
│   ├── execution-params.service.ts         # 50 рядків
│   ├── global-discounts.service.ts         # 60 рядків
│   └── payment-processing.service.ts       # 70 рядків
│
└── stage-4-confirmation/
    ├── order-validation.service.ts         # 80 рядків
    ├── receipt-generation.service.ts       # 90 рядків
    └── completion.service.ts               # 50 рядків
```

## 🔄 Правильний Flow - Без дублювання

### Приклад: Отримання категорій

**Неправильно** (дублюємо адаптер):

```typescript
// В сервісі - 30 рядків дублювання!
async getCategories() {
  const response = await api.getCategories();
  return response.map(cat => ({
    id: cat.id,
    name: cat.title,
    active: cat.isEnabled
  }));
}
```

**Правильно** (використовуємо адаптер):

```typescript
// В сервісі - 3 рядки!
async getActiveCategories() {
  const categories = await this.categoryAdapter.getAll();
  return categories.filter(cat => cat.active);
}
```

**Економія коду: 90%**

### Приклад: Валідація предмета

**Неправильно** (дублюємо Zod):

```typescript
// В сервісі - 50 рядків валідації!
validateItem(data) {
  if (!data.name) throw new Error('Name required');
  if (!data.category) throw new Error('Category required');
  // ... ще 45 рядків
}
```

**Правільно** (використовуємо схему):

```typescript
// В сервісі - 2 рядки!
validateItem(data) {
  return itemSchema.parse(data);
}
```

**Економія коду: 96%**

## ⚡ Інтеграція з існуючими компонентами

### З Zustand (через hooks):

```
Hook → Service (мін. обробка) → Hook оновлює Zustand
```

### З TanStack Query (через hooks):

```
Hook → TanStack Query (кеш) → Service (мін. логіка) → результат
```

### З Adapters (композиція):

```
Service → Adapter1 + Adapter2 → мін. композиція → результат
```

### З XState (через hooks):

```
XState guard → Hook → Service (валідація) → true/false
```

## 📊 Метрики якості сервісу

### ✅ Правильний сервіс:

- Розмір: < 100 рядків
- Методів: < 6
- Залежностей: 2-3 адаптери
- Дублювання: 0%
- Тестованість: 100%

### ❌ Неправильний сервіс:

- Розмір: > 200 рядків
- Методів: > 10
- API виклики: є (має бути в адаптерах!)
- Стан: є (має бути в Zustand!)
- Кешування: є (має бути в TanStack Query!)

## 🎯 Алгоритм створення сервісу

### Крок 1: Перевірити існуючі компоненти

```
- Чи є адаптер для цих даних? → Використати!
- Чи є Zod схема? → Використати!
- Чи є Zustand store? → НЕ дублювати!
```

### Крок 2: Визначити мінімальну логіку

```
- Що НЕ роблять адаптери? → Це роль сервісу
- Яка композиція потрібна? → 2-3 рядки
- Яка валідація потрібна? → 1 рядок
```

### Крок 3: Написати мінімальний сервіс

```
- Імпорти: тільки необхідні адаптери
- Методи: тільки композиція + валідація
- Розмір: максимум 100 рядків
```

### Крок 4: Перевірити на дублювання

```
- Чи є такий код в адаптерах? → Видалити!
- Чи є така логіка в hooks? → Видалити!
- Чи можна спростити? → Спростити!
```

## 🔧 Практичні рекомендації

### Коли створювати сервіс:

- Потрібна композиція 2+ адаптерів
- Потрібна специфічна валідація бізнес-правил
- Потрібна мінімальна трансформація даних
- Повторювана логіка між hooks

### Коли НЕ створювати сервіс:

- Простий виклик одного адаптера
- Геттер/сеттер для Zustand
- UI логіка
- Все що вже є в існуючих компонентах

### Золоте правило:

**Якщо сервіс > 100 рядків - він неправильний!**
Розбивайте на менші або використовуйте існуючі компоненти.

## 📈 Результати мінімалістського підходу

### Економія коду:

- Замість 10 сервісів по 500 рядків = 5000 рядків
- Робимо 15 сервісів по 60 рядків = 900 рядків
- **Економія: 82%**

### Переваги:

- Простіше розуміти
- Легше тестувати
- Швидше розробляти
- Менше помилок
- Краща підтримка

### Головний принцип:

**Сервіс = мінімальний клей між існуючими компонентами**
