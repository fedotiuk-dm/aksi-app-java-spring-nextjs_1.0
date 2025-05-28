/**
 * @fileoverview Wizard Types Index - Типи для Order Wizard домену
 * @module domain/wizard/types
 * @author AKSI Team
 * @since 1.0.0
 *
 * ================================================================================
 * 📋 WIZARD DOMAIN TYPES - РОЗБИТТЯ ВЕЛИКОГО ФАЙЛУ НА ЛОГІЧНІ КОМПОНЕНТИ
 * ================================================================================
 *
 * ## 🎯 ОСНОВНА МЕТА РЕФАКТОРИНГУ
 *
 * Замість одного файлу wizard-step-states.types.ts (700+ рядків) створено:
 * - 21 файл по 17-102 рядки кожен
 * - Структурування за етапами та підкроками OrderWizard
 * - Дотримання принципу SRP (Single Responsibility Principle)
 * - Полегшення тестування та підтримки коду
 *
 * ## 📁 СТРУКТУРА ТИПІВ ЗА ЕТАПАМИ
 *
 * ```
 * types/
 * ├── shared/           # 🌐 Спільні типи (5 файлів)
 * │   ├── orval-types.ts          # API типи з orval
 * │   ├── client-search.ts        # Критерії пошуку клієнтів
 * │   ├── order-summary.ts        # Підсумок замовлення
 * │   ├── receipt.ts              # Структура квитанції
 * │   └── validation.ts           # Обмеження валідації
 * │
 * ├── stage-1/          # 🧑 Етап 1: Клієнт та базова інформація (2 файли)
 * │   ├── client-selection.ts     # 1.1 Вибір/створення клієнта
 * │   └── order-basic-info.ts     # 1.2 Базова інформація замовлення
 * │
 * ├── stage-2/          # 📦 Етап 2: Менеджер предметів (6 файлів)
 * │   ├── items-manager-main.ts   # 2.0 Головний екран менеджера
 * │   ├── item-basic-info.ts      # 2.1 Основна інформація
 * │   ├── item-characteristics.ts # 2.2 Характеристики
 * │   ├── item-defects.ts         # 2.3 Забруднення та дефекти
 * │   ├── item-price-calculator.ts # 2.4 Калькулятор ціни
 * │   └── item-photo-documentation.ts # 2.5 Фотодокументація
 * │
 * ├── stage-3/          # ⚙️ Етап 3: Параметри замовлення (4 файли)
 * │   ├── execution-parameters.ts # 3.1 Параметри виконання
 * │   ├── global-discounts.ts     # 3.2 Глобальні знижки
 * │   ├── payment.ts              # 3.3 Оплата
 * │   └── additional-info.ts      # 3.4 Додаткова інформація
 * │
 * ├── stage-4/          # ✅ Етап 4: Підтвердження (4 файли)
 * │   ├── order-review.ts         # 4.1 Перегляд з розрахунками
 * │   ├── legal-aspects.ts        # 4.2 Юридичні аспекти
 * │   ├── receipt-generation.ts   # 4.3 Генерація квитанції
 * │   └── process-completion.ts   # 4.4 Завершення
 * │
 * └── all-steps-state.ts # 🎭 Композиція всіх станів та фабрика
 * ```
 *
 * ## 🔗 ІНТЕГРАЦІЯ З ORVAL
 *
 * ### Переваги orval типів:
 * - Автоматична генерація з OpenAPI/Swagger
 * - Синхронізація з бекендом
 * - Вбудована валідація через Zod
 * - Підтримка TypeScript типів
 *
 * ### Використання orval типів:
 * ```typescript
 * // ✅ ПРАВИЛЬНО: використання orval типів
 * import { ClientData, BranchData } from './shared/orval-types';
 *
 * // ❌ НЕПРАВИЛЬНО: створення власних дублікатів
 * interface MyClientData { ... }
 * ```
 *
 * ## 🏗️ АРХІТЕКТУРНІ ПРИНЦИПИ
 *
 * ### SRP (Single Responsibility Principle):
 * - Кожен файл відповідає за один крок або підкрок
 * - Максимум 102 рядки на файл (було 700+)
 *
 * ### OCP (Open/Closed Principle):
 * - Можна розширювати типи без зміни існуючих
 * - Композиція типів через all-steps-state.ts
 *
 * ### ISP (Interface Segregation Principle):
 * - Малі, специфічні інтерфейси замість великих
 * - Клієнти не залежать від непотрібних типів
 *
 * ## 🚀 ПРИКЛАДИ ВИКОРИСТАННЯ
 *
 * ### Імпорт типів для конкретного кроку:
 * ```typescript
 * import {
 *   ClientSelectionStepState,
 *   ClientSearchCriteria
 * } from '@/domain/wizard/types';
 * ```
 *
 * ### Композиція всіх станів:
 * ```typescript
 * import {
 *   AllStepsState,
 *   StepStateFactory
 * } from '@/domain/wizard/types';
 *
 * const initialState = StepStateFactory.createInitialState();
 * ```
 *
 * ### Валідація через orval схеми:
 * ```typescript
 * import { clientDataSchema } from '@/shared/api/generated';
 * import { safeValidate } from '@/shared/api/generated/zod';
 *
 * const validation = safeValidate(clientDataSchema, formData);
 * ```
 *
 * ## ⚠️ ВАЖЛИВІ ПРИМІТКИ
 *
 * - **Не дублюємо orval типи**: використовуємо готові з API
 * - **Композиція**: складні типи через all-steps-state.ts
 * - **Валідація**: orval схеми + Zod для runtime перевірок
 * - **Імпорти**: тільки через публічне API домену
 *
 * ================================================================================
 */

