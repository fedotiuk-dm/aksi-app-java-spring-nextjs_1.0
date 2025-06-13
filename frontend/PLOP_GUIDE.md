# 🎯 PLOP.JS ГЕНЕРАТОРИ для "DDD inside, FSD outside" архітектури

## 🚀 Швидкий старт

```bash
# Встановити залежності
npm install

# Генерація цілого домену (РЕКОМЕНДОВАНО)
npm run gen:domain

# Генерація окремих компонентів
npm run gen:hook    # Спеціалізований хук
npm run gen:store   # Zustand store
npm run gen:ui      # UI компонент
```

---

## 📋 ГЕНЕРАТОРИ

### 🔥 1. ДОМЕН (GOLDEN генератор)

**Використання:**

```bash
npm run gen:domain
# або
plop domain
```

**Що створює:**

```
domains/wizard/stage1/client-search/
├── schemas/index.ts                      # Експорт Orval схем
├── schemas/local-forms.schema.ts         # UI форми (опційно)
├── store/client-search.store.ts          # Zustand UI стан
├── hooks/use-client-search.hook.ts       # Композиційний хук
└── index.ts                              # Публічне API
```

**Приклад вводу:**

- Шлях: `wizard/stage1/client-search`
- Опис: `Пошук та вибір клієнтів`
- Локальні схеми: `false`

---

### 🔧 2. СПЕЦІАЛІЗОВАНИЙ ХУК

**Використання:**

```bash
npm run gen:hook
# або
plop specialized-hook
```

**Типи хуків:**

- `mutations` - API мутації (create, update, delete)
- `queries` - API запити (get, search, list)
- `forms` - React Hook Form інтеграція
- `lifecycle` - Lifecycle операції
- `navigation` - Навігація та переходи

**Що створює:**

```
domains/wizard/main/hooks/use-wizard-mutations.hook.ts
```

---

### 🗃️ 3. ZUSTAND STORE

**Використання:**

```bash
npm run gen:store
# або
plop store
```

**Що створює:**

```
domains/wizard/stage1/client-search/store/client-search.store.ts
```

**Приклад вводу:**

- Шлях: `wizard/stage1/client-search`
- Поля стану: `searchTerm,selectedId,isActive`

---

### 🖼️ 4. UI КОМПОНЕНТ

**Використання:**

```bash
npm run gen:ui
# або
plop ui-component
```

**Що створює:**

```
features/order-wizard/client-selection/ui/ClientSearchStep.tsx
```

**Приклад вводу:**

- Фіча: `order-wizard/client-selection`
- Компонент: `ClientSearchStep`
- Хук: `useClientSearch`

---

## 🎯 WORKFLOW ПРИКЛАДИ

### Створення нового Stage1 домену

```bash
# 1. Генеруємо базову структуру
npm run gen:domain
# Вводимо: wizard/stage1/branch-selection

# 2. Результат:
domains/wizard/stage1/branch-selection/
├── schemas/index.ts                    # ✅ TODO: Додати Orval імпорти
├── store/branch-selection.store.ts     # ✅ TODO: Додати UI стан
├── hooks/use-branch-selection.hook.ts  # ✅ TODO: Додати API логіку
└── index.ts                           # ✅ Готово

# 3. Редагуємо згенеровані файли заповнивши TODO секції
```

### Розбиття великого композиційного хука

```bash
# 1. Створюємо спеціалізовані хуки
npm run gen:hook
# Вводимо: wizard/main, mutations

npm run gen:hook
# Вводимо: wizard/main, queries

# 2. Результат:
domains/wizard/main/hooks/
├── use-wizard-main.hook.ts       # Оригінальний (рефакторимо)
├── use-wizard-mutations.hook.ts  # ✅ Новий
└── use-wizard-queries.hook.ts    # ✅ Новий

# 3. Переносимо логіку з use-wizard-main.hook.ts до спеціалізованих
```

---

## 📝 СТРУКТУРА ШАБЛОНІВ

### Шаблони знаходяться в `plop-templates/`:

```
plop-templates/
├── domain/
│   ├── schemas-index.hbs           # schemas/index.ts
│   ├── local-forms-schema.hbs      # schemas/local-forms.schema.ts
│   ├── store.hbs                   # store/{domain}.store.ts
│   ├── compositional-hook.hbs      # hooks/use-{domain}.hook.ts
│   └── index.hbs                   # index.ts
├── hooks/
│   ├── specialized-mutations.hbs   # Мутації
│   ├── specialized-queries.hbs     # Запити
│   └── specialized-forms.hbs       # Форми
├── store/
│   └── zustand-store.hbs          # Zustand store
└── ui/
    └── component.hbs              # React компонент
```

---

## 🔧 HELPER ФУНКЦІЇ

### Plop.js helpers для шаблонів:

- `{{lastSegment path}}` - останній сегмент шляху
- `{{moduleFromPath path}}` - перший сегмент (module name)
- `{{pascalCase str}}` - PascalCase
- `{{camelCase str}}` - camelCase
- `{{dashCase str}}` - dash-case

### Приклади:

```handlebars
{{! Для шляху "wizard/stage1/client-search" }}
{{lastSegment modulePath}}
→ client-search
{{moduleFromPath modulePath}}
→ wizard
{{pascalCase 'client-search'}}
→ ClientSearch
{{camelCase 'client-search'}}
→ clientSearch
{{dashCase 'ClientSearch'}}
→ client-search
```

---

## ✅ BEST PRACTICES

### 1. **Спочатку генеруй, потім заповнюй**

```bash
# Генеруємо структуру
npm run gen:domain

# Заповнюємо TODO секції відповідно до API
```

### 2. **Дотримуйся архітектурних правил**

- ✅ UI стан тільки в Zustand
- ✅ API дані тільки в React Query
- ✅ Композиційні хуки < 200 рядків
- ✅ Імпорти через публічне API

### 3. **Використовуй відповідні генератори**

- Новий домен → `gen:domain`
- Розбиття хука → `gen:hook`
- Нова UI сторінка → `gen:ui`

### 4. **Перевіряй результат**

```bash
# Після генерації
npm run lint
npm run type-check
```

---

## 🎯 РЕЗУЛЬТАТ

**З Plop.js ви отримаєте:**

1. ✅ **Стандартизована архітектура** - всі домени однакові
2. ✅ **Швидкість х10** - генерація замість ручного створення
3. ✅ **Уникнення помилок** - шаблони дотримуються правил
4. ✅ **Простота онбордингу** - нові розробники швидко підключаються
5. ✅ **Консистентність коду** - однакові паттерни скрізь

**Час розробки Stage1-4 скоротиться з тижнів до днів! 🚀**
