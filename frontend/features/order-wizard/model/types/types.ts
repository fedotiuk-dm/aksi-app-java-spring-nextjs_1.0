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
  // Підетап 2.1: Основна інформація про предмет
  ITEM_LIST = 'ITEM_LIST',
  ITEM_SELECTION = 'ITEM_SELECTION',
  ITEM_DETAILS = 'ITEM_DETAILS',
  
  // Підетап 2.2: Характеристики предмета
  ITEM_PROPERTIES = 'ITEM_PROPERTIES',
  
  // Підетап 2.3: Забруднення, дефекти та ризики
  ITEM_DEFECTS = 'ITEM_DEFECTS',
  
  // Підетап 2.4: Знижки та надбавки (калькулятор ціни)
  ITEM_PRICING = 'ITEM_PRICING',
  
  // Підетап 2.5: Фотодокументація
  ITEM_PHOTOS = 'ITEM_PHOTOS',
}

// Типи для підкроків Item Wizard
export enum ItemWizardSubStep {
  BASIC_INFO = 'BASIC_INFO',                // substep1-basic-info
  ITEM_PROPERTIES = 'ITEM_PROPERTIES',      // substep2-item-properties
  DEFECTS_STAINS = 'DEFECTS_STAINS',        // substep3-defects-stains
  PRICE_CALCULATOR = 'PRICE_CALCULATOR',    // substep4-price-calculator
  PHOTO_DOCUMENTATION = 'PHOTO_DOCUMENTATION', // substep5-photo-documentation
  ITEM_SUMMARY = 'ITEM_SUMMARY'             // substep6-item-summary
}

// Історія навігації для можливості переходу назад
export interface NavigationHistoryItem {
  step: WizardStep;
  subStep?: ItemManagerSubStep | ItemWizardSubStep | string;
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
import { Stain, Defect } from '@/features/order-wizard/model/schema/item-defects.schema';
import { AppliedModifier, PriceCalculationResult } from '@/features/order-wizard/model/schema/item-pricing.schema';

// Тип для фотографій
export interface ItemPhoto {
  id?: UUID;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  size: number;
  createdAt?: string;
}

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
  
  // Характеристики предмета (підетап 2.2)
  filler?: string;
  isFillerLumpy?: boolean;
  wearDegree?: string;
  propertyNotes?: string;
  
  // Плями та дефекти (підетап 2.3)
  stains?: Stain[];
  defects?: Defect[];
  defectsNotes?: string;
  
  // Підетап 2.4: Знижки та надбавки (калькулятор ціни)
  priceModifiers?: AppliedModifier[];
  priceCalculationDetails?: PriceCalculationResult;
  
  // Підетап 2.5: Фотодокументація
  photos?: ItemPhoto[];
  
  // Загальні інструкції
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
  currentSubStep?: ItemManagerSubStep | ItemWizardSubStep | string;
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
  setCurrentSubStep: (subStep: ItemManagerSubStep | ItemWizardSubStep | string | undefined) => void;
  navigateToStep: (
    step: WizardStep,
    subStep?: ItemManagerSubStep | ItemWizardSubStep | string
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
