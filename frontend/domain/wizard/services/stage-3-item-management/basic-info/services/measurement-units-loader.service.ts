/**
 * @fileoverview Сервіс завантаження одиниць виміру
 * @module domain/wizard/services/stage-3-item-management/basic-info/services/measurement-units-loader
 */

import { MeasurementUnit } from '../types/service-categories.types';

import type { BasicInfoOperationResult } from '../types';
import type { MeasurementUnitInfo } from '../types/service-categories.types';

/**
 * Сервіс для завантаження одиниць виміру
 */
export class MeasurementUnitsLoaderService {
  /**
   * Завантаження всіх доступних одиниць виміру
   */
  async loadMeasurementUnits(): Promise<BasicInfoOperationResult<MeasurementUnitInfo[]>> {
    try {
      const units = this.getStaticMeasurementUnits();
      return { success: true, data: units };
    } catch (error) {
      return this.handleError(error, 'Помилка завантаження одиниць виміру');
    }
  }

  /**
   * Отримання одиниці виміру за замовчуванням для категорії
   */
  getDefaultUnitForCategory(categoryId: string): MeasurementUnit {
    // Для прання білизни - кілограми, для всього іншого - штуки
    return categoryId === 'laundry' ? MeasurementUnit.KILOGRAMS : MeasurementUnit.PIECES;
  }

  /**
   * Отримання інформації про конкретну одиницю виміру
   */
  getMeasurementUnitInfo(unit: MeasurementUnit): MeasurementUnitInfo | null {
    const units = this.getStaticMeasurementUnits();
    return units.find((u) => u.unit === unit) || null;
  }

  /**
   * Приватні методи
   */
  private getStaticMeasurementUnits(): MeasurementUnitInfo[] {
    return [
      {
        unit: MeasurementUnit.PIECES,
        name: 'Штуки',
        abbreviation: 'шт',
      },
      {
        unit: MeasurementUnit.KILOGRAMS,
        name: 'Кілограми',
        abbreviation: 'кг',
      },
    ];
  }

  private handleError<T>(error: unknown, defaultMessage: string): BasicInfoOperationResult<T> {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    console.error('Помилка роботи з одиницями виміру:', error);
    return { success: false, error: errorMessage };
  }
}

// Експортуємо singleton екземпляр
export const measurementUnitsLoaderService = new MeasurementUnitsLoaderService();
