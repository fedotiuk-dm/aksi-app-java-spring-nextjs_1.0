/**
 * Інтерфейси стану для Order Wizard
 * Типізація для Zustand stores та XState context
 */

import {
  WizardStep,
  ItemWizardStep,
  WizardStepState,
  WizardContext,
  SaveState,
} from './wizard-common.types';

// XState Context для головної машини
export interface WizardMachineContext {
  currentStep: WizardStep;
  currentItemStep?: ItemWizardStep;
  context: WizardContext;
  progress: number;
  canProceed: boolean;
  errors: string[];
  warnings: string[];
}

// Стан навігації
export interface NavigationState {
  currentStep: WizardStep;
  availableSteps: WizardStep[];
  completedSteps: WizardStep[];
  canGoNext: boolean;
  canGoPrev: boolean;
  progress: number;
}

// Стан Item Wizard навігації
export interface ItemWizardNavigationState {
  isActive: boolean;
  currentStep: ItemWizardStep;
  completedSteps: ItemWizardStep[];
  canGoNext: boolean;
  canGoPrev: boolean;
  progress: number;
}

// Загальний стан wizard
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

// Інтерфейси для кожного кроку
export interface ClientStepState extends WizardStepState {
  selectedClientId: string | null;
  isNewClient: boolean;
  searchTerm: string;
  searchResults: ClientSearchResult[];
  isSearching: boolean;
}

export interface BranchSelectionState extends WizardStepState {
  branches: Branch[];
  selectedBranchId: string | null;
  isLoading: boolean;
  orderInitiated: boolean;
}

export interface ItemsManagerState extends WizardStepState {
  itemsList: OrderItem[];
  totalAmount: number;
  isItemWizardActive: boolean;
  editingItemId: string | null;
  currentItemData: OrderItem | null;
}

export interface OrderParametersState extends WizardStepState {
  executionDate: Date | null;
  urgencyType: 'normal' | 'urgent_48h' | 'urgent_24h';
  discountType: 'none' | 'evercard' | 'social' | 'military' | 'other';
  paymentMethod: 'terminal' | 'cash' | 'account';
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
}

export interface OrderConfirmationState extends WizardStepState {
  orderSummary: OrderSummary;
  termsAccepted: boolean;
  signatureData: string | null;
  receiptGenerated: boolean;
  isCompleting: boolean;
}

// Тимчасові типи для доменних сутностей (будуть замінені на типи з доменів)
export interface ClientSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  // інші властивості предмета
}

export interface OrderSummary {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  clientInfo: ClientSearchResult;
  // інші властивості підсумку замовлення
}

// Об'єднаний стан всіх кроків
export interface AllStepsState {
  clientStep: ClientStepState;
  branchSelection: BranchSelectionState;
  itemsManager: ItemsManagerState;
  orderParameters: OrderParametersState;
  orderConfirmation: OrderConfirmationState;
}

// Селектори
export interface WizardSelectors {
  getCurrentStep: () => WizardStep;
  getStepValidation: (step: WizardStep) => WizardStepState;
  getProgress: () => number;
  canProceedToNext: () => boolean;
  getCompletedSteps: () => WizardStep[];
  hasUnsavedChanges: () => boolean;
}
