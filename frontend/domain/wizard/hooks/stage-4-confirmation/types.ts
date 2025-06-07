/**
 * @fileoverview Типи для етапу 4 - підтвердження та квитанція
 */

import type {
  ReceiptGenerationRequest,
  ReceiptDTO,
} from '@/shared/api/generated/full/aksiApi.schemas';

// ===================================
// Підсумок замовлення
// ===================================

export interface OrderSummary {
  orderId?: string;
  clientInfo: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    modifiers: string[];
    defects: string[];
    stains: string[];
  }>;
  financials: {
    subtotal: number;
    discountAmount: number;
    urgencyFee: number;
    totalAmount: number;
    prepaymentAmount: number;
    remainingAmount: number;
  };
  execution: {
    completionDate: string;
    urgencyLevel: string;
  };
  additionalInfo: {
    notes?: string;
    clientRequirements?: string;
    tags: string[];
  };
}

export interface UseOrderSummaryReturn {
  // Стан
  summary: OrderSummary | null;
  isLoading: boolean;
  error: string | null;
  isValidSummary: boolean;
  totalItemsCount: number;
  hasDefectsOrStains: boolean;

  // Дії
  loadSummary: (orderId: string) => Promise<void>;
  refreshSummary: () => Promise<void>;
  clearSummary: () => void;
}

// ===================================
// Згода з умовами послуг
// ===================================

export interface LegalDocument {
  id: string;
  title: string;
  description: string;
  url: string;
  required: boolean;
}

export interface TermsAgreement {
  isAgreed: boolean;
  agreedAt: string | null; // ISO date string
  documentsViewed: string[]; // IDs of viewed documents
  ipAddress: string | null;
  userAgent: string | null;
}

export interface UseTermsAgreementReturn {
  // Стан
  agreement: TermsAgreement;
  isAgreed: boolean;
  canProceed: boolean;
  error: string | null;

  // Дії
  setAgreement: (agreed: boolean, orderId?: string) => Promise<void>;
  validateAgreement: () => boolean;
  resetAgreement: () => void;
}

// ===================================
// Цифровий підпис клієнта (ЗАСТАРІЛО - використовуйте useLegalAspects)
// ===================================

// ===================================
// Генерація квитанції
// ===================================

export type ReceiptFormat = 'pdf' | 'thermal' | 'email';

export interface ReceiptGeneration {
  orderId?: string;
  format: ReceiptFormat;
  clientCopy: boolean;
  internalCopy: boolean;
  emailReceipt: boolean;
  emailAddress?: string;
  receipt?: ReceiptDTO;
  generatedAt?: string;
}

export interface UseReceiptGenerationReturn {
  // Стан
  receipt: ReceiptGeneration;
  isGenerating: boolean;
  isEmailSending: boolean;
  error: string | null;

  // Дії
  setFormat: (format: ReceiptFormat) => void;
  setClientCopy: (enabled: boolean) => void;
  setInternalCopy: (enabled: boolean) => void;
  setEmailReceipt: (enabled: boolean, email?: string) => void;
  generateReceipt: (request: ReceiptGenerationRequest) => Promise<void>;
  printReceipt: () => Promise<void>;
  emailReceipt: (email: string) => Promise<void>;
  clearReceipt: () => void;
}

// ===================================
// Завершення візарда (ЗАСТАРІЛО - використовуйте useCompletionStatus)
// ===================================

// ===================================
// Статус завершення (етап 4.4)
// ===================================

export interface CompletionStatus {
  // Статус замовлення
  orderId: string | null;
  orderNumber: string | null;
  isSuccess: boolean;
  completedAt: string | null;

  // Дата готовності
  expectedCompletionDate: string | null;
  formattedCompletionDate: string | null;

  // Копії квитанції
  receiptSent: {
    printed: boolean;
    emailed: boolean;
    emailAddress?: string;
  };

  // Деталі клієнта
  clientInfo: {
    name: string;
    phone: string;
    email?: string;
  } | null;

  // Фінансова інформація
  financialSummary: {
    totalAmount: number;
    prepaymentAmount: number;
    balanceAmount: number;
    paymentMethod: string;
  } | null;
}

export interface UseCompletionStatusReturn {
  // Стан
  status: CompletionStatus;
  isLoading: boolean;
  error: string | null;

  // Валідація
  isValidCompletion: boolean;

  // Дії навігації
  goToNewOrder: () => void;
  goToOrdersList: () => void;
  goToOrderDetail: () => void;

  // Дані для показу
  completionMessages: {
    success: string;
    emailStatus: string;
    printStatus: string;
    reminderDate: string;
  };

  // Допоміжні функції
  formatCompletionDate: (date: string) => string;
  getEmailStatusMessage: () => string;
  getPrintStatusMessage: () => string;
}

// ===================================
// Менеджер етапу 4
// ===================================

export interface Stage4Data {
  summary: OrderSummary | null;
  agreement: TermsAgreement;
  receipt: ReceiptGeneration;
}

export interface UseStage4ManagerReturn {
  // Стан
  data: Stage4Data;
  isValid: boolean;
  validationErrors: string[];
  currentStep: 'summary' | 'agreement' | 'signature' | 'receipt' | 'completion';
  canProceed: boolean;

  // Дії
  setCurrentStep: (step: 'summary' | 'agreement' | 'signature' | 'receipt' | 'completion') => void;
  validateCurrentStep: () => boolean;
  proceedToNext: () => void;
  goToPrevious: () => void;
  completeStage4: () => Promise<void>;
  resetStage4: () => void;

  // Дочірні хуки
  summaryHook: UseOrderSummaryReturn;
  agreementHook: UseTermsAgreementReturn;
  receiptHook: UseReceiptGenerationReturn;
}
