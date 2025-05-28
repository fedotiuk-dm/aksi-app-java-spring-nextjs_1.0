/**
 * Типи валідації для wizard кроків
 */

import type { ClientData, OrderItemData } from './orval-types';

/**
 * Обмеження валідації для wizard кроків (wizard-специфічна логіка)
 */
export interface ValidationConstraints {
  client: {
    requiredFields: Array<keyof ClientData>;
    phonePattern: RegExp;
    emailPattern: RegExp;
  };
  order: {
    minimumItems: number;
    maximumItems: number;
    minimumAmount: number;
    maximumDiscountPercent: number;
    allowedPaymentMethods: string[];
  };
  item: {
    requiredFields: Array<keyof OrderItemData>;
    maxPhotos: number;
    maxFileSize: number;
    maxNotesLength: number;
  };
  receipt: {
    maxPrintCopies: number;
    requiredSignature: boolean;
    requireTermsAcceptance: boolean;
  };
}
