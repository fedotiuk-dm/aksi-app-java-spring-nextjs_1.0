/**
 * @fileoverview Wizard Stores - Zustand стани для Order Wizard домену
 * @module domain/wizard/store
 * @author AKSI Team
 * @since 1.0.0
 *
 * ================================================================================
 * 🗃️ ZUSTAND STORES - БІЗНЕС-СТАНИ WIZARD ДОМЕНУ
 * ================================================================================
 *
 * ## 🎯 РОЛЬ ZUSTAND В АРХІТЕКТУРІ
 *
 * Zustand відповідає за **БІЗНЕС-СТАН** wizard домену:
 * - Дані клієнтів та результати пошуку
 * - Замовлення та предмети в замовленні
 * - Навігаційні стани (поточний крок, можливість переходу)
 * - Тимчасові дані форм та кроків
 *
 * ## ✅ РЕФАКТОРИНГ ЗАВЕРШЕНО: SLICE STORES ПО ЕТАПАХ
 *
 * ### Структура нових slice stores:
 *
 * ```
 * store/
 * ├── base/                       # Базові стани
 * │   ├── wizard-base.store.ts    # Навігація, помилки, ініціалізація
 * │   └── index.ts
 * │
 * ├── stage-1/                    # Етап 1: Клієнт та базова інформація
 * │   ├── client-selection.store.ts   # Вибір/створення клієнта
 * │   ├── order-basic-info.store.ts   # Базова інформація замовлення (TODO)
 * │   └── index.ts
 * │
 * ├── stage-2/                    # Етап 2: Менеджер предметів
 * │   ├── items-manager.store.ts      # Колекція предметів + підвізард
 * │   ├── item-wizard.store.ts        # Конкретний підвізард предмета (TODO)
 * │   ├── price-calculator.store.ts   # Розрахунок цін предметів (TODO)
 * │   └── index.ts
 * │
 * ├── stage-3/                    # Етап 3: Загальні параметри
 * │   ├── execution-params.store.ts   # Дата виконання, терміновість
 * │   ├── discounts.store.ts          # Глобальні знижки
 * │   ├── payment.store.ts            # Оплата (TODO)
 * │   ├── additional-info.store.ts    # Додаткова інформація (TODO)
 * │   └── index.ts
 * │
 * ├── stage-4/                    # Етап 4: Підтвердження та завершення
 * │   ├── order-review.store.ts       # Перегляд, підпис, генерація квитанції
 * │   ├── receipt-generator.store.ts  # PDF генерація (TODO)
 * │   ├── legal-aspects.store.ts      # Юридичні аспекти (TODO)
 * │   └── index.ts
 * │
 * └── index.ts                    # Головний експорт (цей файл)
 * ```
 *
 * ## 🚨 ПЕРЕВАГИ SLICE STORES
 *
 * ### ✅ Дотримання SOLID принципів:
 * - **SRP**: Кожен store відповідає за свою область
 * - **OCP**: Легко додавати нові slice stores
 * - **ISP**: Малі, специфічні інтерфейси
 * - **DIP**: Залежність від абстракцій
 *
 * ### ✅ Поліпшена архітектура:
 * - Файли до 300 рядків (легко тестувати)
 * - Логічне групування відповідальностей
 * - Незалежні slice stores
 * - Краща масштабованість
 *
 * ### ✅ Продуктивність:
 * - Селективні підписки тільки на потрібні slice
 * - Менше ре-рендерів компонентів
 * - Кращий tree-shaking
 *
 * ## 🔗 ІНТЕГРАЦІЯ З ІНШИМИ БІБЛІОТЕКАМИ
 *
 * ### XState (Навігація):
 * ```typescript
 * // Синхронізація XState з базовим store
 * const { setCurrentStep, setCurrentSubStep } = useWizardBaseStore();
 * const actor = useActor(wizardMachine);
 *
 * useEffect(() => {
 *   setCurrentStep(actor.state.value);
 * }, [actor.state]);
 * ```
 *
 * ### TanStack Query (API):
 * ```typescript
 * // Інтеграція з API через хуки
 * const { setSearchResults, setSearching } = useClientSelectionStore();
 * const { data, isLoading } = useQuery({
 *   queryKey: ['clients', searchTerm],
 *   queryFn: () => searchClients(searchTerm),
 *   onSuccess: setSearchResults,
 *   onSettled: () => setSearching(false)
 * });
 * ```
 *
 * ### Orval типи:
 * ```typescript
 * // Строга типізація з автогенерованими типами
 * import type { ClientSearchResultItem, OrderItemData } from '../types';
 *
 * interface ClientSelectionState {
 *   selectedClient: ClientSearchResultItem | null;
 *   searchResults: ClientSearchResultItem[];
 * }
 * ```
 *
 * ## 🎯 КОМПОЗИЦІЯ STORES В ХУКАХ
 *
 * ### Приклад композиційного хука:
 * ```typescript
 * // hooks/use-wizard-composition.hook.ts
 * export const useWizardComposition = () => {
 *   const base = useWizardBaseStore();
 *   const clientSelection = useClientSelectionStore();
 *   const itemsManager = useItemsManagerStore();
 *   const executionParams = useExecutionParametersStore();
 *   const discounts = useDiscountsStore();
 *   const orderReview = useOrderReviewStore();
 *
 *   return {
 *     // Композиція методів з різних stores
 *     navigation: { ... },
 *     validation: { ... },
 *     calculation: { ... }
 *   };
 * };
 * ```
 *
 * ## 🧪 ТЕСТУВАННЯ SLICE STORES
 *
 * ### Переваги малих stores:
 * - Легше писати unit тести
 * - Ізольоване тестування логіки
 * - Менше mock залежностей
 * - Швидші тести
 *
 * ### Приклад тесту:
 * ```typescript
 * // client-selection.store.test.ts
 * describe('ClientSelectionStore', () => {
 *   it('should handle client selection', () => {
 *     const store = useClientSelectionStore.getState();
 *     const mockClient = { id: '1', name: 'Test Client' };
 *
 *     store.setSelectedClient(mockClient);
 *     expect(store.selectedClient).toEqual(mockClient);
 *   });
 * });
 * ```
 *
 * ## 📊 МОНІТОРИНГ ТА ДЕБАГІНГ
 *
 * ### Redux DevTools інтеграція:
 * - Кожен slice store має свою назву
 * - Чіткі action імена: 'clientSelection/setSelectedClient'
 * - Відстеження змін по етапах
 * - Легше дебагити проблеми
 *
 * ## 🎯 ПЛАН ПОДАЛЬШОГО РОЗВИТКУ
 *
 * ### ✅ TODO: Створити відсутні stores:
 * 1. ✅ **stage-1/order-basic-info.store.ts** - Базова інформація замовлення
 * 2. ✅ **stage-2/item-wizard.store.ts** - Детальний підвізард предмета
 * 3. ✅ **stage-2/price-calculator.store.ts** - Складні розрахунки цін
 * 4. ✅ **stage-3/payment.store.ts** - Оплата та фінансові розрахунки
 * 5. ✅ **stage-3/additional-info.store.ts** - Додаткова інформація
 * 6. ✅ **stage-4/receipt-generator.store.ts** - PDF генерація
 * 7. ✅ **stage-4/legal-aspects.store.ts** - Юридичні аспекти
 *
 * ### 🔧 TODO: Композиційні хуки:
 * - useWizardComposition - об'єднання всіх stores
 * - useWizardValidation - композиція валідації
 * - useWizardCalculation - композиція розрахунків
 * - useWizardPersistence - збереження стану
 *
 * ## ⚠️ ВАЖЛИВІ ПРИМІТКИ
 *
 * 1. **Ніколи не використовуйте stores напряму в UI компонентах**
 *    - Завжди через композиційні хуки в domain шарі
 *
 * 2. **Дотримуйтесь принципу Single Responsibility**
 *    - Кожен store має одну чітку відповідальність
 *
 * 3. **Використовуйте правильну архітектуру**
 *    - UI компоненти -> Domain хуки -> Zustand stores -> API
 *
 * 4. **Завжди типізуйте стани та дії**
 *    - Використовуйте Orval типи де можливо
 *
 * 5. **Дотримуйтесь naming convention**
 *    - Actions: 'storeName/actionName'
 *    - Файли: 'descriptive-name.store.ts'
 */

