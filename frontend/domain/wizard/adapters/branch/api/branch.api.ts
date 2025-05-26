/**
 * @fileoverview API функції для операцій з філіями
 * @module domain/wizard/adapters/branch/api
 */

import { BranchLocationsApiService } from '@/lib/api';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

import {
  mapBranchDTOToDomain,
  mapBranchArrayToDomain,
  mapBranchToCreateRequest,
  mapBranchToUpdateRequest,
} from '../mappers/branch.mapper';

import type {
  WizardBranch,
  WizardBranchCreateData,
  WizardBranchUpdateData,
  WizardBranchOperationResult,
} from '../types/branch-adapter.types';

/**
 * Отримання всіх філій
 */
export async function getAllBranches(): Promise<WizardBranchOperationResult<WizardBranch[]>> {
  try {
    const apiResponse = await BranchLocationsApiService.getAllBranchLocations({});

    // Перевіряємо, чи це масив чи одиночний об'єкт
    let branches: WizardBranch[];
    if (Array.isArray(apiResponse)) {
      branches = mapBranchArrayToDomain(apiResponse);
    } else {
      // Якщо API повертає одиночний об'єкт, обгортаємо в масив
      branches = [mapBranchDTOToDomain(apiResponse)];
    }

    return {
      success: true,
      data: branches,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати філії: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання філії за ID
 */
export async function getBranchById(
  id: string
): Promise<WizardBranchOperationResult<WizardBranch>> {
  try {
    const apiResponse = await BranchLocationsApiService.getBranchLocationById({ id });
    const branch = mapBranchDTOToDomain(apiResponse);

    return {
      success: true,
      data: branch,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати філію: ${error instanceof Error ? error.message : 'Невідома помилка'}`,
    };
  }
}

/**
 * Отримання філії за кодом
 */
export async function getBranchByCode(
  code: string
): Promise<WizardBranchOperationResult<WizardBranch>> {
  try {
    const apiResponse = await BranchLocationsApiService.getBranchLocationByCode({ code });
    const branch = mapBranchDTOToDomain(apiResponse);

    return {
      success: true,
      data: branch,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати філію: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання активних філій
 */
export async function getActiveBranches(): Promise<WizardBranchOperationResult<WizardBranch[]>> {
  try {
    const apiResponse = await BranchLocationsApiService.getAllBranchLocations({ active: true });

    // Перевіряємо, чи це масив чи одиночний об'єкт
    let branches: WizardBranch[];
    if (Array.isArray(apiResponse)) {
      branches = mapBranchArrayToDomain(apiResponse);
    } else {
      // Якщо API повертає одиночний об'єкт, обгортаємо в масив
      branches = [mapBranchDTOToDomain(apiResponse)];
    }

    return {
      success: true,
      data: branches,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати активні філії: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Створення нової філії
 */
export async function createBranch(
  branchData: WizardBranchCreateData
): Promise<WizardBranchOperationResult<WizardBranch>> {
  try {
    const apiRequest = mapBranchToCreateRequest(branchData);
    const apiResponse = await BranchLocationsApiService.createBranchLocation({
      requestBody: apiRequest,
    });
    const branch = mapBranchDTOToDomain(apiResponse);

    return {
      success: true,
      data: branch,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося створити філію: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Оновлення філії
 */
export async function updateBranch(
  id: string,
  branchData: WizardBranchUpdateData
): Promise<WizardBranchOperationResult<WizardBranch>> {
  try {
    const apiRequest = mapBranchToUpdateRequest(branchData);
    const apiResponse = await BranchLocationsApiService.updateBranchLocation({
      id,
      requestBody: apiRequest,
    });
    const branch = mapBranchDTOToDomain(apiResponse);

    return {
      success: true,
      data: branch,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося оновити філію: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Видалення філії
 */
export async function deleteBranch(id: string): Promise<WizardBranchOperationResult<void>> {
  try {
    await BranchLocationsApiService.deleteBranchLocation({ id });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося видалити філію: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Зміна статусу активності філії
 */
export async function setBranchActiveStatus(
  id: string,
  active: boolean
): Promise<WizardBranchOperationResult<WizardBranch>> {
  try {
    const apiResponse = await BranchLocationsApiService.setActiveStatus({ id, active });
    const branch = mapBranchDTOToDomain(apiResponse);

    return {
      success: true,
      data: branch,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося змінити статус філії: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
