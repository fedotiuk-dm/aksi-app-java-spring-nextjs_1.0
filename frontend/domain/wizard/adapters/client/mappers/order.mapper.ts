/**
 * @fileoverview Маппер для замовлень клієнтів
 * @module domain/wizard/adapters/client/mappers
 */

import { OrderSummaryDTO } from '@/lib/api';

import { ClientOrderSummary } from '../types';

/**
 * Перетворює OrderSummaryDTO у ClientOrderSummary
 */
export function mapClientOrderSummaryFromDTO(apiOrder: OrderSummaryDTO): ClientOrderSummary {
  return {
    id: apiOrder.id || '',
    receiptNumber: apiOrder.receiptNumber || '',
    totalAmount: apiOrder.totalAmount || 0,
    status: apiOrder.status || '',
    createdAt: apiOrder.createdAt || new Date().toISOString(),
    completedAt: apiOrder.completionDate,
  };
}
