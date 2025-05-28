/**
 * Підетап 2.1: Стан кроку "Основна інформація про предмет"
 */

import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Підетап 2.1: Стан кроку "Основна інформація про предмет"
 */
export interface ItemBasicInfoStepState extends WizardStepState {
  // Категорія послуги
  selectedCategoryCode: string | null;
  availableCategories: Array<{
    code: string;
    name: string;
    description: string;
  }>;

  // Найменування виробу (динамічний список)
  selectedItemId: string | null;
  availableItems: Array<{
    id: string;
    name: string;
    basePrice: number;
    category: string;
  }>;

  // Одиниця виміру і кількість
  unit: 'PIECES' | 'KILOGRAMS';
  quantity: number;
  isLoadingItems: boolean;
}
