# DDD inside, FSD outside для Next.js

Цей документ описує архітектурний підхід "DDD inside, FSD outside" для фронтенд-проектів на Next.js, де вся функціональна логіка знаходиться в доменному шарі (DDD), а UI компоненти (FSD) є максимально "тонкими". Весь проект притримується SOLID принципів.

## Основні принципи

1. **Вся функціональна логіка в доменному шарі**

   - Бізнес-логіка, стан, валідація, інтеграція з API - все в `domains`
   - Включаючи функціональні React-хуки, які раніше були б у `features`

2. **UI компоненти максимально "тонкі"**

   - Компоненти в `features` лише відображають дані
   - Не містять бізнес-логіки або стану
   - Отримують всі дані та обробники подій з доменного шару

3. **Строга типізація на всіх рівнях**

   - Чіткі контракти між доменами та UI
   - Типи даних визначаються в доменному шарі

4. **Модульність та дотримання SOLID**
   - Single Responsibility Principle: кожен файл має одну відповідальність
   - Open/Closed Principle: розширення функціоналу без модифікації існуючого коду
   - Liskov Substitution Principle: правильне використання наслідування та поліморфізму
   - Interface Segregation Principle: малі, специфічні інтерфейси
   - Dependency Inversion Principle: залежність від абстракцій, а не конкретних реалізацій

## Базова структура проекту

```
frontend/
├── domains/                    # DDD - вся функціональна логіка
│   ├── client/                 # Домен "Клієнт"
│   │   ├── entities/           # Бізнес-сутності
│   │   ├── value-objects/      # Об'єкти-значення
│   │   ├── repositories/       # Інтерфейси та реалізації репозиторіїв
│   │   ├── services/           # Доменні сервіси
│   │   ├── use-cases/          # Сценарії використання
│   │   ├── events/             # Доменні події
│   │   ├── hooks/              # React-хуки для роботи з доменом
│   │   │   ├── use-client-search.hook.ts
│   │   │   ├── use-client-selection.hook.ts
│   │   │   ├── use-client-form.hook.ts
│   │   │   └── index.ts
│   │   ├── store/              # Zustand сторі для стану домену
│   │   │   ├── client-search.store.ts
│   │   │   ├── client-selection.store.ts
│   │   │   ├── client-form.store.ts
│   │   │   └── index.ts
│   │   ├── schemas/            # Zod схеми для валідації
│   │   │   ├── client.schema.ts
│   │   │   └── index.ts
│   │   ├── types/              # Типи та інтерфейси
│   │   │   ├── client.types.ts
│   │   │   ├── contact-method.enum.ts
│   │   │   └── index.ts
│   │   ├── utils/              # Утиліти специфічні для домену
│   │   │   ├── client-form-adapter.ts
│   │   │   ├── client-search-adapter.ts
│   │   │   └── index.ts
│   │   └── index.ts            # Публічне API домену
│   │
│   ├── order/                  # Домен "Замовлення"
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── use-cases/
│   │   ├── events/
│   │   ├── hooks/              # React-хуки для роботи з замовленнями
│   │   │   ├── use-order-creation.hook.ts
│   │   │   ├── use-order-items.hook.ts
│   │   │   └── index.ts
│   │   ├── store/              # Zustand сторі для стану замовлень
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   ├── item/                   # Домен "Предмет"
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── use-cases/
│   │   ├── events/
│   │   ├── hooks/              # React-хуки для роботи з предметами
│   │   │   ├── use-item-creation.hook.ts
│   │   │   ├── use-item-properties.hook.ts
│   │   │   ├── use-item-defects.hook.ts
│   │   │   ├── use-price-calculation.hook.ts
│   │   │   └── index.ts
│   │   ├── store/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   ├── wizard/                 # Домен "Візард" (управління процесом)
│   │   ├── entities/
│   │   ├── services/
│   │   ├── hooks/              # React-хуки для управління візардом
│   │   │   ├── use-wizard-navigation.hook.ts
│   │   │   ├── use-wizard-validation.hook.ts
│   │   │   ├── use-wizard-state.hook.ts
│   │   │   └── index.ts
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   └── shared/                 # Спільні доменні концепти
│       ├── types/
│       ├── utils/
│       ├── hooks/              # Спільні хуки для доменів
│       └── index.ts
│
├── features/                   # FSD - тільки "тонкі" UI компоненти
│   ├── order-wizard/           # Фіча "Візард замовлень"
│   │   ├── client-selection/   # Підфіча "Вибір клієнта"
│   │   │   ├── ui/             # UI компоненти без логіки
│   │   │   │   ├── ClientSelectionStep.tsx
│   │   │   │   ├── ClientSearchForm.tsx
│   │   │   │   ├── ClientList.tsx
│   │   │   │   ├── ClientForm.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts        # Публічне API фічі
│   │   │
│   │   ├── branch-selection/   # Підфіча "Вибір філії"
│   │   │   ├── ui/
│   │   │   └── index.ts
│   │   │
│   │   ├── item-wizard/        # Підфіча "Візард предметів"
│   │   │   ├── ui/
│   │   │   │   ├── ItemWizardStep.tsx
│   │   │   │   ├── BasicInfoStep.tsx
│   │   │   │   ├── PropertiesStep.tsx
│   │   │   │   ├── DefectsStep.tsx
│   │   │   │   ├── PriceCalculatorStep.tsx
│   │   │   │   ├── PhotoDocumentationStep.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── order-parameters/   # Підфіча "Параметри замовлення"
│   │   │   ├── ui/
│   │   │   └── index.ts
│   │   │
│   │   ├── order-confirmation/ # Підфіча "Підтвердження замовлення"
│   │   │   ├── ui/
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts            # Композиція всіх підфіч
│   │
│   └── shared/                 # Спільні UI компоненти
│       ├── ui/
│       └── index.ts
│
├── shared/                     # Спільні утиліти та інфраструктура
│   ├── api/                    # API клієнти (OpenAPI)
│   │   ├── client/             # API для роботи з клієнтами
│   │   ├── order/              # API для роботи з замовленнями
│   │   └── index.ts
│   │
│   ├── lib/                    # Загальні утиліти
│   │   ├── validation/         # Утиліти для валідації
│   │   ├── formatting/         # Утиліти для форматування
│   │   ├── hooks/              # Загальні React-хуки (не доменні)
│   │   └── index.ts
│   │
│   ├── ui/                     # Спільні UI компоненти
│   │   ├── atoms/              # Атомарні компоненти
│   │   ├── molecules/          # Молекулярні компоненти
│   │   ├── organisms/          # Організми
│   │   └── index.ts
│   │
│   └── config/                 # Конфігурація
│       ├── api.ts
│       ├── theme.ts
│       └── index.ts
│
├── app/                        # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── order-wizard/           # Маршрути для Order Wizard
│       └── page.tsx
│
└── pages/                      # Next.js Pages Router (якщо використовується)
    └── api/                    # API маршрути
```

