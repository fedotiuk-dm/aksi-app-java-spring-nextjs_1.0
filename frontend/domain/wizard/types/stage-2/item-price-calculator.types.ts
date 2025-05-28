/**
 * Підетап 2.4: Стан кроку "Знижки та надбавки (калькулятор ціни)"
 */

import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Підетап 2.4: Стан кроку "Знижки та надбавки (калькулятор ціни)"
 */
export interface ItemPriceCalculatorStepState extends WizardStepState {
  // Базова ціна
  basePrice: number;

  // Коефіцієнти і модифікатори
  selectedModifiers: Array<{
    code: string;
    name: string;
    type: 'PERCENTAGE' | 'FIXED' | 'MULTIPLIER';
    value: number;
    category: 'GENERAL' | 'TEXTILE' | 'LEATHER';
    isApplicable: boolean;
  }>;

  availableModifiers: Array<{
    code: string;
    name: string;
    type: 'PERCENTAGE' | 'FIXED' | 'MULTIPLIER';
    value: number;
    category: 'GENERAL' | 'TEXTILE' | 'LEATHER';
    description: string;
  }>;

  // Розрахунок ціни
  priceBreakdown: {
    basePrice: number;
    modifiers: Array<{
      name: string;
      value: number;
      amount: number;
    }>;
    intermediateTotal: number;
    finalPrice: number;
  };

  // Інтерактивний розрахунок
  isCalculating: boolean;
  calculationError?: string;
}
