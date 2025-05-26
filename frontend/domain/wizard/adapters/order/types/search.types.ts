/**
 * @fileoverview Типи для пошуку та фільтрації замовлень
 * @module domain/wizard/adapters/order/types/search
 */

import { WizardOrderStatus } from './base.types';
import { WizardOrder } from './entities.types';

/**
 * Параметри пошуку замовлень
 */
export interface WizardOrderSearchParams {
  readonly query?: string;
  readonly status?: WizardOrderStatus[];
  readonly clientId?: string;
  readonly branchId?: string;
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly page?: number;
  readonly size?: number;
  readonly sortBy?: string;
  readonly sortDirection?: 'ASC' | 'DESC';
}

/**
 * Результат пошуку замовлень з пагінацією
 */
export interface WizardOrderSearchResult {
  readonly orders: WizardOrder[];
  readonly totalElements: number;
  readonly totalPages: number;
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly hasPrevious: boolean;
  readonly hasNext: boolean;
}