## Детальний опис структури доменів (DDD)

### Домен "Клієнт" (client)

```
domains/client/
├── entities/                   # Бізнес-сутності
│   ├── client.entity.ts        # Основна сутність клієнта
│   ├── client-factory.ts       # Фабрика для створення клієнтів
│   └── index.ts
│
├── value-objects/              # Об'єкти-значення
│   ├── contact-info.vo.ts      # Контактна інформація
│   ├── address.vo.ts           # Адреса
│   ├── client-source.vo.ts     # Джерело інформації про клієнта
│   └── index.ts
│
├── repositories/               # Інтерфейси та реалізації репозиторіїв
│   ├── client-repository.interface.ts  # Інтерфейс репозиторію клієнтів
│   ├── client-repository.ts    # Реалізація репозиторію
│   └── index.ts
│
├── services/                   # Доменні сервіси
│   ├── client-search.service.ts  # Сервіс пошуку клієнтів
│   ├── client-validation.service.ts  # Сервіс валідації клієнтів
│   └── index.ts
│
├── use-cases/                  # Сценарії використання
│   ├── search-clients.use-case.ts  # Пошук клієнтів
│   ├── create-client.use-case.ts   # Створення клієнта
│   ├── update-client.use-case.ts   # Оновлення клієнта
│   ├── select-client.use-case.ts   # Вибір клієнта
│   └── index.ts
│
├── events/                     # Доменні події
│   ├── client-created.event.ts  # Подія створення клієнта
│   ├── client-updated.event.ts  # Подія оновлення клієнта
│   ├── client-selected.event.ts # Подія вибору клієнта
│   └── index.ts
│
├── hooks/                      # React-хуки для роботи з доменом
│   ├── use-client-search.hook.ts    # Хук для пошуку клієнтів
│   ├── use-client-selection.hook.ts # Хук для вибору клієнта
│   ├── use-client-form.hook.ts      # Хук для форми клієнта
│   ├── use-client-mutations.hook.ts # Хук для мутацій клієнта
│   ├── use-debounce-search.hook.ts  # Хук для відкладеного пошуку
│   └── index.ts
│
├── store/                      # Zustand сторі для стану домену
│   ├── client-search.store.ts     # Стор для пошуку клієнтів
│   ├── client-selection.store.ts  # Стор для вибору клієнта
│   ├── client-form.store.ts       # Стор для форми клієнта
│   ├── client-creation.store.ts   # Стор для створення клієнта
│   ├── client-editing.store.ts    # Стор для редагування клієнта
│   └── index.ts
│
├── schemas/                    # Zod схеми для валідації
│   ├── client.schema.ts        # Схема клієнта
│   ├── contact-info.schema.ts  # Схема контактної інформації
│   ├── address.schema.ts       # Схема адреси
│   └── index.ts
│
├── types/                      # Типи та інтерфейси
│   ├── client.types.ts         # Типи клієнта
│   ├── contact-method.enum.ts  # Перелік методів контакту
│   ├── client-source.enum.ts   # Перелік джерел інформації
│   ├── form-types.ts           # Типи для форм
│   ├── state-types.ts          # Типи для стану
│   └── index.ts
│
├── utils/                      # Утиліти специфічні для домену
│   ├── client-form-adapter.ts  # Адаптер для форми клієнта
│   ├── client-search-adapter.ts # Адаптер для пошуку клієнтів
│   ├── validation-utils.ts     # Утиліти для валідації
│   └── index.ts
│
└── index.ts                    # Публічне API домену
```

