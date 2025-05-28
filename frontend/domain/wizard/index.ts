/**
 * @fileoverview Wizard Domain - Повна доменна логіка для Order Wizard системи хімчистки
 * @module domain/wizard
 * @author AKSI Team
 * @since 1.0.0
 *
 * ================================================================================
 * 🧙‍♂️ WIZARD DOMAIN - АРХІТЕКТУРА "DDD INSIDE, FSD OUTSIDE"
 * ================================================================================
 *
 * ## 📋 ОГЛЯД ДОМЕНУ
 *
 * Order Wizard - це покроковий інтерфейс для оформлення замовлень у хімчистці:
 * - 4 основні етапи з 16 детальними підкроками
 * - Повна інтеграція Zustand + XState + TanStack Query + Orval + Zod
 * - Архітектура "каскадного візарда" для циклічного додавання предметів
 * - Система розрахунку цін з прозорою деталізацією
 *
 * ## 🏗️ АРХІТЕКТУРНІ ПРИНЦИПИ
 *
 * ### DDD (Domain-Driven Design) INSIDE:
 * - Вся бізнес-логіка в доменному шарі
 * - Чітке розділення відповідальностей між сервісами
 * - Типізовані контракти між компонентами
 * - Orval + Zod для валідації API даних
 *
 * ### FSD (Feature-Sliced Design) OUTSIDE:
 * - UI компоненти максимально "тонкі"
 * - Отримують дані та обробники з доменних хуків
 * - Не містять бізнес-логіки або стану
 *
 * ## 🔧 ІНТЕГРАЦІЯ БІБЛІОТЕК
 *
 * ### 🗃️ ZUSTAND - Бізнес-стан
 * ```typescript
 * import { useWizardStore } from '@/domain/wizard';
 *
 * const {
 *   selectedClient,
 *   orderItems,
 *   setSelectedClient
 * } = useWizardStore();
 * ```
 *
 * ### 🔄 XSTATE v5 - Навігація та Workflow
 * ```typescript
 * import { useWizardNavigation } from '@/domain/wizard';
 *
 * const {
 *   currentStep,
 *   goNext,
 *   goPrev,
 *   startItemWizard
 * } = useWizardNavigation();
 * ```
 *
 * ### 🌐 TANSTACK QUERY - API операції
 * ```typescript
 * import { useClientApiOperations } from '@/domain/wizard';
 *
 * const {
 *   searchClients,
 *   createClient,
 *   isSearching
 * } = useClientApiOperations();
 * ```
 *
 * ### ✅ ZOD + ORVAL - Валідація та API типи
 * ```typescript
 * import { clientSchema, safeValidate } from '@/domain/wizard';
 *
 * const validation = safeValidate(clientSchema, formData);
 * ```
 *
 * ## 📁 СТРУКТУРА ДОМЕНУ
 *
 * ```
 * wizard/
 * ├── types/           # 📋 Типи (21 файл, розбито по етапах)
 * ├── hooks/           # 🪝 React хуки (композиція бізнес-логіки)
 * ├── services/        # 🔧 Бізнес-сервіси (валідація, розрахунки)
 * ├── stores/          # 🗃️ Zustand стани (бізнес-дані)
 * ├── machines/        # 🔄 XState машини (навігація)
 * ├── schemas/         # ✅ Zod схеми (валідація)
 * ├── constants/       # 📊 Константи та конфігурація
 * └── utils/           # 🛠️ Утиліти
 * ```
 *
 * ## 🎯 ЕТАПИ WIZARD
 *
 * ### Етап 1: Клієнт та базова інформація (2 кроки)
 * - 1.1 Вибір/створення клієнта
 * - 1.2 Базова інформація замовлення
 *
 * ### Етап 2: Менеджер предметів (6 кроків)
 * - 2.0 Головний екран менеджера
 * - 2.1-2.5 Підкроки додавання предмета
 *
 * ### Етап 3: Параметри замовлення (4 кроки)
 * - 3.1 Параметри виконання
 * - 3.2 Глобальні знижки
 * - 3.3 Оплата
 * - 3.4 Додаткова інформація
 *
 * ### Етап 4: Підтвердження (4 кроки)
 * - 4.1 Перегляд з розрахунками
 * - 4.2 Юридичні аспекти
 * - 4.3 Генерація квитанції
 * - 4.4 Завершення процесу
 *
 * ## 🚀 ПРИКЛАД ВИКОРИСТАННЯ
 *
 * ```tsx
 * 'use client';
 *
 * import {
 *   useWizardNavigation,
 *   useClientSearch,
 *   WizardStep
 * } from '@/domain/wizard';
 *
 * export const OrderWizardPage = () => {
 *   const { currentStep, goNext, canGoNext } = useWizardNavigation();
 *   const { searchClients, results, isSearching } = useClientSearch();
 *
 *   return (
 *     <div>
 *       <h1>Order Wizard - {currentStep}</h1>
 *       {currentStep === WizardStep.CLIENT_SELECTION && (
 *         <ClientSelectionStep
 *           onSearch={searchClients}
 *           results={results}
 *           isSearching={isSearching}
 *         />
 *       )}
 *       <button onClick={goNext} disabled={!canGoNext}>
 *         Далі
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 *
 * ## ⚠️ ВАЖЛИВІ ПРИМІТКИ
 *
 * - **API типи**: Беруться з orval схем, не створюємо власні дублікати
 * - **Валідація**: Використовуємо orval `safeValidate` та `validateOrThrow`
 * - **Імпорти**: Тільки через публічне API домену (цей індекс)
 * - **Стан**: Zustand для бізнес-даних, XState для навігації
 * - **Помилки**: Централізована обробка в базових хуках
 *
 * ================================================================================
 */

/**
 * Публічне API для wizard домену
 * Експорт всіх компонентів згідно з архітектурою "DDD inside, FSD outside"
 *
 * ВАЖЛИВО: Прості імпорти до конкретних файлів для кращого контролю
 */

// === ТИПИ ТА ЕНУМИ ===
export * from './types';

// === УТИЛІТИ ===
export * from './utils';

// === ZOD СХЕМИ ВАЛІДАЦІЇ ===
export * from './schemas';

// === КОНСТАНТИ ===
export * from './constants';

// === XSTATE V5 МАШИНИ ===
export type { NavigationResult as XStateNavigationResult } from './machines';

// === СЕРВІСИ (BUSINESS LOGIC) ===
// Експортуємо основні сервіси без конфліктних типів
export { OrderValidationService, PricingCalculationService } from './services';

// === HOOKS (DOMAIN LOGIC) ===
export * from './hooks';

// === ZUSTAND STORES ===
// Експортуємо hooks для stores через hooks, не напряму