// ===== БАЗОВІ STORES =====
export * from './base';

// ===== ЕТАП 1: КЛІЄНТ ТА БАЗОВА ІНФОРМАЦІЯ =====
export * from './stage-1';

// ===== ЕТАП 2: МЕНЕДЖЕР ПРЕДМЕТІВ =====
export * from './stage-2';

// ===== ЕТАП 3: ЗАГАЛЬНІ ПАРАМЕТРИ =====
export * from './stage-3';

// ===== ЕТАП 4: ПІДТВЕРДЖЕННЯ ТА ЗАВЕРШЕННЯ =====
export * from './stage-4';

// ===== КОМПОЗИЦІЙНІ ТИПИ (для хуків) =====
export type WizardStores = {
  // Базові стани
  base: ReturnType<typeof import('./base').useWizardBaseStore>;

  // Етап 1: Клієнт та базова інформація
  clientSelection: ReturnType<typeof import('./stage-1').useClientSelectionStore>;
  orderBasicInfo: ReturnType<typeof import('./stage-1').useOrderBasicInfoStore>;

  // Етап 2: Менеджер предметів
  itemsManager: ReturnType<typeof import('./stage-2').useItemsManagerStore>;
  itemWizard: ReturnType<typeof import('./stage-2').useItemWizardStore>;
  priceCalculator: ReturnType<typeof import('./stage-2').usePriceCalculatorStore>;

  // Підетапи stage-2
  basicInfo: ReturnType<typeof import('./stage-2').useBasicInfoStore>;
  characteristics: ReturnType<typeof import('./stage-2').useCharacteristicsStore>;
  defectsStains: ReturnType<typeof import('./stage-2').useDefectsStainsStore>;
  photos: ReturnType<typeof import('./stage-2').usePhotosStore>;

  // Етап 3: Загальні параметри
  executionParams: ReturnType<typeof import('./stage-3').useExecutionParametersStore>;
  discounts: ReturnType<typeof import('./stage-3').useDiscountsStore>;
  payment: ReturnType<typeof import('./stage-3').usePaymentStore>;
  additionalInfo: ReturnType<typeof import('./stage-3').useAdditionalInfoStore>;

  // Етап 4: Підтвердження та завершення
  orderReview: ReturnType<typeof import('./stage-4').useOrderReviewStore>;
  receiptGenerator: ReturnType<typeof import('./stage-4').useReceiptGeneratorStore>;
  legalAspects: ReturnType<typeof import('./stage-4').useLegalAspectsStore>;
};
