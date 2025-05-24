/**
 * @fileoverview Інтерфейси стану для Order Wizard - типізація для Zustand stores та XState context
 * @module domain/wizard/shared/types/state
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Повний набір інтерфейсів для типізації стану Order Wizard на всіх рівнях:
 * - XState context для state machine
 * - Zustand stores для доменної логіки кроків
 * - Навігаційні стани для UI компонентів
 * - Валідаційні стани для кожного кроку
 * - Селектори для оптимізованого доступу до даних
 *
 * Архітектурні принципи:
 * - Immutability: всі стани незмінні
 * - Composability: базові інтерфейси + спеціалізовані розширення
 * - Type Safety: строга типізація всіх властивостей
 * - Separation of Concerns: розділення стану по модулях
 *
 * @example
 * // Використання в Zustand store
 * import { create } from 'zustand';
 * import { ClientStepState } from '@/domain/wizard/shared/types';
 *
 * const useClientStore = create<ClientStepState>((set) => ({
 *   selectedClientId: null,
 *   isValid: false,
 *   // ... інші властивості
 * }));
 *
 * @example
 * // Використання в XState context
 * const wizardMachine = createMachine({
 *   context: {} as WizardMachineContext,
 *   // ... конфігурація машини
 * });
 *
 * @see {@link ./wizard-common.types} - Базові типи wizard
 * @see {@link ./wizard-events.types} - Події wizard
 */

import {
  WizardStep,
  ItemWizardStep,
  WizardStepState,
  WizardContext,
  SaveState,
} from './wizard-common.types';

/**
 * XState контекст для головної wizard машини
 *
 * @interface WizardMachineContext
 * @description
 * Immutable контекст який зберігається в XState машині wizard.
 * Містить глобальну інформацію про стан всього wizard процесу.
 *
 * @property {WizardStep} currentStep - Поточний активний крок wizard
 * @property {ItemWizardStep} [currentItemStep] - Поточний підкрок Item Wizard (якщо активний)
 * @property {WizardContext} context - Метадані та налаштування wizard
 * @property {number} progress - Прогрес виконання wizard (0-100%)
 * @property {boolean} canProceed - Чи можна переходити до наступного кроку
 * @property {string[]} errors - Критичні помилки що блокують прогрес
 * @property {string[]} warnings - Попередження що не блокують прогрес
 *
 * @example
 * // Оновлення контексту через assign
 * const updateContext = assign<WizardMachineContext>({
 *   currentStep: WizardStep.ORDER_PARAMETERS,
 *   progress: (context) => context.progress + 20
 * });
 *
 * @since 1.0.0
 */
