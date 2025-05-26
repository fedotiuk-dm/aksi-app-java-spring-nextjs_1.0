/**
 * @fileoverview Маппер для категорій клієнтів
 * @module domain/wizard/adapters/client/mappers
 */

import { ClientCategoryDTO } from '@/lib/api';

import { WizardClientCategory } from '../types';

/**
 * Перетворює ClientCategoryDTO у WizardClientCategory
 */
export function mapClientCategoryDTOToDomain(
  apiCategory?: ClientCategoryDTO
): WizardClientCategory | undefined {
  if (!apiCategory) return undefined;

  return {
    id: apiCategory.code || '',
    name: apiCategory.displayName || '',
    description: undefined,
    discountPercentage: undefined,
  };
}
