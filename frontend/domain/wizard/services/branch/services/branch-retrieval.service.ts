/**
 * @fileoverview Сервіс отримання філій
 * @module domain/wizard/services/branch/services/branch-retrieval
 */

import { OperationResultFactory } from '../../interfaces';

import type { OperationResult } from '../../interfaces';
import type { BranchDomain } from '../types';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    FETCH_FAILED: 'Помилка отримання філій',
    BRANCH_NOT_FOUND: 'Філію не знайдено',
    UNKNOWN: 'Невідома помилка',
  },
  CACHE_TTL: 15 * 60 * 1000, // 15 хвилин
} as const;

/**
 * Інтерфейс сервісу отримання філій
 */
export interface IBranchRetrievalService {
  getAllBranches(): Promise<OperationResult<BranchDomain[]>>;
  getActiveBranches(): Promise<OperationResult<BranchDomain[]>>;
  getBranchById(id: string): Promise<OperationResult<BranchDomain | null>>;
  getBranchesWithService(serviceId: string): Promise<OperationResult<BranchDomain[]>>;
  clearCache(): void;
}

/**
 * Сервіс отримання філій
 * Відповідальність: отримання, кешування та фільтрація філій
 */
export class BranchRetrievalService implements IBranchRetrievalService {
  public readonly name = 'BranchRetrievalService';
  public readonly version = '1.0.0';

  private branchesCache: { data: BranchDomain[]; timestamp: number } | null = null;

  /**
   * Отримання всіх філій
   */
  async getAllBranches(): Promise<OperationResult<BranchDomain[]>> {
    try {
      // Перевірка кешу
      if (this.branchesCache && Date.now() - this.branchesCache.timestamp < CONSTANTS.CACHE_TTL) {
        return OperationResultFactory.success(this.branchesCache.data);
      }

      // Адаптер викликається в хуках домену для отримання даних з API
      // Тимчасова заглушка
      const apiBranches: any[] = [];
      const domainBranches = apiBranches.map(this.convertToDomainBranch);

      // Оновлення кешу
      this.branchesCache = {
        data: domainBranches,
        timestamp: Date.now(),
      };

      return OperationResultFactory.success(domainBranches);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.FETCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання активних філій
   */
  async getActiveBranches(): Promise<OperationResult<BranchDomain[]>> {
    try {
      const allBranchesResult = await this.getAllBranches();
      if (!allBranchesResult.success || !allBranchesResult.data) {
        return OperationResultFactory.error(
          allBranchesResult.error || CONSTANTS.ERROR_MESSAGES.FETCH_FAILED
        );
      }

      const activeBranches = allBranchesResult.data.filter((branch) => branch.isActive);
      return OperationResultFactory.success(activeBranches);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.FETCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання філії за ID
   */
  async getBranchById(id: string): Promise<OperationResult<BranchDomain | null>> {
    try {
      // Адаптер викликається в хуках домену для отримання даних з API
      // Тимчасова заглушка
      const apiBranch: any = null;

      if (!apiBranch) {
        return OperationResultFactory.success(null);
      }

      const domainBranch = this.convertToDomainBranch(apiBranch);
      return OperationResultFactory.success(domainBranch);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.BRANCH_NOT_FOUND}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання філій з певною послугою
   */
  async getBranchesWithService(serviceId: string): Promise<OperationResult<BranchDomain[]>> {
    try {
      const allBranchesResult = await this.getActiveBranches();
      if (!allBranchesResult.success || !allBranchesResult.data) {
        return OperationResultFactory.error(
          allBranchesResult.error || CONSTANTS.ERROR_MESSAGES.FETCH_FAILED
        );
      }

      const branchesWithService = allBranchesResult.data.filter((branch) =>
        branch.services.some((service) => service.serviceId === serviceId && service.isAvailable)
      );

      return OperationResultFactory.success(branchesWithService);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.FETCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Очищення кешу
   */
  clearCache(): void {
    this.branchesCache = null;
  }

  /**
   * Конвертація API філії в доменний тип
   */
  private convertToDomainBranch(apiBranch: any): BranchDomain {
    return {
      id: apiBranch.id,
      code: apiBranch.code,
      name: apiBranch.name,
      address: apiBranch.address,
      phone: apiBranch.phone,
      email: apiBranch.email,
      isActive: apiBranch.isActive,
      isMainBranch: apiBranch.isMainBranch,
      coordinates: apiBranch.coordinates,
      workingHours: apiBranch.workingHours,
      services: apiBranch.services,
      createdAt: new Date(apiBranch.createdAt),
      updatedAt: new Date(apiBranch.updatedAt),
    };
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const branchRetrievalService = new BranchRetrievalService();