export interface WizardMachineContext {
  currentStep: WizardStep;
  currentItemStep?: ItemWizardStep;
  context: WizardContext;
  progress: number;
  canProceed: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Стан навігації основних кроків wizard
 *
 * @interface NavigationState
 * @description
 * Управління навігацією між основними кроками Order Wizard.
 * Відстежує прогрес, доступні переходи та валідацію кроків.
 *
 * @property {WizardStep} currentStep - Поточний активний крок
 * @property {WizardStep[]} availableSteps - Кроки доступні для переходу
 * @property {WizardStep[]} completedSteps - Завершені кроки
 * @property {boolean} canGoNext - Чи можна переходити до наступного кроку
 * @property {boolean} canGoPrev - Чи можна повертатися до попереднього кроку
 * @property {number} progress - Прогрес виконання wizard (0-100%)
 *
 * @example
 * const navigationState: NavigationState = {
 *   currentStep: WizardStep.CLIENT_SELECTION,
 *   availableSteps: [WizardStep.CLIENT_SELECTION, WizardStep.BRANCH_SELECTION],
 *   completedSteps: [],
 *   canGoNext: false,
 *   canGoPrev: false,
 *   progress: 0
 * };
 *
 * @since 1.0.0
 */
export interface NavigationState {
  currentStep: WizardStep;
  availableSteps: WizardStep[];
  completedSteps: WizardStep[];
  canGoNext: boolean;
  canGoPrev: boolean;
  progress: number;
}

/**
 * Стан навігації Item Wizard (підвізард)
 *
 * @interface ItemWizardNavigationState
 * @description
 * Управління навігацією в рамках циклічного Item Wizard процесу.
 * Відстежує активність підвізарда та прогрес додавання предмета.
 *
 * @property {boolean} isActive - Чи активний Item Wizard зараз
 * @property {ItemWizardStep} currentStep - Поточний підкрок Item Wizard
 * @property {ItemWizardStep[]} completedSteps - Завершені підкроки
 * @property {boolean} canGoNext - Чи можна переходити до наступного підкроку
 * @property {boolean} canGoPrev - Чи можна повертатися до попереднього підкроку
 * @property {number} progress - Прогрес додавання предмета (0-100%)
 *
 * @example
 * // Активний Item Wizard на кроці характеристик
 * const itemNavState: ItemWizardNavigationState = {
 *   isActive: true,
 *   currentStep: ItemWizardStep.ITEM_PROPERTIES,
 *   completedSteps: [ItemWizardStep.ITEM_BASIC_INFO],
 *   canGoNext: true,
 *   canGoPrev: true,
 *   progress: 40
 * };
 *
 * @since 1.0.0
 */
export interface ItemWizardNavigationState {
  isActive: boolean;
  currentStep: ItemWizardStep;
  completedSteps: ItemWizardStep[];
  canGoNext: boolean;
  canGoPrev: boolean;
  progress: number;
}

/**
 * Загальний глобальний стан wizard
 *
 * @interface WizardGlobalState
 * @description
 * Центральний стан який об'єднує всі аспекти wizard: навігацію, валідацію,
 * збереження та помилки. Використовується для координації між модулями.
 *
 * @property {boolean} isInitialized - Чи ініціалізований wizard
 * @property {boolean} isLoading - Чи виконується завантаження даних
 * @property {NavigationState} navigation - Стан навігації основних кроків
 * @property {ItemWizardNavigationState} itemWizardNavigation - Стан навігації Item Wizard
 * @property {WizardContext} context - Контекст та метадані wizard
 * @property {Record<WizardStep, WizardStepState>} stepValidations - Валідація кожного кроку
 * @property {Record<ItemWizardStep, WizardStepState>} itemStepValidations - Валідація підкроків
 * @property {SaveState} saveState - Стан збереження та автозбереження
 * @property {boolean} hasErrors - Чи є критичні помилки
 * @property {string | null} lastError - Остання помилка
 *
 * @example
 * // Перевірка готовності wizard
 * if (globalState.isInitialized && !globalState.hasErrors) {
 *   console.log('Wizard готовий до роботи');
 * }
 *
 * @since 1.0.0
 */
export interface WizardGlobalState {
  // Ініціалізація
  isInitialized: boolean;
  isLoading: boolean;

  // Навігація
  navigation: NavigationState;
  itemWizardNavigation: ItemWizardNavigationState;

  // Контекст та метадані
  context: WizardContext;

  // Валідація
  stepValidations: Record<WizardStep, WizardStepState>;
  itemStepValidations: Record<ItemWizardStep, WizardStepState>;

  // Збереження
  saveState: SaveState;

