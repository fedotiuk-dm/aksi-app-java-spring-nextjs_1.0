/**
 * @fileoverview Адаптер API операцій з філіями
 * @module domain/wizard/adapters/branch-adapters
 */

import { BranchLocationsApiService } from '@/lib/api';

import { BranchMappingAdapter } from './mapping.adapter';

import type { BranchCreateRequest, BranchUpdateRequest } from './mapping.adapter';
import type { Branch } from '../../types/wizard-step-states.types';

/**
 * Адаптер для API операцій з філіями
 *
 * Відповідальність:
 * - Виконання CRUD операцій через API
 * - Обробка помилок API
 * - Кешування результатів
 * - Валідація запитів
 */
export class BranchApiOperationsAdapter {
  /**
   * Отримує всі філії
   */
  static async getAllBranches(): Promise<Branch[]> {
    try {
      const apiResponse = await BranchLocationsApiService.getAllBranchLocations({});
      // API повертає одиночний об'єкт або масив, тому обгортаємо в масив якщо потрібно
      const apiBranches = Array.isArray(apiResponse) ? apiResponse : [apiResponse];
      return BranchMappingAdapter.branchesToDomain(apiBranches);
    } catch (error) {
      console.error('Помилка при отриманні всіх філій:', error);
      throw new Error('Не вдалося отримати список філій');
    }
  }

  /**
   * Отримує активні філії
   */
  static async getActiveBranches(): Promise<Branch[]> {
    try {
      const apiResponse = await BranchLocationsApiService.getAllBranchLocations({ active: true });
      // API повертає одиночний об'єкт або масив, тому обгортаємо в масив якщо потрібно
      const apiBranches = Array.isArray(apiResponse) ? apiResponse : [apiResponse];
      return BranchMappingAdapter.branchesToDomain(apiBranches);
    } catch (error) {
      console.error('Помилка при отриманні активних філій:', error);
      throw new Error('Не вдалося отримати список активних філій');
    }
  }

  /**
   * Отримує філію за ID
   */
  static async getBranchById(id: string): Promise<Branch | null> {
    try {
      const apiBranch = await BranchLocationsApiService.getBranchLocationById({ id });
      return BranchMappingAdapter.branchToDomain(apiBranch);
    } catch (error) {
      console.error(`Помилка при отриманні філії з ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Отримує філію за кодом
   */
  static async getBranchByCode(code: string): Promise<Branch | null> {
    try {
      const apiBranch = await BranchLocationsApiService.getBranchLocationByCode({ code });
      return BranchMappingAdapter.branchToDomain(apiBranch);
    } catch (error) {
      console.error(`Помилка при отриманні філії з кодом ${code}:`, error);
      return null;
    }
  }

  /**
   * Створює нову філію
   */
  static async createBranch(branchData: BranchCreateRequest): Promise<Branch> {
    try {
      // Валідація перед створенням
      this.validateCreateRequest(branchData);

      const apiRequest = BranchMappingAdapter.branchCreateRequestToApi(branchData);
      const createdBranch = await BranchLocationsApiService.createBranchLocation({
        requestBody: apiRequest,
      });

      return BranchMappingAdapter.branchToDomain(createdBranch);
    } catch (error) {
      console.error('Помилка при створенні філії:', error);
      throw new Error('Не вдалося створити філію');
    }
  }

  /**
   * Оновлює філію
   */
  static async updateBranch(id: string, branchData: BranchUpdateRequest): Promise<Branch> {
    try {
      // Валідація перед оновленням
      this.validateUpdateRequest(branchData);

      const apiRequest = BranchMappingAdapter.branchUpdateRequestToApi(branchData);
      const updatedBranch = await BranchLocationsApiService.updateBranchLocation({
        id,
        requestBody: apiRequest,
      });

      return BranchMappingAdapter.branchToDomain(updatedBranch);
    } catch (error) {
      console.error(`Помилка при оновленні філії ${id}:`, error);
      throw new Error('Не вдалося оновити філію');
    }
  }

  /**
   * Встановлює статус активності філії
   */
  static async setActiveStatus(id: string, active: boolean): Promise<Branch> {
    try {
      const updatedBranch = await BranchLocationsApiService.setActiveStatus({
        id,
        active,
      });

      return BranchMappingAdapter.branchToDomain(updatedBranch);
    } catch (error) {
      console.error(`Помилка при зміні статусу філії ${id}:`, error);
      throw new Error('Не вдалося змінити статус філії');
    }
  }

  /**
   * Видаляє філію
   */
  static async deleteBranch(id: string): Promise<void> {
    try {
      await BranchLocationsApiService.deleteBranchLocation({ id });
    } catch (error) {
      console.error(`Помилка при видаленні філії ${id}:`, error);
      throw new Error('Не вдалося видалити філію');
    }
  }

  /**
   * Спільна валідація для запитів створення та оновлення філії
   */
  private static validateBranchRequest(request: BranchCreateRequest | BranchUpdateRequest): void {
    const errors: string[] = [];

    if (!request.name?.trim()) {
      errors.push("Назва філії обов'язкова");
    }

    if (!request.address?.trim()) {
      errors.push("Адреса філії обов'язкова");
    }

    if (!request.code?.trim()) {
      errors.push("Код філії обов'язковий");
    } else if (!BranchMappingAdapter.validateBranchCode(request.code)) {
      errors.push('Код філії повинен містити 2-5 символів (великі літери та цифри)');
    }

    if (request.phone && !BranchMappingAdapter.validateBranchPhone(request.phone)) {
      errors.push('Неправильний формат номера телефону');
    }

    if (errors.length > 0) {
      throw new Error(`Помилки валідації: ${errors.join(', ')}`);
    }
  }

  /**
   * Валідує запит створення філії
   */
  private static validateCreateRequest(request: BranchCreateRequest): void {
    this.validateBranchRequest(request);
  }

  /**
   * Валідує запит оновлення філії
   */
  private static validateUpdateRequest(request: BranchUpdateRequest): void {
    this.validateBranchRequest(request);
  }

  /**
   * Нормалізує дані філії перед відправкою
   */
  static normalizeBranchData(branchData: Partial<BranchCreateRequest | BranchUpdateRequest>) {
    return {
      ...branchData,
      name: branchData.name?.trim(),
      address: branchData.address?.trim(),
      code: branchData.code ? BranchMappingAdapter.normalizeBranchCode(branchData.code) : undefined,
      phone: branchData.phone
        ? BranchMappingAdapter.normalizeBranchPhone(branchData.phone)
        : undefined,
    };
  }

  /**
   * Перевіряє чи існує філія з таким кодом
   */
  static async checkBranchCodeExists(code: string): Promise<boolean> {
    try {
      const branch = await this.getBranchByCode(code);
      return branch !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Пошук філій за назвою
   */
  static async searchBranchesByName(query: string): Promise<Branch[]> {
    try {
      const allBranches = await this.getAllBranches();
      const normalizedQuery = query.toLowerCase().trim();

      return allBranches.filter(
        (branch) =>
          branch.name.toLowerCase().includes(normalizedQuery) ||
          branch.code.toLowerCase().includes(normalizedQuery) ||
          branch.address.toLowerCase().includes(normalizedQuery)
      );
    } catch (error) {
      console.error('Помилка при пошуку філій:', error);
      return [];
    }
  }
}
