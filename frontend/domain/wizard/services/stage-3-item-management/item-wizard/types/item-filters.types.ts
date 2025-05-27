/**
 * @fileoverview Типи фільтрації та сортування предметів
 * @module domain/wizard/services/stage-3-item-management/item-wizard/types/item-filters
 */

import type { WizardOrderItem, WizardOrderItemFilters } from '../../../../schemas';

/**
 * Фільтри для пошуку предметів
 */
export type ItemFilters = WizardOrderItemFilters;

/**
 * Параметри сортування предметів
 */
export interface ItemSortOptions {
  field: keyof WizardOrderItem;
  direction: 'asc' | 'desc';
}
