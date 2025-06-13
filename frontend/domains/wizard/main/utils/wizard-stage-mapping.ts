// 🎯 Константи та маппінг для етапів Order Wizard
// Винесено з UI компонентів для повторного використання

import { OrderWizardResponseDTOCurrentState } from '@/shared/api/generated/main';

// 📋 Константи етапів UI
export const WIZARD_STAGES = {
  CLIENT_SELECTION: 1,
  ITEMS_MANAGEMENT: 2,
  ORDER_PARAMETERS: 3,
  FINALIZATION: 4,
} as const;

export const WIZARD_STAGE_NAMES = {
  1: 'Клієнт та базова інформація',
  2: 'Менеджер предметів',
  3: 'Загальні параметри',
  4: 'Підтвердження та завершення',
} as const;

export type WizardStage = 1 | 2 | 3 | 4;

// 🔄 Маппінг стану API до номера етапу UI
export const mapApiStateToStage = (apiState?: OrderWizardResponseDTOCurrentState): WizardStage => {
  if (!apiState) return 1;

  switch (apiState) {
    // Етап 1: Клієнт та базова інформація
    case 'INITIAL':
    case 'CLIENT_SELECTION':
    case 'ORDER_INITIALIZATION':
      return 1;

    // Етап 2: Менеджер предметів
    case 'ITEM_MANAGEMENT':
    case 'ITEM_WIZARD_ACTIVE':
      return 2;

    // Етап 3: Загальні параметри
    case 'EXECUTION_PARAMS':
    case 'GLOBAL_DISCOUNTS':
    case 'PAYMENT_PROCESSING':
    case 'ADDITIONAL_INFO':
      return 3;

    // Етап 4: Підтвердження та завершення
    case 'ORDER_CONFIRMATION':
    case 'ORDER_REVIEW':
    case 'LEGAL_ASPECTS':
    case 'RECEIPT_GENERATION':
    case 'COMPLETED':
      return 4;

    // За замовчуванням
    default:
      return 1;
  }
};

// 🎨 Допоміжні функції для UI
export const getStageProgress = (currentStage: WizardStage): number => {
  return ((currentStage - 1) / (Object.keys(WIZARD_STAGE_NAMES).length - 1)) * 100;
};

export const isStageCompleted = (stage: WizardStage, currentStage: WizardStage): boolean => {
  return stage < currentStage;
};

export const isStageActive = (stage: WizardStage, currentStage: WizardStage): boolean => {
  return stage === currentStage;
};

export const canNavigateToStage = (
  targetStage: WizardStage,
  currentStage: WizardStage
): boolean => {
  // Можна переходити тільки на попередні етапи або поточний
  return targetStage <= currentStage;
};
