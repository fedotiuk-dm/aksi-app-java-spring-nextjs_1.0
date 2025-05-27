/**
 * @fileoverview Сервіс для роботи з джерелами інформації про хімчистку
 * @module domain/wizard/services/stage-1/client-management/services
 */

import { InformationSource } from '../types/client-domain.types';

import type { OperationResult } from '../interfaces/client-management.interfaces';

/**
 * Сервіс для управління джерелами інформації
 */
export class InformationSourceService {
  private readonly UNKNOWN_ERROR = 'Невідома помилка';

  /**
   * Отримання всіх доступних джерел інформації
   */
  getAvailableInformationSources(): OperationResult<
    Array<{ value: InformationSource; label: string; requiresDetails: boolean }>
  > {
    try {
      const sources = [
        {
          value: InformationSource.INSTAGRAM,
          label: 'Інстаграм',
          requiresDetails: false,
        },
        {
          value: InformationSource.GOOGLE,
          label: 'Google',
          requiresDetails: false,
        },
        {
          value: InformationSource.RECOMMENDATIONS,
          label: 'Рекомендації',
          requiresDetails: false,
        },
        {
          value: InformationSource.OTHER,
          label: 'Інше',
          requiresDetails: true,
        },
      ];

      return {
        success: true,
        data: sources,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Валідація джерела інформації та додаткових деталей
   */
  validateInformationSource(
    source: InformationSource,
    sourceDetails?: string
  ): OperationResult<{ source: InformationSource; sourceDetails?: string }> {
    try {
      // Перевіряємо, що джерело валідне
      const validSources = Object.values(InformationSource);
      if (!validSources.includes(source)) {
        return {
          success: false,
          error: `Неправильне джерело інформації: ${source}`,
        };
      }

      // Якщо джерело "OTHER", перевіряємо наявність деталей
      if (source === InformationSource.OTHER) {
        if (!sourceDetails || sourceDetails.trim().length === 0) {
          return {
            success: false,
            error: 'Необхідно вказати деталі для джерела "Інше"',
          };
        }

        if (sourceDetails.trim().length > 100) {
          return {
            success: false,
            error: 'Опис джерела не може перевищувати 100 символів',
          };
        }
      }

      return {
        success: true,
        data: {
          source,
          sourceDetails: source === InformationSource.OTHER ? sourceDetails?.trim() : undefined,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Перетворення джерела інформації для API
   */
  transformInformationSourceForAPI(
    source: InformationSource
  ): OperationResult<'INSTAGRAM' | 'GOOGLE' | 'RECOMMENDATION' | 'OTHER'> {
    try {
      switch (source) {
        case InformationSource.INSTAGRAM:
          return { success: true, data: 'INSTAGRAM' };
        case InformationSource.GOOGLE:
          return { success: true, data: 'GOOGLE' };
        case InformationSource.RECOMMENDATIONS:
          return { success: true, data: 'RECOMMENDATION' };
        case InformationSource.OTHER:
          return { success: true, data: 'OTHER' };
        default:
          return {
            success: false,
            error: `Непідтримуване джерело інформації: ${source}`,
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Перетворення джерела інформації з API
   */
  transformInformationSourceFromAPI(
    apiSource: 'INSTAGRAM' | 'GOOGLE' | 'RECOMMENDATION' | 'OTHER'
  ): OperationResult<InformationSource> {
    try {
      switch (apiSource) {
        case 'INSTAGRAM':
          return { success: true, data: InformationSource.INSTAGRAM };
        case 'GOOGLE':
          return { success: true, data: InformationSource.GOOGLE };
        case 'RECOMMENDATION':
          return { success: true, data: InformationSource.RECOMMENDATIONS };
        case 'OTHER':
          return { success: true, data: InformationSource.OTHER };
        default:
          return {
            success: false,
            error: `Непідтримуване API джерело інформації: ${apiSource}`,
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Отримання статистики по джерелах (для аналітики)
   */
  async getSourceStatistics(): Promise<OperationResult<Record<InformationSource, number>>> {
    try {
      // TODO: Реалізувати через API для отримання статистики
      const mockStatistics: Record<InformationSource, number> = {
        [InformationSource.INSTAGRAM]: 45,
        [InformationSource.GOOGLE]: 30,
        [InformationSource.RECOMMENDATIONS]: 20,
        [InformationSource.OTHER]: 5,
      };

      return {
        success: true,
        data: mockStatistics,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Перевірка чи потребує джерело додаткових деталей
   */
  requiresDetails(source: InformationSource): boolean {
    return source === InformationSource.OTHER;
  }
}

// Експорт екземпляра сервісу (Singleton)
export const informationSourceService = new InformationSourceService();
