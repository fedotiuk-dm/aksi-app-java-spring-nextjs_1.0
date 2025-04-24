/**
 * Типи, специфічні для UI-частини OrderWizard
 * Використовують OpenAPI типи як основу, але розширюють їх для потреб візарда
 */
import type { ClientDTO, OrderCreateRequest, OrderItemDto } from '@/lib/api';

// Головні стани візарда
export type WizardState =
  | 'clientSelection'  // Вибір клієнта
  | 'basicInfo'        // Основна інформація
  | 'itemManagement'   // Управління предметами
  | 'orderParams'      // Параметри замовлення
  | 'billing'          // Оплата
  | 'complete';        // Завершення

// Підстани для деяких головних станів
export type ClientSelectionSubState = 'search' | 'create';
export type ItemManagementSubState = 'itemList' | 'itemWizard';

// Підстани для візарда предметів
export type ItemWizardSubState =
  | 'idle'             // Початковий стан (менеджер предметів)
  | 'itemBasic'        // Базова інформація про предмет
  | 'itemProperties'   // Властивості предмета
  | 'itemPrice'        // Ціна предмета
  | 'defects'          // Дефекти та забруднення
  | 'pricing'          // Розрахунок ціни
  | 'photos'           // Фотографії
  | 'summary';         // Підсумок інформації про предмет

// Дозволені переходи для кожного стану
export const allowedTransitions: Record<WizardState, WizardState[]> = {
  clientSelection: ['basicInfo'],
  basicInfo: ['clientSelection', 'itemManagement'],
  itemManagement: ['basicInfo', 'orderParams'],
  orderParams: ['itemManagement', 'billing'],
  billing: ['orderParams', 'complete'],
  complete: ['clientSelection'] // Для нового замовлення
};

/**
 * Розширення OrderItemDto для потреб UI
 */
export interface OrderItemUI extends Partial<OrderItemDto> {
  // Додаткові поля для UI, що не входять до стандартного OrderItemDto
  localId?: string;             // Локальний ID для нових предметів
  priceListItemId?: string;     // ID елемента з прайс-листа
  isValid?: boolean;            // Прапорець валідності
  validationErrors?: Record<string, string>; // Помилки валідації
  finalPrice?: number;          // Підсумкова ціна з урахуванням знижок
  
  // Поля, які використовуються у формах та конвертерах
  name?: string;               // Назва предмета
  categoryId?: string;         // ID категорії
  quantity?: number;           // Кількість
  unitOfMeasurement?: string;  // Одиниця виміру
  defectNotes?: string;        // Примітки про дефекти
}

/**
 * Розширення ClientDTO для потреб UI
 */
export interface ClientUI extends ClientDTO {
  isSelected?: boolean;
  fullName?: string;
}

/**
 * Контекст, який зберігається в Zustand store
 */
export interface OrderWizardContext {
  client?: ClientUI;
  orderData: Partial<OrderCreateRequest>;
  items: OrderItemUI[];
  currentItem?: OrderItemUI;
  itemWizardState: ItemWizardSubState;
  itemWizardHistory: ItemWizardSubState[];
  // Додаткові поля для відстеження змін
  formIsDirty?: boolean;
  validationErrors?: Record<string, string>;
}

/**
 * Типи подій, які може обробляти state machine
 */
export type WizardEvent =
  // Навігаційні події
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'RESET' }
  | { type: 'GO_TO_STATE'; state: WizardState }

  // Клієнт
  | { type: 'SELECT_CLIENT'; client: ClientDTO }
  | { type: 'CREATE_CLIENT'; client: ClientDTO }
  | { type: 'TOGGLE_CLIENT_FORM_MODE'; mode: ClientSelectionSubState }

  // Базова інформація
  | { type: 'SAVE_BASIC_INFO'; data: Partial<OrderCreateRequest> }

  // Предмети
  | { type: 'ADD_ITEM' }
  | { type: 'EDIT_ITEM'; itemId: string }
  | { type: 'DELETE_ITEM'; itemId: string }
  | { type: 'SAVE_ITEM'; item: OrderItemUI }
  | { type: 'CANCEL_ITEM_EDIT' }
  | { type: 'GO_TO_ITEM_WIZARD_STATE'; state: ItemWizardSubState }

  // Параметри замовлення
  | { type: 'SAVE_ORDER_PARAMS'; params: Partial<OrderCreateRequest> }

  // Завершення
  | { type: 'COMPLETE_ORDER' };

/**
 * Історія станів для підтримки функції "назад"
 */
export interface StateHistoryEntry {
  state: WizardState;
  subState?: string;
  timestamp: number;
}
