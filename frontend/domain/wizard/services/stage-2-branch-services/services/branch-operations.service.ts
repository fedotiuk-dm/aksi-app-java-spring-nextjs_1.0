/**
 * @fileoverview Сервіс для операцій з філіями
 * @module domain/wizard/services/stage-2-branch-services/services/branch-operations
 */

import { BranchValidatorService } from './branch-validator.service';
import {
  createBranch as createBranchAdapter,
  updateBranch as updateBranchAdapter,
  deleteBranch as deleteBranchAdapter,
  setBranchActiveStatus,
} from '../../../adapters/branch';

import type {
  WizardBranch,
  WizardBranchCreateData,
  WizardBranchUpdateData,
} from '../../../schemas';
import type { BranchOperationResult, IBranchOperationsService } from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Сервіс для операцій з філіями (створення, оновлення, видалення)
 * @implements IBranchOperationsService
 */
export class BranchOperationsService implements IBranchOperationsService {
  private validatorService: BranchValidatorService;

  constructor() {
    this.validatorService = new BranchValidatorService();
  }

  /**
   * Створення нової філії
   * @param branchData Дані нової філії
   */
  async createBranch(
    branchData: WizardBranchCreateData
  ): Promise<BranchOperationResult<WizardBranch>> {
    try {
      // Валідуємо дані перед створенням
      const validationResult = this.validatorService.validateBranchData(branchData);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: `Неправильні дані філії: ${validationResult.errors.join(', ')}`,
        };
      }

      // Використовуємо адаптер для створення філії
      const adapterResult = await createBranchAdapter(branchData);

      if (!adapterResult.success || !adapterResult.data) {
        return {
          success: false,
          error: adapterResult.error || 'Не вдалося створити філію',
        };
      }

      return {
        success: true,
        data: adapterResult.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Оновлення існуючої філії
   * @param branchId Ідентифікатор філії
   * @param branchData Дані для оновлення
   */
  async updateBranch(
    branchId: string,
    branchData: WizardBranchUpdateData
  ): Promise<BranchOperationResult<WizardBranch>> {
    try {
      // Валідуємо дані перед оновленням
      const validationResult = this.validatorService.validateBranchData(branchData);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: `Неправильні дані філії: ${validationResult.errors.join(', ')}`,
        };
      }

      // Використовуємо адаптер для оновлення філії
      const adapterResult = await updateBranchAdapter(branchId, branchData);

      if (!adapterResult.success || !adapterResult.data) {
        return {
          success: false,
          error: adapterResult.error || 'Не вдалося оновити філію',
        };
      }

      return {
        success: true,
        data: adapterResult.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Видалення філії
   * @param branchId Ідентифікатор філії
   */
  async deleteBranch(branchId: string): Promise<BranchOperationResult<void>> {
    try {
      // Використовуємо адаптер для видалення філії
      const adapterResult = await deleteBranchAdapter(branchId);

      if (!adapterResult.success) {
        return {
          success: false,
          error: adapterResult.error || 'Не вдалося видалити філію',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Активація філії
   * @param branchId Ідентифікатор філії
   */
  async activateBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>> {
    return this.setActivationStatus(branchId, true);
  }

  /**
   * Деактивація філії
   * @param branchId Ідентифікатор філії
   */
  async deactivateBranch(branchId: string): Promise<BranchOperationResult<WizardBranch>> {
    return this.setActivationStatus(branchId, false);
  }

  /**
   * Зміна статусу активності філії
   * @private
   * @param branchId Ідентифікатор філії
   * @param active Новий статус активності
   */
  private async setActivationStatus(
    branchId: string,
    active: boolean
  ): Promise<BranchOperationResult<WizardBranch>> {
    try {
      // Використовуємо адаптер для зміни статусу філії
      const adapterResult = await setBranchActiveStatus(branchId, active);

      if (!adapterResult.success || !adapterResult.data) {
        return {
          success: false,
          error: adapterResult.error || 'Не вдалося змінити статус філії',
        };
      }

      return {
        success: true,
        data: adapterResult.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR,
      };
    }
  }
}

// Експортуємо екземпляр сервісу (Singleton)
export const branchOperationsService = new BranchOperationsService();