### Домен "Замовлення" (order)

```
domains/order/
├── entities/
│   ├── order.entity.ts         # Основна сутність замовлення
│   ├── order-factory.ts        # Фабрика для створення замовлень
│   └── index.ts
│
├── value-objects/
│   ├── receipt-number.vo.ts    # Номер квитанції
│   ├── unique-tag.vo.ts        # Унікальна мітка
│   ├── execution-date.vo.ts    # Дата виконання
│   ├── order-status.vo.ts      # Статус замовлення
│   └── index.ts
│
├── repositories/
│   ├── order-repository.interface.ts
│   ├── order-repository.ts
│   └── index.ts
│
├── services/
│   ├── receipt-generator.service.ts  # Генерація номера квитанції
│   ├── order-validation.service.ts   # Валідація замовлення
│   ├── price-calculator.service.ts   # Розрахунок вартості
│   └── index.ts
│
├── use-cases/
│   ├── create-order.use-case.ts      # Створення замовлення
│   ├── add-item-to-order.use-case.ts # Додавання предмета
│   ├── calculate-total.use-case.ts   # Розрахунок загальної вартості
│   ├── apply-discount.use-case.ts    # Застосування знижки
│   ├── finalize-order.use-case.ts    # Завершення замовлення
│   └── index.ts
│
├── events/
│   ├── order-created.event.ts
│   ├── item-added.event.ts
│   ├── discount-applied.event.ts
│   ├── order-finalized.event.ts
│   └── index.ts
│
├── hooks/                      # React-хуки для роботи з замовленнями
│   ├── use-order-creation.hook.ts    # Хук для створення замовлення
│   ├── use-order-items.hook.ts       # Хук для роботи з предметами замовлення
│   ├── use-order-parameters.hook.ts  # Хук для параметрів замовлення
│   ├── use-order-discounts.hook.ts   # Хук для знижок замовлення
│   ├── use-order-payment.hook.ts     # Хук для оплати замовлення
│   ├── use-order-confirmation.hook.ts # Хук для підтвердження замовлення
│   └── index.ts
│
├── store/                      # Zustand сторі для стану замовлень
│   ├── order-creation.store.ts    # Стор для створення замовлення
│   ├── order-items.store.ts       # Стор для предметів замовлення
│   ├── order-parameters.store.ts  # Стор для параметрів замовлення
│   ├── order-discounts.store.ts   # Стор для знижок замовлення
│   ├── order-payment.store.ts     # Стор для оплати замовлення
│   └── index.ts
│
├── schemas/
│   ├── order.schema.ts
│   ├── receipt-number.schema.ts
│   ├── unique-tag.schema.ts
│   ├── execution-date.schema.ts
│   └── index.ts
│
├── types/
│   ├── order.types.ts
│   ├── payment-method.enum.ts
│   ├── discount-type.enum.ts
│   ├── urgency-level.enum.ts
│   └── index.ts
│
├── utils/
│   ├── receipt-utils.ts
│   ├── date-utils.ts
│   ├── discount-utils.ts
│   └── index.ts
│
└── index.ts
```

### Домен "Предмет" (item)

