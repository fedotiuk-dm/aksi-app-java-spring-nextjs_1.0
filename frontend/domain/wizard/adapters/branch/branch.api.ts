/**
 * @fileoverview API функції для операцій з філіями
 * @module domain/wizard/adapters/branch
 */

import { BranchLocationsApiService } from '@/lib/api';

import {
  mapBranchDTOToDomain,
  mapBranchArrayToDomain,
  mapBranchToCreateRequest,
  mapBranchToUpdateRequest,
} from './branch.mapper';

import type { Branch } from '../../types';

/**
 * Отримання всіх філій
 * УВАГА: API повертає BranchLocationDTO, а не масив - можлива помилка в OpenAPI специфікації
 */
export async function getAllBranches(): Promise<Branch[]> {
  try {
    const apiResponse = await BranchLocationsApiService.getAllBranchLocations({});

    // Перевіряємо, чи це масив чи одиночний об'єкт
    if (Array.isArray(apiResponse)) {
      return mapBranchArrayToDomain(apiResponse);
    } else {
      // Якщо API повертає одиночний об'єкт, обгортаємо в масив
      return [mapBranchDTOToDomain(apiResponse)];
    }
  } catch (error) {
    console.error('Помилка при отриманні всіх філій:', error);
    throw new Error(`Не вдалося отримати філії: ${error}`);
  }
}

/**
 * Отримання філії за ID
 */
export async function getBranchById(id: string): Promise<Branch> {
  try {
    const apiResponse = await BranchLocationsApiService.getBranchLocationById({ id });
    return mapBranchDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при отриманні філії ${id}:`, error);
    throw new Error(`Не вдалося отримати філію: ${error}`);
  }
}

/**
 * Створення нової філії
 */
export async function createBranch(branchData: Partial<Branch>): Promise<Branch> {
  try {
    const apiRequest = mapBranchToCreateRequest(branchData);
    const apiResponse = await BranchLocationsApiService.createBranchLocation({
      requestBody: apiRequest,
    });
    return mapBranchDTOToDomain(apiResponse);
  } catch (error) {
    console.error('Помилка при створенні філії:', error);
    throw new Error(`Не вдалося створити філію: ${error}`);
  }
}

/**
 * Оновлення філії
 */
export async function updateBranch(id: string, branchData: Partial<Branch>): Promise<Branch> {
  try {
    const apiRequest = mapBranchToUpdateRequest(branchData);
    const apiResponse = await BranchLocationsApiService.updateBranchLocation({
      id,
      requestBody: apiRequest,
    });
    return mapBranchDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при оновленні філії ${id}:`, error);
    throw new Error(`Не вдалося оновити філію: ${error}`);
  }
}

/**
 * Видалення філії
 */
export async function deleteBranch(id: string): Promise<void> {
  try {
    await BranchLocationsApiService.deleteBranchLocation({ id });
  } catch (error) {
    console.error(`Помилка при видаленні філії ${id}:`, error);
    throw new Error(`Не вдалося видалити філію: ${error}`);
  }
}

/**
 * Отримання активних філій
 */
export async function getActiveBranches(): Promise<Branch[]> {
  try {
    const apiResponse = await BranchLocationsApiService.getAllBranchLocations({ active: true });

    // Перевіряємо, чи це масив чи одиночний об'єкт
    if (Array.isArray(apiResponse)) {
      return mapBranchArrayToDomain(apiResponse);
    } else {
      // Якщо API повертає одиночний об'єкт, обгортаємо в масив
      return [mapBranchDTOToDomain(apiResponse)];
    }
  } catch (error) {
    console.error('Помилка при отриманні активних філій:', error);
    throw new Error(`Не вдалося отримати активні філії: ${error}`);
  }
}

/**
 * Отримання філії за кодом
 */
export async function getBranchByCode(code: string): Promise<Branch> {
  try {
    const apiResponse = await BranchLocationsApiService.getBranchLocationByCode({ code });
    return mapBranchDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при отриманні філії за кодом ${code}:`, error);
    throw new Error(`Не вдалося отримати філію: ${error}`);
  }
}

/**
 * Зміна статусу активності філії
 */
export async function setBranchActiveStatus(id: string, active: boolean): Promise<Branch> {
  try {
    const apiResponse = await BranchLocationsApiService.setActiveStatus({ id, active });
    return mapBranchDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при зміні статусу філії ${id}:`, error);
    throw new Error(`Не вдалося змінити статус філії: ${error}`);
  }
}
