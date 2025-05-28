/**
 * Типи для структури квитанції у wizard
 */

import type { BranchData } from './orval-types';

/**
 * Структура квитанції (wizard-специфічна)
 */
export interface ReceiptData {
  header: {
    companyLogo: string;
    companyName: string;
    legalInfo: string;
    address: string;
    contacts: string;
    branchInfo: BranchData;
    operatorName: string;
  };

  orderInfo: {
    receiptNumber: string;
    tagNumber?: string;
    creationDate: string;
    expectedDeliveryDate: string;
    deliveryTime: string; // "після 14:00"
  };

  clientInfo: {
    fullName: string;
    phone: string;
    communicationMethod: string;
    address?: string;
  };

  itemsTable: Array<{
    orderNumber: number;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    material: string;
    color: string;
    filling?: string;
    basePrice: number;
    priceBreakdown: Array<{
      modifierName: string;
      impact: number;
      amount: number;
    }>;
    finalPrice: number;
  }>;

  defectsSection: {
    stains: Array<{
      type: string;
      description?: string;
    }>;
    defects: Array<{
      type: string;
      description?: string;
    }>;
    noWarrantyNote?: string;
  };

  financialInfo: {
    servicesTotal: number;
    discount?: {
      type: string;
      amount: number;
    };
    expediteCharge?: {
      type: string;
      amount: number;
    };
    totalAmount: number;
    prepayment: number;
    balance: number;
    paymentMethod: string;
  };

  legalInfo: {
    serviceTerms: string;
    liabilityLimitations: string;
    riskInformation: string;
    fullTermsLink: string;
  };

  signatures: {
    clientSignatureDropOff: string | null;
    clientSignaturePickup: string | null;
    operatorSignature: string;
    companyStamp: boolean;
  };

  footer: {
    contactInfo: string;
    workingHours: string;
    trackingQrCode?: string;
  };
}
