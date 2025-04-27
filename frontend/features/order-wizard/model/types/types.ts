import { UUID } from 'node:crypto';

// Типи для кроків візарда
export enum WizardStep {
  CLIENT_SELECTION = 'CLIENT_SELECTION',
  BASIC_INFO = 'BASIC_INFO',
  ITEM_MANAGER = 'ITEM_MANAGER',
  ITEM_WIZARD = 'ITEM_WIZARD',
  ORDER_PARAMS = 'ORDER_PARAMS',
  BILLING = 'BILLING',
  COMPLETION = 'COMPLETION',
}

// Типи для підкроків (наприклад для Item Manager)
export enum ItemManagerSubStep {
  ITEM_LIST = 'ITEM_LIST',
  ITEM_SELECTION = 'ITEM_SELECTION',
  ITEM_DETAILS = 'ITEM_DETAILS',
}

// Історія навігації для можливості переходу назад
export interface NavigationHistoryItem {
  step: WizardStep;
  subStep?: ItemManagerSubStep | string;
  data?: Record<string, unknown>;
}

// Типи для клієнта
export interface ClientAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  additionalInfo?: string;
}

export type CommunicationChannel = 'PHONE' | 'SMS' | 'VIBER';
export type ClientSource = 'INSTAGRAM' | 'GOOGLE' | 'RECOMMENDATION' | 'OTHER';

export interface ClientSourceInfo {
  source: ClientSource;
  details?: string;
}

export interface Client {
  id?: UUID;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: ClientAddress;
  communicationChannels: CommunicationChannel[];
  source?: ClientSourceInfo;
}

// Типи для замовлення
export interface OrderItem {
  id?: UUID;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  color?: string;
  material?: string;
  defects?: string;
  specialInstructions?: string;
}

export type OrderStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Order {
  id?: UUID;
  receiptNumber?: string;
  tagNumber?: string;
  clientId: UUID;
  items: OrderItem[];
  totalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  prepaymentAmount?: number;
  balanceAmount?: number;
  branchLocationId: UUID;
  status?: OrderStatus;
  createdDate?: Date;
  updatedDate?: Date;
  expectedCompletionDate?: Date;
  completedDate?: Date;
  customerNotes?: string;
  internalNotes?: string;
  express: boolean;
  draft: boolean;
}

// Базовий стан для візарда
export interface OrderWizardState {
  // Навігація
  currentStep: WizardStep;
  currentSubStep?: ItemManagerSubStep | string;
  navigationHistory: NavigationHistoryItem[];

  // Клієнт
  selectedClient: Client | null;
  searchQuery: string;
  searchResults: Client[];

  // Базова інформація
  tagNumber: string;
  branchLocationId: UUID | null;
  expectedCompletionDate: Date | null;
  express: boolean;

  // Предмети
  items: OrderItem[];
  currentItemIndex: number | null;
  currentItem: OrderItem | null;

  // Загальна інформація
  customerNotes: string;
  internalNotes: string;

  // Ціни та оплата
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  prepaymentAmount: number;
  balanceAmount: number;

  // Мета-інформація
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;

  // Методи
  setCurrentStep: (step: WizardStep) => void;
  setCurrentSubStep: (subStep: ItemManagerSubStep | string | undefined) => void;
  navigateToStep: (
    step: WizardStep,
    subStep?: ItemManagerSubStep | string
  ) => void;
  navigateBack: () => void;
  resetNavigationHistory: () => void;

  setSelectedClient: (client: Client | null) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Client[]) => void;

  setTagNumber: (tagNumber: string) => void;
  setBranchLocationId: (locationId: UUID | null) => void;
  setExpectedCompletionDate: (date: Date | null) => void;
  setExpress: (express: boolean) => void;

  addItem: (item: OrderItem) => void;
  updateItem: (index: number, item: OrderItem) => void;
  removeItem: (index: number) => void;
  setCurrentItemIndex: (index: number | null) => void;
  setCurrentItem: (item: OrderItem | null) => void;

  setCustomerNotes: (notes: string) => void;
  setInternalNotes: (notes: string) => void;

  updateTotals: () => void;
  setDiscountAmount: (amount: number) => void;
  setPrepaymentAmount: (amount: number) => void;

  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setDirty: (isDirty: boolean) => void;

  resetWizard: () => void;
}