  // Помилки та стан
  hasErrors: boolean;
  lastError: string | null;
}

/**
 * Стан кроку вибору/створення клієнта
 *
 * @interface ClientStepState
 * @extends WizardStepState
 * @description
 * Стан першого кроку wizard - вибір існуючого клієнта або створення нового.
 * Включає функціональність пошуку та управління формою нового клієнта.
 *
 * @property {string | null} selectedClientId - ID обраного клієнта
 * @property {boolean} isNewClient - Чи створюємо нового клієнта
 * @property {string} searchTerm - Поточний пошуковий запит
 * @property {ClientSearchResult[]} searchResults - Результати пошуку клієнтів
 * @property {boolean} isSearching - Чи виконується пошук
 *
 * @example
 * // Стан при пошуку клієнта
 * const clientState: ClientStepState = {
 *   selectedClientId: null,
 *   isNewClient: false,
 *   searchTerm: 'Іванов',
 *   searchResults: [{ id: '1', firstName: 'Іван', lastName: 'Іванов', phone: '+380...' }],
 *   isSearching: false,
 *   isValid: false,
 *   isComplete: false,
 *   validationStatus: ValidationStatus.NOT_VALIDATED,
 *   errors: [],
 *   lastValidated: null
 * };
 *
 * @since 1.0.0
 */
export interface ClientStepState extends WizardStepState {
  selectedClientId: string | null;
  isNewClient: boolean;
  searchTerm: string;
  searchResults: ClientSearchResult[];
  isSearching: boolean;
}

/**
 * Стан кроку вибору філії
 *
 * @interface BranchSelectionState
 * @extends WizardStepState
 * @description
 * Стан другого кроку wizard - вибір філії для замовлення.
 * Після вибору філії ініціюється створення замовлення на бекенді.
 *
 * @property {Branch[]} branches - Список доступних філій
 * @property {string | null} selectedBranchId - ID обраної філії
 * @property {boolean} isLoading - Чи завантажується список філій
 * @property {boolean} orderInitiated - Чи ініційовано замовлення на бекенді
 *
 * @example
 * // Стан після завантаження філій
 * const branchState: BranchSelectionState = {
 *   branches: [
 *     { id: '1', name: 'Філія центр', address: 'вул. Центральна, 1', isActive: true }
 *   ],
 *   selectedBranchId: null,
 *   isLoading: false,
 *   orderInitiated: false,
 *   isValid: false,
 *   isComplete: false,
 *   validationStatus: ValidationStatus.NOT_VALIDATED,
 *   errors: [],
 *   lastValidated: null
 * };
 *
 * @since 1.0.0
 */
export interface BranchSelectionState extends WizardStepState {
  branches: Branch[];
  selectedBranchId: string | null;
  isLoading: boolean;
  orderInitiated: boolean;
}

/**
 * Стан менеджера предметів замовлення
 *
 * @interface ItemsManagerState
 * @extends WizardStepState
 * @description
 * Стан третього кроку wizard - управління списком предметів замовлення.
 * Координує роботу з Item Wizard та відстежує загальну вартість.
 *
 * @property {OrderItem[]} itemsList - Список доданих предметів
 * @property {number} totalAmount - Загальна вартість замовлення
 * @property {boolean} isItemWizardActive - Чи активний підвізард додавання предмета
 * @property {string | null} editingItemId - ID предмета що редагується
 * @property {OrderItem | null} currentItemData - Дані поточного предмета в Item Wizard
 *
 * @example
 * // Стан з доданими предметами
 * const itemsState: ItemsManagerState = {
 *   itemsList: [
 *     { id: '1', name: 'Піджак', category: 'cleaning', quantity: 1, price: 150 }
 *   ],
 *   totalAmount: 150,
 *   isItemWizardActive: false,
 *   editingItemId: null,
 *   currentItemData: null,
 *   isValid: true,
 *   isComplete: true,
 *   validationStatus: ValidationStatus.VALID,
 *   errors: [],
 *   lastValidated: new Date()
 * };
 *
 * @since 1.0.0
 */
export interface ItemsManagerState extends WizardStepState {
  itemsList: OrderItem[];
  totalAmount: number;
  isItemWizardActive: boolean;
  editingItemId: string | null;
  currentItemData: OrderItem | null;
}

/**
 * Стан параметрів замовлення
 *
 * @interface OrderParametersState
 * @extends WizardStepState
 * @description
 * Стан четвертого кроку wizard - налаштування параметрів замовлення:
 * дати виконання, терміновості, знижок та оплати.
 *
 * @property {Date | null} executionDate - Дата виконання замовлення
 * @property {'normal' | 'urgent_48h' | 'urgent_24h'} urgencyType - Тип терміновості
 * @property {'none' | 'evercard' | 'social' | 'military' | 'other'} discountType - Тип знижки
 * @property {'terminal' | 'cash' | 'account'} paymentMethod - Спосіб оплати
 * @property {number} totalAmount - Загальна вартість з урахуванням модифікаторів
 * @property {number} paidAmount - Сплачена сума (передоплата)
 * @property {number} remainingAmount - Залишок до сплати
 *
 * @example
 * // Стан з налаштованими параметрами
 * const paramsState: OrderParametersState = {
 *   executionDate: new Date('2024-01-15'),
 *   urgencyType: 'normal',
 *   discountType: 'evercard',
 *   paymentMethod: 'terminal',
 *   totalAmount: 135, // 150 - 10% знижка еверкард
 *   paidAmount: 135,
 *   remainingAmount: 0,
 *   isValid: true,
 *   isComplete: true,
 *   validationStatus: ValidationStatus.VALID,
 *   errors: [],
 *   lastValidated: new Date()
 * };
 *
 * @since 1.0.0
 */
export interface OrderParametersState extends WizardStepState {
  executionDate: Date | null;
  urgencyType: 'normal' | 'urgent_48h' | 'urgent_24h';
  discountType: 'none' | 'evercard' | 'social' | 'military' | 'other';
  paymentMethod: 'terminal' | 'cash' | 'account';
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
}

/**
 * Стан підтвердження та завершення замовлення
 *
 * @interface OrderConfirmationState
 * @extends WizardStepState
 * @description
 * Стан п'ятого (останнього) кроку wizard - підтвердження замовлення,
 * збір підпису клієнта та генерація квитанції.
 *
 * @property {OrderSummary} orderSummary - Повний підсумок замовлення
 * @property {boolean} termsAccepted - Чи прийняті умови надання послуг
 * @property {string | null} signatureData - Дані цифрового підпису клієнта
 * @property {boolean} receiptGenerated - Чи згенерована квитанція
 * @property {boolean} isCompleting - Чи виконується завершення замовлення
 *
 * @example
 * // Стан готовий до завершення
 * const confirmState: OrderConfirmationState = {
 *   orderSummary: {
 *     orderId: 'ORD-2024-001',
 *     items: [...],
 *     totalAmount: 135,
 *     clientInfo: { ... }
 *   },
 *   termsAccepted: true,
 *   signatureData: 'base64_signature_data',
 *   receiptGenerated: false,
 *   isCompleting: false,
 *   isValid: true,
 *   isComplete: true,
 *   validationStatus: ValidationStatus.VALID,
 *   errors: [],
 *   lastValidated: new Date()
 * };
 *
 * @since 1.0.0
 */
export interface OrderConfirmationState extends WizardStepState {
  orderSummary: OrderSummary;
  termsAccepted: boolean;
  signatureData: string | null;
  receiptGenerated: boolean;
  isCompleting: boolean;
}

/**
 * @section Тимчасові типи для доменних сутностей
 * @description
 * Ці типи будуть замінені на типи з відповідних доменів після їх повної реалізації.
 * Зараз використовуються для розробки та тестування wizard функціональності.
 */

/**
 * Результат пошуку клієнта (тимчасовий тип)
 *
 * @interface ClientSearchResult
 * @description
 * Спрощений тип для результатів пошуку клієнтів.
 * Буде замінений на повний тип з domain/client після реалізації.
 *
 * @property {string} id - Унікальний ідентифікатор клієнта
 * @property {string} firstName - Ім'я клієнта
 * @property {string} lastName - Прізвище клієнта
 * @property {string} phone - Номер телефону клієнта
 * @property {string} [email] - Email адреса клієнта (необов'язково)
 *
 * @todo Замінити на Client з domain/client
 * @since 1.0.0
 */
export interface ClientSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

/**
 * Філія хімчистки (тимчасовий тип)
 *
 * @interface Branch
 * @description
 * Спрощений тип для філій хімчистки.
 * Буде замінений на повний тип з domain/branch після реалізації.
 *
 * @property {string} id - Унікальний ідентифікатор філії
 * @property {string} name - Назва філії
 * @property {string} address - Адреса філії
 * @property {boolean} isActive - Чи активна філія для прийому замовлень
 *
 * @todo Замінити на Branch з domain/branch
 * @since 1.0.0
 */
export interface Branch {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
}

/**
 * Предмет замовлення (тимчасовий тип)
 *
 * @interface OrderItem
 * @description
 * Спрощений тип для предметів замовлення.
 * Буде замінений на повний тип з domain/order після реалізації.
 *
 * @property {string} id - Унікальний ідентифікатор предмета
 * @property {string} name - Назва предмета
 * @property {string} category - Категорія послуги
 * @property {number} quantity - Кількість (штуки або кілограми)
 * @property {number} price - Ціна за предмет
 *
 * @todo Замінити на OrderItem з domain/order
 * @since 1.0.0
 */
export interface OrderItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  // інші властивості предмета
}

