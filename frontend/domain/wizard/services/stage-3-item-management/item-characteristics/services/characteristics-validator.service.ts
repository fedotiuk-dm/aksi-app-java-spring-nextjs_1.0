/**
 * @fileoverview Сервіс для валідації характеристик предметів
 * @module domain/wizard/services/stage-3-item-management/item-characteristics/services/characteristics-validator
 */

import { ItemCharacteristicsService } from '@/domain/wizard/adapters/pricing/api';
import { ICharacteristicsValidatorService } from '../interfaces/item-characteristics.interfaces';
import type {
  CharacteristicsValidationResult,
  CharacteristicsOperationResult,
  ItemCharacteristics
} from '../types/item-characteristics.types';

const UNKNOWN_ERROR = 'Невідома помилка при валідації характеристик';

/**
 * Сервіс для валідації характеристик предметів
 * @implements ICharacteristicsValidatorService
 */
export class CharacteristicsValidatorService implements ICharacteristicsValidatorService {
  private adapter: ItemCharacteristicsService;

  constructor() {
    this.adapter = new ItemCharacteristicsService();
  }

  /**
   * Валідація даних характеристик
   * @param characteristics Характеристики для валідації
   * @param categoryId Ідентифікатор категорії
   */
  async validateCharacteristics(
    characteristics: ItemCharacteristics,
    categoryId: string
  ): Promise<CharacteristicsValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const fieldErrors: Record<string, string[]> = {};

    try {
      // Валідація матеріалу, якщо вказаний
      if (characteristics.materialId) {
        const materialResult = await this.isMaterialValidForCategory(
          characteristics.materialId,
          categoryId
        );

        if (!materialResult.success || !materialResult.data) {
          errors.push('Вибраний матеріал недоступний для цієї категорії');
          fieldErrors['materialId'] = ['Недійсний матеріал для вибраної категорії'];
        }
      }

      // Валідація кольору
      if (!characteristics.colorId && !characteristics.customColor) {
        errors.push('Колір не вказано');
        fieldErrors['colorId'] = ['Потрібно вказати колір'];
      }

      // Валідація наповнювача, якщо вказаний
      if (characteristics.fillerTypeId) {
        const fillerResult = await this.isFillerTypeValidForCategory(
          characteristics.fillerTypeId,
          categoryId
        );

        if (!fillerResult.success || !fillerResult.data) {
          errors.push('Вибраний тип наповнювача недоступний для цієї категорії');
          fieldErrors['fillerTypeId'] = ['Недійсний тип наповнювача для вибраної категорії'];
        }
      }

      // Валідація ступеня зносу, якщо вказаний
      if (characteristics.wearDegreeId) {
        const wearResult = await this.isWearDegreeValid(
          characteristics.wearDegreeId
        );

        if (!wearResult.success || !wearResult.data) {
          errors.push('Вибраний ступінь зносу недійсний');
          fieldErrors['wearDegreeId'] = ['Недійсний ступінь зносу'];
        }
      }

      // Додаємо попередження для високих ступенів зносу
      if (characteristics.wearDegreeId) {
        // Тут ми можемо перевірити, чи має ступінь зносу високе значення
        // Для цього потрібна логіка отримання об'єкта WearDegree за ID
        // Якщо відсоток зносу > 50%, додаємо попередження
        warnings.push('Високий ступінь зносу може вплинути на якість чистки');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        fieldErrors
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : UNKNOWN_ERROR],
        warnings: [],
        fieldErrors: {}
      };
    }
  }

  /**
   * Перевірка доступності матеріалу для категорії
   * @param materialId Ідентифікатор матеріалу
   * @param categoryId Ідентифікатор категорії
   */
  async isMaterialValidForCategory(
    materialId: string,
    categoryId: string
  ): Promise<CharacteristicsOperationResult<boolean>> {
    try {
      const result = await this.adapter.validateMaterialForCategory({
        materialId,
        categoryId
      });

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося перевірити матеріал: ${result.error}`
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Перевірка доступності типу наповнювача для категорії
   * @param fillerTypeId Ідентифікатор типу наповнювача
   * @param categoryId Ідентифікатор категорії
   */
  async isFillerTypeValidForCategory(
    fillerTypeId: string,
    categoryId: string
  ): Promise<CharacteristicsOperationResult<boolean>> {
    try {
      const result = await this.adapter.validateFillerTypeForCategory({
        fillerTypeId,
        categoryId
      });

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося перевірити тип наповнювача: ${result.error}`
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Перевірка валідності ступеня зносу
   * @param wearDegreeId Ідентифікатор ступеня зносу
   */
  async isWearDegreeValid(
    wearDegreeId: string
  ): Promise<CharacteristicsOperationResult<boolean>> {
    try {
      const result = await this.adapter.validateWearDegree({
        wearDegreeId
      });

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося перевірити ступінь зносу: ${result.error}`
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }
}

// Експортуємо єдиний екземпляр сервісу
export const characteristicsValidatorService = new CharacteristicsValidatorService();
