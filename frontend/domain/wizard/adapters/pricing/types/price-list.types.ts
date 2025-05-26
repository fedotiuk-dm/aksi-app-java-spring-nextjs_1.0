/**
 * @fileoverview Типи для прайс-листа
 * @module domain/wizard/adapters/pricing/types/price-list
 */

/**
 * Елемент прайс-листа для wizard
 */
export interface WizardPriceListItem {
  id: string;
  categoryId: string;
  categoryCode: string;
  categoryName: string;
  itemNumber: string;
  name: string;
  unitOfMeasure: string;
  basePrice: number;
  isActive: boolean;
  description?: string;
  notes?: string;
}

/**
 * Параметри пошуку прайс-листа
 */
export interface WizardPriceListSearchParams {
  categoryCode?: string;
  searchTerm?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  unitOfMeasure?: string;
}

/**
 * Результат пошуку прайс-листа
 */
export interface WizardPriceListSearchResult {
  items: WizardPriceListItem[];
  totalCount: number;
  hasMore: boolean;
}