/**
 * Підсумок замовлення (тимчасовий тип)
 *
 * @interface OrderSummary
 * @description
 * Спрощений тип для підсумку замовлення.
 * Буде замінений на повний тип з domain/order після реалізації.
 *
 * @property {string} orderId - Унікальний ідентифікатор замовлення
 * @property {OrderItem[]} items - Список предметів замовлення
 * @property {number} totalAmount - Загальна вартість замовлення
 * @property {ClientSearchResult} clientInfo - Інформація про клієнта
 *
 * @todo Замінити на OrderSummary з domain/order
 * @since 1.0.0
 */
export interface OrderSummary {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  clientInfo: ClientSearchResult;
  // інші властивості підсумку замовлення
}

/**
 * Об'єднаний стан всіх кроків wizard
 *
 * @interface AllStepsState
 * @description
 * Композитний інтерфейс який об'єднує стани всіх кроків wizard.
 * Використовується для типізації глобального стану та селекторів.
 *
 * @property {ClientStepState} clientStep - Стан кроку вибору клієнта
 * @property {BranchSelectionState} branchSelection - Стан кроку вибору філії
 * @property {ItemsManagerState} itemsManager - Стан менеджера предметів
 * @property {OrderParametersState} orderParameters - Стан параметрів замовлення
 * @property {OrderConfirmationState} orderConfirmation - Стан підтвердження
 *
 * @example
 * // Доступ до стану конкретного кроку
 * const clientState = allStepsState.clientStep;
 * const isClientValid = clientState.isValid;
 *
 * @since 1.0.0
 */
