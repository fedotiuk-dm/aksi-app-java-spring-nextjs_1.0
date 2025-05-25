/**
 * @fileoverview Маппер для операцій зі знижками замовлень
 * @module domain/wizard/adapters/order
 */

import type { OrderDiscountRequest } from '@/lib/api';

/**
 * Доменні типи для операцій зі знижками
 */
export interface DiscountApiResponse {
  orderId: string;
  discountType: string;
  discountPercentage: number;
  discountAmount: number;
  appliedAt: string;
  description?: string;
}
export interface DiscountData {
  orderId: string;
  discountType: 'NO_DISCOUNT' | 'EVERCARD' | 'SOCIAL_MEDIA' | 'MILITARY' | 'CUSTOM';
  discountPercentage?: number;
  discountDescription?: string;
}

export interface DiscountResult {
  orderId: string;
  discountType: string;
  discountPercentage: number;
  discountAmount: number;
  appliedAt: string;
  description?: string;
}

/**
 * Перетворює доменні дані знижки у API формат
 */
export function mapDiscountDataToApi(domainData: DiscountData): OrderDiscountRequest {
  return {
    orderId: domainData.orderId,
    discountType: domainData.discountType as OrderDiscountRequest.discountType,
    discountPercentage: domainData.discountPercentage,
    discountDescription: domainData.discountDescription,
  };
}

/**
 * Перетворює API результат знижки у доменний тип
 */
export function mapDiscountResultFromApi(apiResult: DiscountApiResponse): DiscountResult {
  return {
    orderId: apiResult.orderId || '',
    discountType: apiResult.discountType || '',
    discountPercentage: apiResult.discountPercentage || 0,
    discountAmount: apiResult.discountAmount || 0,
    appliedAt: apiResult.appliedAt || new Date().toISOString(),
    description: apiResult.description,
  };
}
