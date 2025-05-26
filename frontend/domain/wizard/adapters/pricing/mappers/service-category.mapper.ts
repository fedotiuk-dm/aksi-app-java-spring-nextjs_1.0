/**
 * @fileoverview Маппер для перетворення ServiceCategoryDTO ↔ WizardServiceCategory
 * @module domain/wizard/adapters/pricing/mappers
 */

import type { WizardServiceCategory } from '../types';

/**
 * Інтерфейс для API відповіді з категоріями послуг
 */
interface ServiceCategoryApiResponse extends Record<string, unknown> {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  active?: boolean;
  sortOrder?: number;
  materials?: string[];
  defaultUnit?: string;
}

/**
 * Перетворює ServiceCategoryApiResponse у WizardServiceCategory
 */
export function mapServiceCategoryDTOToDomain(
  apiCategory: ServiceCategoryApiResponse
): WizardServiceCategory {
  return {
    id: apiCategory.id || '',
    code: apiCategory.code || '',
    name: apiCategory.name || '',
    description: apiCategory.description,
    isActive: apiCategory.active || false,
    sortOrder: apiCategory.sortOrder,
    materials: apiCategory.materials || [],
    defaultUnit: apiCategory.defaultUnit || 'шт',
  };
}

/**
 * Перетворює масив ServiceCategoryApiResponse у WizardServiceCategory[]
 */
export function mapServiceCategoryArrayToDomain(
  apiCategories: ServiceCategoryApiResponse[]
): WizardServiceCategory[] {
  return apiCategories.map(mapServiceCategoryDTOToDomain);
}
