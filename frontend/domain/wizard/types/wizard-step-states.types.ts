/**
 * Типи станів конкретних кроків wizard - відповідальність за структури даних кожного кроку
 */

import { WizardStepState } from './wizard-step-state.types';

/**
 * Доменні типи для роботи з клієнтами на основі API структур
 */
export interface ClientSearchResult {
  id: string;
  lastName: string;
  firstName: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  structuredAddress?: {
    street: string;
    city: string;
    zipCode?: string;
    country?: string;
  };
  communicationChannels?: Array<'PHONE' | 'SMS' | 'VIBER'>;
  source?: 'INSTAGRAM' | 'GOOGLE' | 'RECOMMENDATION' | 'OTHER';
  sourceDetails?: string;
  createdAt: string;
  updatedAt: string;
  orderCount?: number;
  recentOrders?: Array<{
    id: string;
    receiptNumber: string;
    status: OrderStatus;
    totalAmount: number;
    createdAt: string;
    completionDate?: string;
    itemCount: number;
  }>;
}

/**
 * Критерії пошуку клієнтів
 */
export interface ClientSearchCriteria {
  searchTerm: string;
  searchBy: Array<'lastName' | 'firstName' | 'phone' | 'email' | 'address'>;
  limit?: number;
  includeRecentOrders?: boolean;
}

/**
 * Типи філій на основі API структур
 */
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  code: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Типи предметів замовлення на основі API структур
 */
export interface OrderItem {
  id: string;
  orderId?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  color?: string;
  material?: string;
  unitOfMeasure?: string;
  defects?: string;
  specialInstructions?: string;
  fillerType?: string;
  fillerCompressed?: boolean;
  wearDegree?: string;
  stains?: string;
  otherStains?: string;
  defectsAndRisks?: string;
  noGuaranteeReason?: string;
  defectsNotes?: string;
  photos?: string[];
}

/**
 * Статуси замовлень
 */
export type OrderStatus = 'DRAFT' | 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED';

/**
 * Типи терміновості
 */
export type ExpediteType = 'STANDARD' | 'EXPRESS_48H' | 'EXPRESS_24H';

/**
 * Підсумок замовлення на основі API структур
 */
export interface OrderSummary {
  id: string;
  receiptNumber: string;
  tagNumber?: string;
  status: OrderStatus;
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
  prepaymentAmount?: number;
  balanceAmount: number;
  createdDate: string;
  expectedCompletionDate?: string;
  completedDate?: string;
  expediteType: ExpediteType;
  clientInfo?: ClientSearchResult;
  branchInfo?: Branch;
  items: OrderItem[];
  itemCount: number;
  customerNotes?: string;
  internalNotes?: string;
  completionComments?: string;
  termsAccepted?: boolean;
  finalizedAt?: string;
  express: boolean;
  draft: boolean;
  printed: boolean;
  emailed: boolean;
}

/**
 * Стан кроку "Вибір клієнта"
 */
export interface ClientStepState extends WizardStepState {
  selectedClientId: string | null;
  selectedClient: ClientSearchResult | null;
  isNewClient: boolean;
  searchTerm: string;
  searchResults: ClientSearchResult[];
  isSearching: boolean;
  recentClients: ClientSearchResult[];
  showCreateForm: boolean;
  lastSearchQuery?: string;
  searchCache: Map<string, ClientSearchResult[]>;
}

/**
 * Стан кроку "Вибір філії"
 */
export interface BranchSelectionState extends WizardStepState {
  branches: Branch[];
  selectedBranchId: string | null;
  selectedBranch: Branch | null;
  isLoading: boolean;
  orderInitiated: boolean;
  receiptNumber?: string;
  tagNumber?: string;
  lastRefresh?: string;
}

/**
 * Стан кроку "Менеджер предметів"
 */
export interface ItemsManagerState extends WizardStepState {
  itemsList: OrderItem[];
  totalAmount: number;
  isItemWizardActive: boolean;
  editingItemId: string | null;
  currentItemData: OrderItem | null;
  itemsCount: number;
  hasMinimumItems: boolean;
  unsavedChanges: boolean;
  lastCalculation?: string;
}

/**
 * Стан кроку "Параметри замовлення"
 */
export interface OrderParametersState extends WizardStepState {
  expectedCompletionDate: Date | null;
  expediteType: ExpediteType;
  expediteMultiplier: number;
  discountType: 'none' | 'evercard' | 'social' | 'military' | 'other';
  discountPercent: number;
  paymentMethod: 'terminal' | 'cash' | 'account';
  totalAmount: number;
  discountAmount: number;
  expediteAmount: number;
  finalAmount: number;
  prepaymentAmount: number;
  balanceAmount: number;
  customerNotes?: string;
  internalNotes?: string;
  express: boolean;
}

/**
 * Стан кроку "Підтвердження замовлення"
 */
export interface OrderConfirmationState extends WizardStepState {
  orderSummary: OrderSummary;
  termsAccepted: boolean;
  signatureData: string | null;
  receiptGenerated: boolean;
  receiptSent: boolean;
  receiptEmailed: boolean;
  isCompleting: boolean;
  completionProgress: number;
  printRequested: boolean;
  finalizedAt?: string;
  completionErrors: string[];
}

/**
 * Об'єднаний стан всіх кроків
 */
export interface AllStepsState {
  clientStep: ClientStepState;
  branchSelection: BranchSelectionState;
  itemsManager: ItemsManagerState;
  orderParameters: OrderParametersState;
  orderConfirmation: OrderConfirmationState;
}

/**
 * Фабрика для створення початкових станів кроків
 */
export interface StepStateFactory {
  createClientStepState: () => ClientStepState;
  createBranchSelectionState: () => BranchSelectionState;
  createItemsManagerState: () => ItemsManagerState;
  createOrderParametersState: () => OrderParametersState;
  createOrderConfirmationState: () => OrderConfirmationState;
  createAllStepsState: () => AllStepsState;
}

/**
 * Допоміжні типи для валідації
 */
export interface ValidationConstraints {
  client: {
    requiredFields: Array<keyof ClientSearchResult>;
    phonePattern: RegExp;
    emailPattern: RegExp;
  };
  branch: {
    requiredFields: Array<keyof Branch>;
  };
  items: {
    minimumCount: number;
    maximumCount: number;
    requiredFields: Array<keyof OrderItem>;
  };
  order: {
    minimumAmount: number;
    maximumDiscountPercent: number;
    allowedPaymentMethods: string[];
  };
}
