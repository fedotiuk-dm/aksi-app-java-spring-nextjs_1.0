/**
 * @fileoverview Типи для розрахунку цін
 * @module domain/wizard/adapters/pricing/types/price-calculation
 */

import { WizardAppliedModifier } from './price-modifier.types';

/**
 * Запит на розрахунок ціни для wizard
 */
export interface WizardPriceCalculationRequest {
  categoryCode: string;
  itemName: string;
  quantity: number;
  color?: string;
  material?: string;
  modifierCodes: string[];
  expedited: boolean;
  expeditePercent: number;
  discountPercent: number;
  urgencyLevel?: number;
  specialInstructions?: string;
}

/**
 * Деталі розрахунку ціни
 */
export interface WizardPriceCalculationDetails {
  basePrice: number;
  quantity: number;
  subtotal: number;
  modifiersAmount: number;
  urgencyAmount: number;
  discountAmount: number;
  finalPrice: number;
  appliedModifiers: WizardAppliedModifier[];
}

/**
 * Відповідь розрахунку ціни для wizard
 */
export interface WizardPriceCalculationResponse {
  success: boolean;
  itemName: string;
  categoryCode: string;
  categoryName: string;
  unitOfMeasure: string;
  calculation: WizardPriceCalculationDetails;
  warnings: string[];
  recommendations: string[];
  timestamp: string;
}

/**
 * Рекомендований модифікатор для розрахунку ціни
 */
export interface WizardRecommendedModifier {
  code: string;
  name: string;
  reason: string;
  priority: number;
  isRequired: boolean;
  description?: string;
}
