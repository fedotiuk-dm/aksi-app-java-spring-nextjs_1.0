/**
 * @fileoverview Маппер для перетворення ServiceCategoryDTO ↔ WizardServiceCategory
 * @module domain/wizard/adapters/pricing/mappers
 */

import type { WizardServiceCategory } from '../types';
import type { ServiceCategoryDTO } from '@/lib/api';

/**
 * Перетворює ServiceCategoryDTO у WizardServiceCategory
 */
export function mapServiceCategoryDTOToDomain(
  apiCategory: ServiceCategoryDTO
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
 * Перетворює масив ServiceCategoryDTO у WizardServiceCategory[]
 */
export function mapServiceCategoryArrayToDomain(
  apiCategories: ServiceCategoryDTO[]
): WizardServiceCategory[] {
  return apiCategories.map(mapServiceCategoryDTOToDomain);
}
