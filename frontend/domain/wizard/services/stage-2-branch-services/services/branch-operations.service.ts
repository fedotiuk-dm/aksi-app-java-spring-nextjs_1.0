/**
 * @fileoverview Сервіс для операцій з філіями
 * @module domain/wizard/services/stage-2-branch-services/services/branch-operations
 */

import { BranchValidatorService } from './branch-validator.service';
import {
  createBranch,
  updateBranch,
  deleteBranch,
  setBranchActiveStatus
} from '../../../adapters/branch/api/branch.api';

import type {
  WizardBranch,
  WizardBranchCreateData,
  WizardBranchUpdateData
} from '../../../adapters/branch';
import type { BranchOperationResult, IBranchOperationsService } from '../types/branch-service.types';

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
  async createBranch(branchData: WizardBranchCreateData): Promise<BranchOperationResult<WizardBranch>> {
    try {
      // Валідуємо дані перед створенням
      const validationResult = this.validatorService.validateBranchData(branchData);
      if (!validationResult.valid) {
        return {
          success: false,
          error: `Неправильні дані філії: ${Object.values(validationResult.errors).join(', ')}`
        };
      }

      return await createBranch(branchData);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
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
      if (!validationResult.valid) {
        return {
          success: false,
          error: `Неправильні дані філії: ${Object.values(validationResult.errors).join(', ')}`
        };
      }

      return await updateBranch(branchId, branchData);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Видалення філії
   * @param branchId Ідентифікатор філії
   */
  async deleteBranch(branchId: string): Promise<BranchOperationResult<void>> {
    try {
      return await deleteBranch(branchId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
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
      return await setBranchActiveStatus(branchId, active);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }
}
