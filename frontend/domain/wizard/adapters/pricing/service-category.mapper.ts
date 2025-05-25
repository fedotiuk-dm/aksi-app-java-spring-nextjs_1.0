/**
 * @fileoverview Маппер для перетворення категорій послуг
 * @module domain/wizard/adapters/pricing
 */

import type { ServiceCategory } from '../../../pricing/types/pricing.types';
import type { ServiceCategoryDTO } from '@/lib/api';

/**
 * Перетворює ServiceCategoryDTO у доменний ServiceCategory
 */
export function mapServiceCategoryDTOToDomain(apiCategory: ServiceCategoryDTO): ServiceCategory {
  return {
    id: apiCategory.id || '',
    code: apiCategory.code || '',
    name: apiCategory.name || '',
    description: apiCategory.description,
    active: apiCategory.active ?? true,
  };
}

/**
 * Перетворює масив API категорій у доменні типи
 */
export function mapServiceCategoryArrayToDomain(
  apiCategories: ServiceCategoryDTO[]
): ServiceCategory[] {
  return apiCategories.map(mapServiceCategoryDTOToDomain);
}
