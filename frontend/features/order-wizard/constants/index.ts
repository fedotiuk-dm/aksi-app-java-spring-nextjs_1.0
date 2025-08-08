import { OrderWizardConfig } from '../types';

export const ORDER_WIZARD_CONFIG: OrderWizardConfig = {
  maxPhotosPerItem: 5,
  maxPhotoSize: 5, // MB
  defaultDeliveryDays: 2,
  signatureRequired: true,
};

export const PAYMENT_METHODS = {
  TERMINAL: 'Термінал',
  CASH: 'Готівка',
  BANK: 'На рахунок',
} as const;

export const URGENCY_OPTIONS = {
  NORMAL: { label: 'Звичайне (без націнки)', surcharge: 0 },
  FAST: { label: '+50% за 48 год', surcharge: 50 },
  EXPRESS: { label: '+100% за 24 год', surcharge: 100 },
} as const;

export const DISCOUNT_OPTIONS = {
  NONE: { label: 'Без знижки', percent: 0 },
  EVERCARD: { label: 'Еверкард', percent: 10 },
  SOCIAL_MEDIA: { label: 'Соцмережі', percent: 5 },
  MILITARY: { label: 'ЗСУ', percent: 10 },
  OTHER: { label: 'Інше', percent: null },
} as const;

export const CONTACT_PREFERENCES = {
  PHONE: 'Номер телефону',
  SMS: 'SMS',
  VIBER: 'Viber',
} as const;

export const INFO_SOURCES = {
  INSTAGRAM: 'Інстаграм',
  GOOGLE: 'Google',
  RECOMMENDATION: 'Рекомендації',
  OTHER: 'Інше',
} as const;

// Re-export all other constants
export * from './item-categories';
export * from './item-defects';
export * from './item-modifiers';
export * from './item-validation';