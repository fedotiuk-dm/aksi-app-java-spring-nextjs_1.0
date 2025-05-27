/**
 * @fileoverview Типи для API відповідей pricing адаптерів
 * @module domain/wizard/adapters/pricing/types/api-responses
 */

import type { ModifierRecommendationDTO } from '@/lib/api';

/**
 * Тип для API відповіді з модифікаторами цін
 * Базується на ModifierRecommendationDTO з додатковими полями
 */
export interface PriceModifierApiResponse extends ModifierRecommendationDTO {
  id?: string;
  category?: string;
  active?: boolean;
  applicableCategories?: string[];
  conditions?: string[];
}

/**
 * Тип для API відповіді з базовою ціною
 */
export interface BasePriceApiResponse {
  price?: number;
  basePrice?: number;
  unitOfMeasure?: string;
  categoryCode?: string;
  itemName?: string;
  color?: string;
}

/**
 * Тип для API відповіді з попередженнями про ризики
 */
export interface RiskWarningApiResponse {
  type?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH';
  message?: string;
  recommendation?: string;
}

/**
 * Тип для API відповіді з рекомендованими модифікаторами
 */
export interface RecommendedModifiersApiResponse {
  modifiers?: PriceModifierApiResponse[];
  warnings?: RiskWarningApiResponse[];
}

/**
 * Тип для API відповіді з доступними модифікаторами
 */
export interface AvailableModifiersApiResponse {
  general?: PriceModifierApiResponse[];
  textile?: PriceModifierApiResponse[];
  leather?: PriceModifierApiResponse[];
}

/**
 * Тип для API відповіді з модифікаторами за кодами
 */
export type ModifiersByCodesApiResponse = Record<string, PriceModifierApiResponse>;

/**
 * Тип для API відповіді з модифікаторами за категорією
 */
export type ModifiersByCategoryApiResponse = PriceModifierApiResponse[];

/**
 * Тип для API відповіді з модифікаторами за типом
 */
export type ModifiersByTypeApiResponse = PriceModifierApiResponse[];