// ===================================
// 🌐 СПІЛЬНІ ТИПИ
// ===================================

// API типи з orval (ClientData, BranchData, OrderItemData, ExpediteType, DiscountType)
export * from './shared/orval-types';

// Критерії пошуку клієнтів
export * from './shared/client-search.types';

// Підсумок замовлення
export * from './shared/order-summary.types';

// Структура квитанції
export * from './shared/receipt.types';

// Обмеження валідації
export * from './shared/validation.types';

// ===================================
// 🧑 ЕТАП 1: КЛІЄНТ ТА БАЗОВА ІНФОРМАЦІЯ
// ===================================

// 1.1 Вибір або створення клієнта
export * from './stage-1/client-selection.types';

// 1.2 Базова інформація замовлення
export * from './stage-1/order-basic-info.types';

// ===================================
// 📦 ЕТАП 2: МЕНЕДЖЕР ПРЕДМЕТІВ
// ===================================

// 2.0 Головний екран менеджера предметів
export * from './stage-2/items-manager-main.types';

// 2.1 Основна інформація про предмет
export * from './stage-2/item-basic-info.types';

// 2.2 Характеристики предмета
export * from './stage-2/item-characteristics.types';

// 2.3 Забруднення, дефекти та ризики
export * from './stage-2/item-defects.types';

// 2.4 Калькулятор ціни з модифікаторами
export * from './stage-2/item-price-calculator.types';

// 2.5 Фотодокументація
export * from './stage-2/item-photo-documentation.types';

// ===================================
// ⚙️ ЕТАП 3: ПАРАМЕТРИ ЗАМОВЛЕННЯ
// ===================================

// 3.1 Параметри виконання
export * from './stage-3/execution-parameters.types';

// 3.2 Глобальні знижки
export * from './stage-3/global-discounts.types';

// 3.3 Оплата
export * from './stage-3/payment.types';

// 3.4 Додаткова інформація
export * from './stage-3/additional-info.types';

// ===================================
// ✅ ЕТАП 4: ПІДТВЕРДЖЕННЯ ТА ЗАВЕРШЕННЯ
// ===================================

// 4.1 Перегляд замовлення з детальним розрахунком
export * from './stage-4/order-review.types';

// 4.2 Юридичні аспекти
export * from './stage-4/legal-aspects.types';

// 4.3 Формування та друк квитанції
export * from './stage-4/receipt-generation.types';

// 4.4 Завершення процесу
export * from './stage-4/process-completion.types';

// ===================================
// 🎭 КОМПОЗИЦІЯ ВСІХ СТАНІВ
// ===================================

// Композитні типи та фабрика створення станів
export * from './all-steps-state.types';
