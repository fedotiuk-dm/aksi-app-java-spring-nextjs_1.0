/**
 * @fileoverview Маппер для перетворення ServiceCategoryDTO ↔ WizardServiceCategory
 * @module domain/wizard/adapters/pricing/mappers
 */

import type { WizardServiceCategory } from '../types';
import type { ServiceCategoryDTO } from '@/lib/api';

/**
 * Розширений інтерфейс для API відповіді з категоріями послуг
 * Додає поля, які можуть не бути в базовому ServiceCategoryDTO
 */
interface ExtendedServiceCategoryResponse extends ServiceCategoryDTO {
  materials?: string[];
  defaultUnit?: string;
}

/**
 * Перетворює ExtendedServiceCategoryResponse у WizardServiceCategory
 */
export function mapServiceCategoryDTOToDomain(
  apiCategory: ExtendedServiceCategoryResponse
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
 * Перетворює масив ExtendedServiceCategoryResponse у WizardServiceCategory[]
 */
export function mapServiceCategoryArrayToDomain(
  apiCategories: ExtendedServiceCategoryResponse[]
): WizardServiceCategory[] {
  return apiCategories.map(mapServiceCategoryDTOToDomain);
}