export interface AllStepsState {
  clientStep: ClientStepState;
  branchSelection: BranchSelectionState;
  itemsManager: ItemsManagerState;
  orderParameters: OrderParametersState;
  orderConfirmation: OrderConfirmationState;
}

/**
 * Селектори для оптимізованого доступу до стану wizard
 *
 * @interface WizardSelectors
 * @description
 * Набір селекторів для ефективного доступу до різних аспектів стану wizard.
 * Забезпечує мемоізацію обчислень та запобігає непотрібним ре-рендерам.
 *
 * @property {() => WizardStep} getCurrentStep - Отримати поточний крок wizard
 * @property {(step: WizardStep) => WizardStepState} getStepValidation - Отримати валідацію кроку
 * @property {() => number} getProgress - Отримати загальний прогрес wizard
 * @property {() => boolean} canProceedToNext - Чи можна переходити до наступного кроку
 * @property {() => WizardStep[]} getCompletedSteps - Отримати список завершених кроків
 * @property {() => boolean} hasUnsavedChanges - Чи є незбережені зміни
 *
 * @example
 * // Використання селекторів в компонентах
 * const currentStep = selectors.getCurrentStep();
 * const canProceed = selectors.canProceedToNext();
 * const progress = selectors.getProgress();
 *
 * @example
 * // Мемоізований селектор для React
 * const progress = useMemo(() => selectors.getProgress(), [selectors]);
 *
 * @since 1.0.0
 */
export interface WizardSelectors {
  getCurrentStep: () => WizardStep;
  getStepValidation: (step: WizardStep) => WizardStepState;
  getProgress: () => number;
  canProceedToNext: () => boolean;
  getCompletedSteps: () => WizardStep[];
  hasUnsavedChanges: () => boolean;
}
