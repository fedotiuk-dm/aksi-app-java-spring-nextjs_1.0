import type { ItemManagerDTO } from '../../../lib/api/generated/models/ItemManagerDTO';
import type { OrderItemDTO } from '../../../lib/api/generated/models/OrderItemDTO';
import type { ValidationResult } from '../../../lib/api/generated/models/ValidationResult';

// ========== ТИПИ СТАНІВ ==========

export type Stage2State =
  | 'NOT_STARTED'
  | 'INITIALIZING'
  | 'ITEMS_MANAGER_SCREEN'
  | 'ITEM_WIZARD_ACTIVE'
  | 'READY_TO_PROCEED'
  | 'COMPLETED'
  | 'ERROR';

export type WizardMode = 'create' | 'edit' | 'inactive';

// ========== ОСНОВНІ ІНТЕРФЕЙСИ ==========

export interface Stage2Store {
  // Стан
  sessionId: string | null;
  orderId: string | null;
  manager: ItemManagerDTO | null;
  currentState: Stage2State;
  isLoading: boolean;
  error: string | null;

  // Wizard стан
  wizardMode: WizardMode;
  editingItemId: string | null;
  activeWizardId: string | null;

  // Загальні статистики
  totalAmount: number;
  itemCount: number;
  canProceedToNextStage: boolean;

  // Дії для менеджера
  initializeManager: (orderId: string) => Promise<void>;
  refreshManager: () => Promise<void>;
  synchronizeManager: () => Promise<void>;
  terminateSession: () => Promise<void>;
  resetSession: () => Promise<void>;

  // Дії для предметів
  addItem: (item: OrderItemDTO) => Promise<void>;
  updateItem: (itemId: string, item: OrderItemDTO) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;

  // Дії для візарда
  startNewItemWizard: () => Promise<void>;
  startEditItemWizard: (itemId: string) => Promise<void>;
  closeWizard: () => Promise<void>;

  // Валідація та навігація
  validateCurrentState: () => Promise<ValidationResult>;
  checkReadiness: () => Promise<boolean>;
  completeStage2: () => Promise<void>;

  // Сервісні дії
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// ========== ТИПИ ДЛЯ ХУКІВ ==========

export interface UseStage2ManagerReturn {
  // Стан
  manager: ItemManagerDTO | null;
  currentState: Stage2State;
  isLoading: boolean;
  error: string | null;

  // Статистики
  totalAmount: number;
  itemCount: number;
  canProceedToNextStage: boolean;
  addedItems: OrderItemDTO[];

  // Методи управління
  initializeManager: (orderId: string) => Promise<void>;
  refreshManager: () => Promise<void>;
  terminateSession: () => Promise<void>;
  resetSession: () => Promise<void>;

  // Методи для предметів
  addItem: (item: OrderItemDTO) => Promise<void>;
  updateItem: (itemId: string, item: OrderItemDTO) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;

  // Валідація
  validateCurrentState: () => Promise<ValidationResult>;
  checkReadiness: () => Promise<boolean>;
  completeStage2: () => Promise<void>;

  // Утиліти
  clearError: () => void;
}

export interface UseItemWizardReturn {
  // Wizard стан
  wizardMode: WizardMode;
  isWizardActive: boolean;
  editingItemId: string | null;
  activeWizardId: string | null;

  // Методи управління візардом
  startNewItem: () => Promise<void>;
  startEditItem: (itemId: string) => Promise<void>;
  closeWizard: () => Promise<void>;

  // Стан завантаження
  isLoading: boolean;
  error: string | null;
}

// ========== ДОПОМІЖНІ ТИПИ ==========

export interface ItemSummary {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  color?: string;
  material?: string;
}

export interface ManagerStatistics {
  totalItems: number;
  totalAmount: number;
  averageItemPrice: number;
  categoriesCount: number;
  hasDefectItems: boolean;
  hasSpecialInstructions: boolean;
}

export type SortField = 'name' | 'category' | 'quantity' | 'unitPrice' | 'totalPrice';
export type SortDirection = 'asc' | 'desc';

export interface ItemsFilter {
  search?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  hasDefects?: boolean;
  hasSpecialInstructions?: boolean;
}

export interface ItemsSorting {
  field: SortField;
  direction: SortDirection;
}

// ========== КОНСТАНТИ ==========

export const STAGE2_INITIAL_STATE: Partial<Stage2Store> = {
  sessionId: null,
  orderId: null,
  manager: null,
  currentState: 'NOT_STARTED',
  isLoading: false,
  error: null,
  wizardMode: 'inactive',
  editingItemId: null,
  activeWizardId: null,
  totalAmount: 0,
  itemCount: 0,
  canProceedToNextStage: false,
} as const;

export const WIZARD_MODES = {
  CREATE: 'create',
  EDIT: 'edit',
  INACTIVE: 'inactive',
} as const;

export const STAGE2_STATES = {
  NOT_STARTED: 'NOT_STARTED',
  INITIALIZING: 'INITIALIZING',
  ITEMS_MANAGER_SCREEN: 'ITEMS_MANAGER_SCREEN',
  ITEM_WIZARD_ACTIVE: 'ITEM_WIZARD_ACTIVE',
  READY_TO_PROCEED: 'READY_TO_PROCEED',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
} as const;
