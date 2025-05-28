/**
 * @fileoverview XState v5 Машини - Навігаційна логіка для Order Wizard
 * @module domain/wizard/machines
 * @author AKSI Team
 * @since 1.0.0
 *
 * ================================================================================
 * 🔄 XSTATE V5 MACHINES - НАВІГАЦІЯ ТА WORKFLOW WIZARD ДОМЕНУ
 * ================================================================================
 *
 * ## 🎯 РОЛЬ XSTATE В АРХІТЕКТУРІ
 *
 * XState відповідає за **ЛОГІКУ НАВІГАЦІЇ** та **WORKFLOW** wizard:
 * - Управління переходами між кроками
 * - Валідація можливості переходу
 * - Обробка складних сценаріїв (циклічні підкроки)
 * - Історія навігації та можливість повернення
 *
 * ## 🏗️ АРХІТЕКТУРНІ ПРИНЦИПИ
 *
 * ### Separation of Concerns:
 * ```typescript
 * // XState - ЛОГІКА навігації
 * const { goNext, canGoNext, currentStep } = useWizardNavigation();
 *
 * // Zustand - ДАНІ про стан
 * const { selectedClient, orderItems } = useWizardStore();
 *
 * // TanStack Query - API операції
 * const { saveOrder, isLoading } = useOrderMutations();
 * ```
 *
 * ### Predictable State Transitions:
 * - Чітко визначені стани та переходи
 * - Неможливість потрапити в невалідний стан
 * - Централізована логіка валідації переходів
 *
 * ### Event-Driven Architecture:
 * ```typescript
 * // Відправка подій до машини
 * send({ type: 'NEXT_STEP' });
 * send({ type: 'START_ITEM_WIZARD' });
 * send({ type: 'COMPLETE_ITEM', item: newItem });
 * ```
 *
 * ## 🎭 СТРУКТУРА WIZARD MACHINE
 *
 * ### Основні стани (16 кроків):
 * ```
 * wizard
 * ├── stage1
 * │   ├── clientSelection      # 1.1 Вибір/створення клієнта
 * │   └── orderBasicInfo      # 1.2 Базова інформація
 * ├── stage2
 * │   ├── itemsManager        # 2.0 Менеджер предметів
 * │   └── itemWizard          # 2.1-2.5 Підвізард предметів
 * │       ├── basicInfo       # 2.1 Основна інформація
 * │       ├── characteristics # 2.2 Характеристики
 * │       ├── defects         # 2.3 Дефекти та ризики
 * │       ├── priceCalculator # 2.4 Калькулятор ціни
 * │       └── photoDocumentation # 2.5 Фотодокументація
 * ├── stage3
 * │   ├── executionParameters # 3.1 Параметри виконання
 * │   ├── globalDiscounts     # 3.2 Глобальні знижки
 * │   ├── payment            # 3.3 Оплата
 * │   └── additionalInfo     # 3.4 Додаткова інформація
 * └── stage4
 *     ├── orderReview        # 4.1 Перегляд замовлення
 *     ├── legalAspects       # 4.2 Юридичні аспекти
 *     ├── receiptGeneration  # 4.3 Генерація квитанції
 *     └── processCompletion  # 4.4 Завершення
 * ```
 *
 * ### Циклічний підвізард предметів:
 * ```
 * itemWizard: {
 *   initial: 'basicInfo',
 *   states: {
 *     basicInfo: {
 *       on: { NEXT: 'characteristics' }
 *     },
 *     characteristics: {
 *       on: {
 *         NEXT: 'defects',
 *         PREV: 'basicInfo'
 *       }
 *     },
 *     // ... інші кроки
 *     photoDocumentation: {
 *       on: {
 *         COMPLETE_ITEM: { target: '#itemsManager' }, // повернення
 *         PREV: 'priceCalculator'
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * ## 🔧 ІНТЕГРАЦІЯ З ІНШИМИ БІБЛІОТЕКАМИ
 *
 * ### Zustand (Стани даних):
 * ```typescript
 * // XState керує КОЛИ переходити
 * const canGoNext = context.selectedClient !== null;
 *
 * // Zustand зберігає ЩО вибрано
 * const selectedClient = useWizardStore(state => state.selectedClient);
 * ```
 *
 * ### TanStack Query (API операції):
 * ```typescript
 * // XState визначає КОЛИ викликати API
 * onEntry: [
 *   () => {
 *     if (shouldSaveOrder) {
 *       saveOrderMutation.mutate(orderData);
 *     }
 *   }
 * ]
 * ```
 *
 * ### Orval + Zod (Валідація):
 * ```typescript
 * // XState використовує валідацію для переходів
 * guards: {
 *   canProceedToPayment: (context) => {
 *     const validation = safeValidate(orderSchema, context.orderData);
 *     return validation.success;
 *   }
 * }
 * ```
 *
 * ## 🚀 ПРИКЛАДИ ВИКОРИСТАННЯ
 *
 * ### Базова навігація:
 * ```typescript
 * import { useWizardNavigation } from '@/domain/wizard';
 *
 * const WizardComponent = () => {
 *   const {
 *     currentStep,
 *     goNext,
 *     goPrev,
 *     canGoNext,
 *     canGoPrev
 *   } = useWizardNavigation();
 *
 *   return (
 *     <div>
 *       <h2>Поточний крок: {currentStep}</h2>
 *       <button onClick={goPrev} disabled={!canGoPrev}>
 *         Назад
 *       </button>
 *       <button onClick={goNext} disabled={!canGoNext}>
 *         Далі
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 *
 * ### Циклічний підвізард:
 * ```typescript
 * const ItemWizardComponent = () => {
 *   const {
 *     startItemWizard,
 *     completeItem,
 *     isInItemWizard
 *   } = useWizardNavigation();
 *
 *   const handleAddItem = () => {
 *     startItemWizard(); // перехід в підвізард
 *   };
 *
 *   const handleCompleteItem = (item) => {
 *     completeItem(item); // додавання предмета та повернення
 *   };
 *
 *   return (
 *     <div>
 *       {!isInItemWizard ? (
 *         <button onClick={handleAddItem}>
 *           Додати предмет
 *         </button>
 *       ) : (
 *         <ItemSubWizard onComplete={handleCompleteItem} />
 *       )}
 *     </div>
 *   );
 * };
 * ```
 *
 * ### Умовні переходи:
 * ```typescript
 * const PaymentStep = () => {
 *   const { goNext, canGoNext } = useWizardNavigation();
 *   const { orderTotal, paymentData } = useWizardStore();
 *
 *   // canGoNext автоматично обчислюється машиною
 *   // на основі валідації paymentData та orderTotal
 *
 *   return (
 *     <div>
 *       <PaymentForm />
 *       <button onClick={goNext} disabled={!canGoNext}>
 *         {orderTotal > 0 ? 'Перейти до підтвердження' : 'Пропустити оплату'}
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 *
 * ## ⚠️ ВАЖЛИВІ ПРИМІТКИ
 *
 * - **Детермінованість**: XState гарантує передбачуваність навігації
 * - **Валідація переходів**: неможливо перейти в невалідний стан
 * - **Історія**: автоматичне збереження історії переходів
 * - **Тестування**: легко тестувати через відправку подій
 * - **Візуалізація**: можна генерувати діаграми станів
 * - **Персистентність**: стан машини можна серіалізувати та відновлювати
 *
 * ## 📊 МОНІТОРИНГ ТА ДЕБАГІНГ
 *
 * ```typescript
 * // Використання з Redux DevTools
 * import { inspect } from '@xstate/inspect';
 *
 * if (process.env.NODE_ENV === 'development') {
 *   inspect({
 *     url: 'https://stately.ai/viz?inspect',
 *     iframe: false
 *   });
 * }
 * ```
 *
 * ================================================================================
 */

// === ОСНОВНА XSTATE V5 МАШИНА ===
export { wizardMachine, type WizardMachine } from './wizard-machine';

// === НАВІГАЦІЙНИЙ СЕРВІС ===
export { WizardNavigationService, type NavigationResult } from './wizard-navigation.service';

// === XSTATE СПЕЦИФІЧНІ ТИПИ ===
export {
  type WizardMachineContext, // XState контекст машини
  type WizardMachineEvent, // XState події для машини
  type NavigationDirection, // Helper тип 'next' | 'prev'
  type WizardProgress, // Інтерфейс прогресу
} from './machine-types';
