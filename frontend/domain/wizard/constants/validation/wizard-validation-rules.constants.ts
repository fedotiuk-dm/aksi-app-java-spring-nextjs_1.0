/**
 * Правила валідації wizard - відповідальність за логіку та категорії валідації
 */

/**
 * Категорії валідації
 */
export const VALIDATION_CATEGORIES = {
  CLIENT_DATA: 'client_data',
  ORDER_INFO: 'order_info',
  ITEM_DATA: 'item_data',
  PRICING: 'pricing',
  PAYMENT: 'payment',
  UPLOAD: 'upload',
} as const;

/**
 * Правила для різних кроків
 */
export const STEP_VALIDATION_RULES = {
  CLIENT_SELECTION: {
    requiredFields: ['selectedClientId'],
    conditionalFields: {
      isNewClient: ['firstName', 'lastName', 'phone'],
    },
  },
  BRANCH_SELECTION: {
    requiredFields: ['selectedBranchId'],
  },
  ITEM_MANAGER: {
    requiredFields: ['itemsList'],
    customValidations: ['hasAtLeastOneItem'],
  },
  ORDER_PARAMETERS: {
    requiredFields: ['executionDate', 'paymentMethod'],
    conditionalFields: {
      hasDiscount: ['discountType'],
    },
  },
  ORDER_CONFIRMATION: {
    requiredFields: ['termsAccepted'],
    conditionalFields: {
      requireSignature: ['signatureData'],
    },
  },
} as const;

/**
 * Пріоритети помилок валідації
 */
export const VALIDATION_PRIORITY = {
  CRITICAL: 1, // Блокує продовження
  HIGH: 2, // Важливі помилки
  MEDIUM: 3, // Стандартні помилки
  LOW: 4, // Попередження
} as const;
