/**
 * @fileoverview API функції для операцій з категоріями послуг
 * @module domain/wizard/adapters/pricing
 */

import { PricingApiService } from '@/lib/api';

import {
  mapServiceCategoryDTOToDomain,
  mapServiceCategoryArrayToDomain,
} from './service-category.mapper';

import type { ServiceCategory } from '../../../pricing/types/pricing.types';

/**
 * Отримання всіх категорій послуг
 */
export async function getAllServiceCategories(): Promise<ServiceCategory[]> {
  try {
    const apiResponse = await PricingApiService.getAllCategories();
    return mapServiceCategoryArrayToDomain(apiResponse);
  } catch (error) {
    console.error('Помилка при отриманні категорій послуг:', error);
    throw new Error(`Не вдалося отримати категорії: ${error}`);
  }
}

/**
 * Отримання активних категорій послуг
 */
export async function getActiveServiceCategories(): Promise<ServiceCategory[]> {
  try {
    const apiResponse = await PricingApiService.getActiveCategories();
    return mapServiceCategoryArrayToDomain(apiResponse);
  } catch (error) {
    console.error('Помилка при отриманні активних категорій:', error);
    throw new Error(`Не вдалося отримати активні категорії: ${error}`);
  }
}

/**
 * Отримання категорії за ID
 */
export async function getServiceCategoryById(id: string): Promise<ServiceCategory> {
  try {
    const apiResponse = await PricingApiService.getCategoryById({ id });
    return mapServiceCategoryDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при отриманні категорії ${id}:`, error);
    throw new Error(`Не вдалося отримати категорію: ${error}`);
  }
}

/**
 * Отримання категорії за кодом
 */
export async function getServiceCategoryByCode(code: string): Promise<ServiceCategory> {
  try {
    const apiResponse = await PricingApiService.getCategoryByCode({ code });
    return mapServiceCategoryDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при отриманні категорії з кодом ${code}:`, error);
    throw new Error(`Не вдалося отримати категорію: ${error}`);
  }
}
