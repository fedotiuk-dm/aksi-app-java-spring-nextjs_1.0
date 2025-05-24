/**
 * Services для XState машини wizard - асинхронні операції
 */

import { WizardContext } from '../context';
import { WizardEvent } from '../events';

// Service для валідації кроку
export const validateStepService = async (context: WizardContext, event: WizardEvent) => {
  // Тут буде логіка валідації через відповідні domain stores
  return {
    isValid: true,
    errors: [],
    warnings: [],
  };
};

// Service для автозбереження
export const autoSaveService = async (context: WizardContext, event: WizardEvent) => {
  if (!context.session.hasUnsavedChanges) {
    return { success: false, reason: 'No changes to save' };
  }

  // Тут буде логіка збереження через API
  return {
    success: true,
    savedAt: new Date(),
  };
};

// Service для відновлення з чернетки
export const restoreDraftService = async (context: WizardContext, event: WizardEvent) => {
  if (event.type !== 'RESTORE_DRAFT') {
    throw new Error('Invalid event type for restore draft service');
  }

  // Тут буде логіка відновлення з localStorage або API
  return {
    success: true,
    restoredContext: context, // Заглушка
  };
};

// Service для завершення wizard
export const completeWizardService = async (context: WizardContext, event: WizardEvent) => {
  // Тут буде логіка створення замовлення через Order domain
  return {
    success: true,
    orderId: 'generated-order-id',
    receiptUrl: '/receipt/generated-order-id',
  };
};
