/**
 * @fileoverview Сервіс ініціалізації замовлення для першого етапу Order Wizard
 * @module domain/wizard/services/stage-1/order-initialization/services
 */

import { getAllBranches } from '../../../../adapters/branch';
import {
  validateUniqueLabel as validateUniqueLabelAdapter,
  checkUniqueLabelExists,
  initializeOrder as initializeOrderAdapter,
} from '../../../../adapters/order/api';
import { IOrderInitializationService } from '../interfaces/order-initialization.interfaces';
import {
  orderInitializationSchema,
  uniqueLabelSchema,
  type OrderInitializationData,
  type OrderBasicInfo,
  type Branch,
  type GenerateReceiptNumberRequest,
  type ValidateUniqueLabelRequest,
  type OrderInitializationResult,
} from '../types/order-initialization.types';

import type { OperationResult } from '../../../shared/types/base.types';

/**
 * Сервіс ініціалізації замовлення
 * Відповідальність: валідація міток, управління філіями, ініціалізація замовлення
 */
export class OrderInitializationService implements IOrderInitializationService {
  private readonly UNKNOWN_ERROR = 'Невідома помилка';

  /**
   * Генерація номера квитанції
   * Примітка: в актуальній версії номер квитанції генерується автоматично на бекенді
   * під час створення замовлення, але цей метод залишений для сумісності з інтерфейсом
   */
  async generateReceiptNumber(
    request?: GenerateReceiptNumberRequest
  ): Promise<OperationResult<string>> {
    try {
      // Генерація номера на основі дати та філії
      // Формат: YYYYMMDD-BRANCH-NNNN
      const date = request?.date || new Date();
      const branchId = request?.branchId || 'DEFAULT';

      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
      const branchCode = branchId.slice(0, 3).toUpperCase();
      const sequence = Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, '0');

      const receiptNumber = `${dateStr}-${branchCode}-${sequence}`;

      return {
        success: true,
        data: receiptNumber,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Валідація формату унікальної мітки
   */
  validateUniqueLabelFormat(label: string): OperationResult<boolean> {
    try {
      // Використовуємо Zod для валідації
      const result = uniqueLabelSchema.safeParse({ label });

      if (!result.success) {
        const errorMessages = result.error.errors.map((err) => err.message).join(', ');
        return {
          success: false,
          error: errorMessages,
        };
      }

      // Додаткова валідація з API адаптера
      const adapterValidation = validateUniqueLabelAdapter(label);

      if (!adapterValidation.isValid) {
        return {
          success: false,
          error: adapterValidation.error || 'Неприпустимий формат мітки',
        };
      }

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Перевірка унікальності мітки
   */
  async validateUniqueLabel(
    request: ValidateUniqueLabelRequest
  ): Promise<OperationResult<boolean>> {
    try {
      // Спочатку валідуємо формат
      const formatValidation = this.validateUniqueLabelFormat(request.label);
      if (!formatValidation.success) {
        return formatValidation;
      }

      // Потім перевіряємо унікальність через API
      const result = await checkUniqueLabelExists(request.label, request.excludeOrderId);

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Не вдалося перевірити унікальність мітки',
        };
      }

      // Якщо мітка існує, це означає, що вона НЕ є унікальною
      const isUnique = !result.data;

      return {
        success: true,
        data: isUnique,
        error: isUnique ? undefined : 'Мітка вже використовується в іншому замовленні',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Отримання списку філій
   */
  async loadBranches(): Promise<OperationResult<Branch[]>> {
    try {
      const result = await getAllBranches();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Не вдалося завантажити список філій',
        };
      }

      // Адаптуємо WizardBranch[] до Branch[]
      const adaptedBranches: Branch[] =
        result.data?.map((wizardBranch) => ({
          id: wizardBranch.id,
          name: wizardBranch.name,
          address: wizardBranch.address,
          phone: wizardBranch.phone || '',
          workingHours: '09:00-18:00', // Значення за замовчуванням
          isActive: wizardBranch.active,
        })) || [];

      return {
        success: true,
        data: adaptedBranches,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Валідація даних для ініціалізації замовлення
   */
  validateOrderInitializationData(
    data: Partial<OrderInitializationData>
  ): OperationResult<OrderInitializationData> & {
    isValid: boolean;
    validationErrors: Record<string, string>;
  } {
    try {
      // Використовуємо Zod для валідації
      const result = orderInitializationSchema.safeParse(data);

      if (!result.success) {
        const validationErrors: Record<string, string> = {};

        result.error.errors.forEach((err) => {
          const field = err.path[0] as string;
          validationErrors[field] = err.message;
        });

        return {
          success: false,
          isValid: false,
          error: 'Дані для ініціалізації замовлення містять помилки',
          validationErrors,
        };
      }

      return {
        success: true,
        isValid: true,
        data: result.data,
        validationErrors: {},
      };
    } catch (error) {
      return {
        success: false,
        isValid: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
        validationErrors: {},
      };
    }
  }

  /**
   * Ініціалізація нового замовлення
   */
  async initializeOrder(data: OrderInitializationData): Promise<OrderInitializationResult> {
    try {
      // Валідація даних
      const validationResult = this.validateOrderInitializationData(data);
      if (!validationResult.success) {
        return {
          success: false,
          error: validationResult.error,
        };
      }

      // Перевірка унікальності мітки
      const uniqueLabelResult = await this.validateUniqueLabel({
        label: data.uniqueLabel,
      });

      if (!uniqueLabelResult.success || !uniqueLabelResult.data) {
        return {
          success: false,
          error: uniqueLabelResult.error || 'Мітка вже використовується в іншому замовленні',
        };
      }

      // Ініціалізація замовлення через API
      const result = await initializeOrderAdapter(data.uniqueLabel, data.branchId);

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Не вдалося ініціалізувати замовлення',
        };
      }

      // Формуємо результат ініціалізації
      const orderBasicInfo: OrderBasicInfo = {
        receiptNumber: result.data?.receiptNumber || data.receiptNumber,
        uniqueLabel: data.uniqueLabel,
        branchId: data.branchId,
        createdAt: data.createdAt,
      };

      return {
        success: true,
        orderBasicInfo,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : this.UNKNOWN_ERROR,
      };
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const orderInitializationService = new OrderInitializationService();
