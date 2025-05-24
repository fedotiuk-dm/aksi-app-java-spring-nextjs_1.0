# 📚 JSDoc Documentation для AKSI Frontend

Цей проект використовує JSDoc для документування функціонального коду у архітектурі "DDD inside, FSD outside".

## 🚀 Швидкий старт

### 1. Встановлення (вже виконано)

Всі необхідні залежності встановлені:

- `jsdoc` - основний генератор документації
- `typedoc` - документація для TypeScript
- `concurrently` - паралельний запуск команд
- `http-server` - локальний сервер для документації
- `nodemon` - автооновлення при змінах

### 2. Генерація документації

```bash
# Генерація JSDoc документації
npm run docs:build

# Генерація TypeDoc документації
npm run docs:typedoc

# Генерація обох типів документації
npm run docs:all

# Розробка з автооновленням
npm run docs:dev

# Запуск тільки сервера документації
npm run docs:serve
```

### 3. Перегляд документації

Після генерації документація буде доступна за адресами:

- **JSDoc**: http://localhost:3001/jsdoc/
- **TypeDoc**: http://localhost:3001/typedoc/

---

## 📁 Структура документації

```
docs/                           # Згенерована документація (в .gitignore)
├── jsdoc/                      # JSDoc документація
│   ├── index.html              # Головна сторінка
│   ├── domain_client.html      # Домен клієнтів
│   ├── domain_order.html       # Домен замовлень
│   └── ...
│
├── typedoc/                    # TypeDoc документація
│   ├── index.html              # API довідник
│   ├── modules/                # Модулі по доменах
│   └── ...
│
docs-templates/                 # Шаблони та приклади (в репозиторії)
├── jsdoc-examples.md           # Приклади документування
├── jsdoc-checklist.md          # Чекліст для розробників
├── jsdoc-quick-reference.md    # Швидкий довідник
└── README.md                   # Цей файл
```

---

## 🎯 Специфіка для нашої архітектури

### Domain Layer (DDD inside)

Всі доменні модулі повинні бути детально задокументовані:

#### Hooks

```typescript
/**
 * @fileoverview Композиційний хук для [опис функціональності]
 * @module domain/[домен]/hooks
 * @description
 * Реалізує принципи SOLID:
 * - SRP: [пояснення]
 * - OCP: [пояснення]
 * - DIP: [пояснення]
 */
```

#### Services

```typescript
/**
 * @fileoverview Доменний сервіс для [бізнес-операцій]
 * @module domain/[домен]/services
 * @description
 * Бізнес-правила згідно з Order Wizard документацією:
 * - [правило 1]
 * - [правило 2]
 */
```

#### Stores

```typescript
/**
 * @fileoverview Zustand стор для управління станом [опис]
 * @module domain/[домен]/store
 * @description
 * Immutable стан з типізацією через Immer middleware
 */
```

### Feature Layer (FSD outside)

UI компоненти документуються як "тонкі" оболонки:

```tsx
/**
 * @fileoverview "Тонкий" UI компонент для [опис]
 * @module features/[фіча]/ui
 * @description
 * Не містить бізнес-логіки - тільки відображення.
 * Вся логіка делегується доменним хукам.
 */
```

---

## 🛠️ Налаштування IDE

### VS Code

Встановіть розширення:

- **Document This** - автогенерація JSDoc коментарів
- **TypeScript Hero** - автоімпорт та рефакторинг
- **Auto Comment Blocks** - автоматичні блоки коментарів

### WebStorm

Активуйте:

- **Tools > Generate JSDoc** - генерація документації
- **Code > Generate > Documentation Comment** - швидке створення коментарів

---

## 📋 Workflow для розробників

### При створенні нової функції

1. **Напишіть JSDoc коментар** перед кодом
2. **Додайте мінімум 2 @example** з реальними даними
3. **Вкажіть всі @param та @returns** з типами
4. **Додайте @throws** якщо функція може кидати помилки
5. **Перевірте документацію**: `npm run docs:build`

### При рефакторингу

1. **Оновіть JSDoc коментарі** відповідно до змін
2. **Перевірте всі @see посилання** на актуальність
3. **Оновіть приклади** якщо API змінилось
4. **Регенеруйте документацію**: `npm run docs:all`

### Перед commit

1. **Запустіть чекліст**: [docs-templates/jsdoc-checklist.md](./jsdoc-checklist.md)
2. **Перевірте типи**: `npm run type-check`
3. **Перевірте лінтер**: `npm run lint:strict`
4. **Згенеруйте документацію**: `npm run docs:all`

---

## 🎨 Стандарти якості

### Покриття документацією

- **Domain layer**: 100% публічних функцій
- **Feature layer**: 90% компонентів
- **Shared layer**: 95% утилітарних функцій

### Якість коментарів

- **Мінімум 2 @example** на функцію
- **Українська мова** для всіх описів
- **Термінологія домену** хімчистки
- **Посилання між модулями** через @see

### Автоматизація

- **CI/CD перевірка** покриття документацією
- **Pre-commit hooks** для валідації JSDoc
- **Щомісячний аудит** актуальності документації

---

## 🔍 Корисні команди

### Пошук недокументованих функцій

```bash
# Знайти функції без JSDoc
grep -r "export.*function\|export.*const.*=" domain/ | grep -v "/**"
```

### Статистика покриття

```bash
# Підрахунок задокументованих vs незадокументованих функцій
find domain/ -name "*.ts" -exec grep -l "/**" {} \; | wc -l
```

### Валідація JSDoc

```bash
# Перевірка синтаксису JSDoc коментарів
npm run docs:build 2>&1 | grep -i "warning\|error"
```

---

## 📚 Додаткові ресурси

### Документація

- [JSDoc офіційна документація](https://jsdoc.app/)
- [TypeDoc документація](https://typedoc.org/)
- [Markdown синтаксис для JSDoc](https://jsdoc.app/about-getting-started.html#adding-documentation-comments-to-your-code)

### Наші стандарти

- [Приклади документування](./jsdoc-examples.md)
- [Швидкий довідник тегів](./jsdoc-quick-reference.md)
- [Чекліст для розробників](./jsdoc-checklist.md)

### Архітектура проекту

- [Order Wizard документація](../docs/java_spring_nextjs/OrderWizard%20instruction_structure%20logic.md)
- [Архітектурні принципи DDD inside, FSD outside](../docs/java_spring_nextjs/реалізація_станів.md)

---

## 🤝 Contributing

При додаванні нового функціоналу:

1. **Документуйте згідно з нашими стандартами**
2. **Додавайте реальні приклади** з домену хімчистки
3. **Посилайтеся на Order Wizard** документацію де застосовується
4. **Пояснюйте SOLID принципи** у ключових компонентах
5. **Оновлюйте цей README** при зміні процесів

**Пам'ятайте**: добра документація - це інвестиція в майбутнє проекту! 🚀