```
domains/item/
├── entities/
│   ├── item.entity.ts          # Основна сутність предмета
│   ├── item-factory.ts         # Фабрика для створення предметів
│   └── index.ts
│
├── value-objects/
│   ├── category.vo.ts          # Категорія
│   ├── material.vo.ts          # Матеріал
│   ├── color.vo.ts             # Колір
│   ├── filling.vo.ts           # Наповнювач
│   ├── defect.vo.ts            # Дефект
│   ├── stain.vo.ts             # Пляма
│   ├── price-modifier.vo.ts    # Модифікатор ціни
│   └── index.ts
│
├── repositories/
│   ├── item-repository.interface.ts
│   ├── item-repository.ts
│   ├── category-repository.interface.ts
│   ├── category-repository.ts
│   └── index.ts
│
├── services/
│   ├── item-validation.service.ts    # Валідація предмета
│   ├── price-calculation.service.ts  # Розрахунок ціни предмета
│   ├── photo-documentation.service.ts # Робота з фотодокументацією
│   └── index.ts
│
├── use-cases/
│   ├── create-item.use-case.ts       # Створення предмета
│   ├── select-category.use-case.ts   # Вибір категорії
│   ├── add-properties.use-case.ts    # Додавання характеристик
│   ├── add-defects.use-case.ts       # Додавання дефектів
│   ├── calculate-price.use-case.ts   # Розрахунок ціни
│   ├── add-photos.use-case.ts        # Додавання фото
│   └── index.ts
│
├── events/
│   ├── item-created.event.ts
│   ├── category-selected.event.ts
│   ├── properties-added.event.ts
│   ├── defects-added.event.ts
│   ├── price-calculated.event.ts
│   ├── photos-added.event.ts
│   └── index.ts
│
├── hooks/                      # React-хуки для роботи з предметами
│   ├── use-item-creation.hook.ts     # Хук для створення предмета
│   ├── use-category-selection.hook.ts # Хук для вибору категорії
│   ├── use-item-properties.hook.ts   # Хук для характеристик предмета
│   ├── use-item-defects.hook.ts      # Хук для дефектів предмета
│   ├── use-price-calculation.hook.ts # Хук для розрахунку ціни
│   ├── use-photo-documentation.hook.ts # Хук для фотодокументації
│   └── index.ts
│
├── store/                      # Zustand сторі для стану предметів
│   ├── item-creation.store.ts     # Стор для створення предмета
│   ├── category-selection.store.ts # Стор для вибору категорії
│   ├── item-properties.store.ts   # Стор для характеристик предмета
│   ├── item-defects.store.ts      # Стор для дефектів предмета
│   ├── price-calculation.store.ts # Стор для розрахунку ціни
│   ├── photo-documentation.store.ts # Стор для фотодокументації
│   └── index.ts
│
├── schemas/
│   ├── item.schema.ts
│   ├── category.schema.ts
│   ├── material.schema.ts
│   ├── color.schema.ts
│   ├── defect.schema.ts
│   ├── stain.schema.ts
│   ├── price-modifier.schema.ts
│   └── index.ts
│
├── types/
│   ├── item.types.ts
│   ├── category.types.ts
│   ├── material.enum.ts
│   ├── color.types.ts
│   ├── defect.enum.ts
│   ├── stain.enum.ts
│   ├── price-modifier.types.ts
│   └── index.ts
│
├── utils/
│   ├── item-utils.ts
│   ├── price-formatting.ts
│   ├── calculator-utils.ts
│   └── index.ts
│
└── index.ts
```

### Домен "Візард" (wizard)

```
domains/wizard/
├── entities/
│   ├── wizard-step.entity.ts   # Сутність кроку візарда
│   ├── wizard.entity.ts        # Сутність візарда
│   └── index.ts
│
├── services/
│   ├── wizard-navigation.service.ts  # Сервіс навігації по візарду
│   ├── wizard-validation.service.ts  # Сервіс валідації кроків
│   └── index.ts
│
├── hooks/                      # React-хуки для управління візардом
│   ├── use-wizard-navigation.hook.ts # Хук для навігації по візарду
│   ├── use-wizard-validation.hook.ts # Хук для валідації кроків
│   ├── use-wizard-state.hook.ts      # Хук для стану візарда
│   ├── use-wizard-step.hook.ts       # Хук для поточного кроку
│   └── index.ts
│
├── store/                      # Zustand сторі для стану візарда
│   ├── wizard-navigation.store.ts # Стор для навігації по візарду
│   ├── wizard-validation.store.ts # Стор для валідації кроків
│   ├── wizard-state.store.ts      # Стор для стану візарда
│   └── index.ts
│
├── types/
│   ├── wizard-step.types.ts
│   ├── wizard-navigation.types.ts
│   ├── wizard-validation.types.ts
│   └── index.ts
│
├── utils/
│   ├── wizard-utils.ts
│   └── index.ts
│
└── index.ts
```

