/**
 * @fileoverview Маппер для операцій зі знижками замовлень
 * @module domain/wizard/adapters/order/mappers
 */

import { OrderDiscountRequest } from '@/lib/api';

import { WizardDiscountType } from '../types';

import type { WizardDiscountData, WizardDiscountResult } from '../types';

/**
 * Перетворює WizardDiscountType у API формат
 */
function mapDiscountTypeToApi(type: WizardDiscountType): OrderDiscountRequest.discountType {
  switch (type) {
    case WizardDiscountType.NONE:
      return OrderDiscountRequest.discountType.NO_DISCOUNT;
    case WizardDiscountType.EVERCARD:
      return OrderDiscountRequest.discountType.EVERCARD;
    case WizardDiscountType.SOCIAL_MEDIA:
      return OrderDiscountRequest.discountType.SOCIAL_MEDIA;
    case WizardDiscountType.MILITARY:
      return OrderDiscountRequest.discountType.MILITARY;
    case WizardDiscountType.CUSTOM:
      return OrderDiscountRequest.discountType.CUSTOM;
    default:
      return OrderDiscountRequest.discountType.NO_DISCOUNT;
  }
}

/**
 * Перетворює доменні дані знижки у API формат
 */
export function mapDiscountDataToApi(domainData: WizardDiscountData): OrderDiscountRequest {
  return {
    orderId: domainData.orderId,
    discountType: mapDiscountTypeToApi(domainData.type),
    discountPercentage: domainData.percentage ?? 0,
    discountDescription: domainData.description,
  };
}

/**
 * Інтерфейс для відповіді API про знижку
 */
interface DiscountApiResponse {
  discountAmount: number;
  finalAmount: number;
  discountDescription?: string;
  // Можливі додаткові поля
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Перетворює API результат знижки у доменний тип
 */
export function mapDiscountResultFromApi(apiResult: DiscountApiResponse): WizardDiscountResult {
  return {
    applied: (apiResult.discountAmount ?? 0) > 0,
    discountAmount: apiResult.discountAmount ?? 0,
    finalAmount: apiResult.finalAmount ?? 0,
    message: apiResult.discountDescription,
  };
}
