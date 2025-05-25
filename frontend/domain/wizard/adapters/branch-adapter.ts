/**
 * @fileoverview Адаптер філій API → Domain
 * @module domain/wizard/adapters
 */

// === ІМПОРТИ ЗГЕНЕРОВАНИХ API ТИПІВ ===
import { BranchLocationsApiService } from '@/lib/api';

import type { Branch } from '../types';
import type {
  BranchLocationDTO,
  BranchLocationCreateRequest,
  BranchLocationUpdateRequest,
} from '@/lib/api';

// === ІМПОРТИ API СЕРВІСІВ ===

// === ІМПОРТИ ДОМЕННИХ ТИПІВ ===

/**
 * Адаптер для перетворення API типів філій у доменні типи
 */
export class BranchAdapter {
  /**
   * Перетворює згенерований BranchLocationDTO у доменний Branch
   */
  static toDomain(apiBranch: BranchLocationDTO): Branch {
    return {
      id: apiBranch.id || '',
      name: apiBranch.name,
      address: apiBranch.address,
      phone: apiBranch.phone || undefined,
      code: apiBranch.code,
      active: apiBranch.active !== false,
      createdAt: apiBranch.createdAt || new Date().toISOString(),
      updatedAt: apiBranch.updatedAt || new Date().toISOString(),
    };
  }

  /**
   * Спільна логіка для перетворення доменного типу в API запит
   */
  private static toApiRequest(domainBranch: Partial<Branch>) {
    return {
      name: domainBranch.name || '',
      address: domainBranch.address || '',
      phone: domainBranch.phone,
      code: domainBranch.code || '',
    };
  }

  /**
   * Перетворює доменний тип у BranchLocationCreateRequest для створення філії
   */
  static toCreateRequest(domainBranch: Partial<Branch>): BranchLocationCreateRequest {
    return this.toApiRequest(domainBranch);
  }

  /**
   * Перетворює доменний тип у BranchLocationUpdateRequest для оновлення філії
   */
  static toUpdateRequest(domainBranch: Partial<Branch>): BranchLocationUpdateRequest {
    return this.toApiRequest(domainBranch);
  }

  // === НОВІ API МЕТОДИ (КРОК 1) ===

  /**
   * Отримання всіх філій через API
   */
  static async getAllBranches(activeOnly: boolean = true): Promise<Branch[]> {
    const apiResponse = await BranchLocationsApiService.getAllBranchLocations({
      active: activeOnly,
    });

    // API повертає BranchLocationDTO, але як одиночний об'єкт, а не масив
    // Потрібно перевірити структуру відповіді
    if (Array.isArray(apiResponse)) {
      return apiResponse.map(this.toDomain);
    } else {
      // Якщо API повертає одиночний об'єкт, обгортаємо в масив
      return [this.toDomain(apiResponse)];
    }
  }

  /**
   * Отримання філії за ID через API
   */
  static async getById(id: string): Promise<Branch> {
    const apiResponse = await BranchLocationsApiService.getBranchLocationById({ id });
    return this.toDomain(apiResponse);
  }

  /**
   * Отримання філії за кодом через API
   */
  static async getByCode(code: string): Promise<Branch> {
    const apiResponse = await BranchLocationsApiService.getBranchLocationByCode({ code });
    return this.toDomain(apiResponse);
  }

  /**
   * Створення нової філії через API
   */
  static async createBranch(domainData: Partial<Branch>): Promise<Branch> {
    const createRequest = this.toCreateRequest(domainData);
    const apiResponse = await BranchLocationsApiService.createBranchLocation({
      requestBody: createRequest,
    });

    return this.toDomain(apiResponse);
  }

  /**
   * Оновлення існуючої філії через API
   */
  static async updateBranch(id: string, domainData: Partial<Branch>): Promise<Branch> {
    const updateRequest = this.toUpdateRequest(domainData);
    const apiResponse = await BranchLocationsApiService.updateBranchLocation({
      id,
      requestBody: updateRequest,
    });

    return this.toDomain(apiResponse);
  }

  /**
   * Видалення філії через API
   */
  static async deleteBranch(id: string): Promise<void> {
    await BranchLocationsApiService.deleteBranchLocation({ id });
  }

  /**
   * Зміна статусу активності філії через API
   */
  static async setActiveStatus(id: string, active: boolean): Promise<Branch> {
    const apiResponse = await BranchLocationsApiService.setActiveStatus({ id, active });
    return this.toDomain(apiResponse);
  }
}