## Детальний опис структури фіч (FSD)

### Фіча "Вибір клієнта" (client-selection)

```
features/order-wizard/client-selection/
├── ui/                         # UI компоненти без логіки
│   ├── ClientSelectionStep.tsx # Головний компонент кроку
│   ├── ClientSearchForm.tsx    # Форма пошуку клієнта
│   ├── ClientList.tsx          # Список клієнтів
│   ├── ClientForm.tsx          # Форма створення/редагування клієнта
│   └── index.ts
│
└── index.ts                    # Публічне API фічі
```

### Фіча "Візард предметів" (item-wizard)

```
features/order-wizard/item-wizard/
├── ui/                         # UI компоненти без логіки
│   ├── ItemWizardStep.tsx      # Головний компонент кроку
│   ├── BasicInfoStep.tsx       # Крок основної інформації
│   ├── PropertiesStep.tsx      # Крок характеристик
│   ├── DefectsStep.tsx         # Крок дефектів
│   ├── PriceCalculatorStep.tsx # Крок розрахунку ціни
│   ├── PhotoDocumentationStep.tsx # Крок фотодокументації
│   └── index.ts
│
└── index.ts                    # Публічне API фічі
```

## Рекомендації щодо імплементації

### 1. Розділення відповідальності

- **Домени (DDD)**: Містять всю бізнес-логіку, валідацію, розрахунки, правила, стан та React-хуки
- **Фічі (FSD)**: Містять тільки UI компоненти, які отримують дані та обробники подій з доменів
- **Shared**: Містить спільні утиліти, API клієнти та UI компоненти

### 2. Строга типізація

- Використовуйте TypeScript з найсуворішими налаштуваннями (`strict: true`)
- Визначайте чіткі інтерфейси між доменами та UI
- Використовуйте Zod для валідації та генерації типів

### 3. Уникнення великих файлів

- Розбивайте логіку на малі, спеціалізовані модулі
- Дотримуйтесь принципу Single Responsibility (SRP)
- Використовуйте композицію для об'єднання функціональності

### 4. Інтеграція з Zustand

- Створюйте окремі сторі для кожної функціональної області в доменному шарі
- Використовуйте middleware для логування та дебагінгу
- Інкапсулюйте доступ до сторів через хуки в доменному шарі

### 5. Використання Zod

- Визначайте схеми в доменному шарі
- Використовуйте схеми для валідації вхідних даних
- Генеруйте типи на основі схем для узгодженості

### 6. Інтеграція з OpenAPI

- Використовуйте генеровані типи з OpenAPI для API клієнтів
- Створюйте адаптери для перетворення API-моделей в доменні сутності
- Інкапсулюйте роботу з API в репозиторіях

### 7. Взаємодія між доменами

- Використовуйте події для комунікації між доменами
- Створюйте чіткі інтерфейси для взаємодії
- Уникайте прямих залежностей між доменами

### 8. Взаємодія між доменами та UI

- UI компоненти отримують дані та обробники подій з доменних хуків
- Доменні хуки інкапсулюють всю логіку роботи з доменом
- UI компоненти не містять бізнес-логіки або стану

## Приклад взаємодії між доменом та UI

### Домен (hooks)

```
domains/client/hooks/use-client-search.hook.ts
```

Цей хук інкапсулює всю логіку пошуку клієнтів:

- Управління станом пошуку через Zustand
- Валідація пошукового запиту
- Виклик API через репозиторій
- Обробка помилок
- Пагінація результатів

### UI (компонент)

```
features/order-wizard/client-selection/ui/ClientSearchForm.tsx
```

Цей компонент тільки відображає дані та передає події в домен:

- Отримує дані та обробники подій з доменного хука
- Відображає форму пошуку та результати
- Не містить бізнес-логіки або стану
- Не робить прямих API-викликів

## Висновок

Підхід "DDD inside, FSD outside" з усією функціональною логікою в доменному шарі дозволяє:

1. Чітко розділити відповідальність між бізнес-логікою та UI
2. Забезпечити строгу типізацію на всіх рівнях
3. Уникнути дублювання логіки
4. Спростити тестування
5. Зробити UI компоненти максимально простими та зосередженими тільки на відображенні
6. Полегшити підтримку та розширення функціоналу

Ця архітектура особливо корисна для великих проектів з складною бізнес-логікою, де важливо забезпечити чіткі межі між різними частинами системи та уникнути "спагеті-коду".
