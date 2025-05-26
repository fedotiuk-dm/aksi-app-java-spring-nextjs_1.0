/**
 * @fileoverview Сервіс ініціалізації замовлення для першого етапу Order Wizard
 * @module domain/wizard/services/stage-1/order-initialization/services
 */

import { getAllBranches } from '../../../../adapters/branch';
import {
  orderInitializationSchema,
  uniqueLabelSchema,
  type OrderInitializationData,
  type OrderBasicInfo,
  type Branch,
  type GenerateReceiptNumberRequest,
  type ValidateUniqueLabelRequest,
} from '../types/order-initialization.types';

import type { OperationResult } from '../../../shared/types/base.types';

// Імпорт адаптерів

/**
 * Сервіс ініціалізації замовлення
 * Відповідальність: генерація номерів квитанцій, валідація міток, управління філіями
 */
export class OrderInitializationService {
  private readonly UNKNOWN_ERROR = 'Невідома помилка';

  /**
   * Генерація номера квитанції
   */
  async generateReceiptNumber(
    request?: GenerateReceiptNumberRequest
  ): Promise<OperationResult<string>> {
    try {
      // Генерація номера на основі дати та філії
      const date = request?.date || new Date();
      const branchId = request?.branchId || 'DEFAULT';

      // Формат: YYYYMMDD-BRANCH-NNNN
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
        error: `Помилка генерації номера квитанції: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Валідація унікальної мітки
   */
  async validateUniqueLabel(
    request: ValidateUniqueLabelRequest
  ): Promise<OperationResult<boolean>> {
    try {
      // Валідація формату мітки
      const validationResult = uniqueLabelSchema.safeParse({ label: request.label });
      if (!validationResult.success) {
        return {
          success: false,
          error: `Некоректний формат мітки: ${validationResult.error.issues.map((i) => i.message).join(', ')}`,
        };
      }

      // TODO: Тут буде перевірка унікальності через API
      // Поки що повертаємо true (мітка унікальна)
      const isUnique = true;

      return {
        success: true,
        data: isUnique,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка валідації унікальної мітки: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Завантаження списку філій
   */
  async loadBranches(): Promise<OperationResult<Branch[]>> {
    try {
      // Виклик адаптера для отримання філій
      const branches = await getAllBranches();

      // Трансформація до нашого типу
      const transformedBranches: Branch[] = branches.map((branch) => ({
        id: branch.id,
        name: branch.name,
        address: branch.address,
        phone: branch.phone || '',
        workingHours: '9:00-18:00', // За замовчуванням
        isActive: branch.active,
      }));

      return {
        success: true,
        data: transformedBranches,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка завантаження філій: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Отримання філії за ID
   */
  async getBranchById(id: string): Promise<OperationResult<Branch>> {
    try {
      if (!id || id.trim() === '') {
        return {
          success: false,
          error: 'ID філії не може бути порожнім',
        };
      }

      const branchesResult = await this.loadBranches();
      if (!branchesResult.success || !branchesResult.data) {
        return {
          success: false,
          error: branchesResult.error || 'Помилка завантаження філій',
        };
      }

      const branch = branchesResult.data.find((b) => b.id === id);
      if (!branch) {
        return {
          success: false,
          error: 'Філію не знайдено',
        };
      }

      return {
        success: true,
        data: branch,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка отримання філії: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Валідація даних ініціалізації замовлення
   */
  validateOrderInitialization(
    data: OrderInitializationData
  ): OperationResult<OrderInitializationData> {
    try {
      const validationResult = orderInitializationSchema.safeParse(data);

      if (!validationResult.success) {
        return {
          success: false,
          error: `Помилка валідації: ${validationResult.error.issues.map((i) => i.message).join(', ')}`,
        };
      }

      return {
        success: true,
        data: validationResult.data,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка валідації: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Ініціалізація замовлення з усіма перевірками
   */
  async initializeOrder(data: OrderInitializationData): Promise<OperationResult<OrderBasicInfo>> {
    try {
      // Валідація даних
      const validationResult = this.validateOrderInitialization(data);
      if (!validationResult.success) {
        return validationResult as OperationResult<OrderBasicInfo>;
      }

      // Перевірка унікальності мітки
      const uniqueLabelResult = await this.validateUniqueLabel({ label: data.uniqueLabel });
      if (!uniqueLabelResult.success || !uniqueLabelResult.data) {
        return {
          success: false,
          error: uniqueLabelResult.error || 'Мітка не є унікальною',
        };
      }

      // Перевірка існування філії
      const branchResult = await this.getBranchById(data.branchId);
      if (!branchResult.success) {
        return {
          success: false,
          error: branchResult.error || 'Філію не знайдено',
        };
      }

      // Створення базової інформації замовлення
      const orderBasicInfo: OrderBasicInfo = {
        receiptNumber: data.receiptNumber,
        uniqueLabel: data.uniqueLabel,
        branchId: data.branchId,
        branch: branchResult.data,
        createdAt: data.createdAt,
      };

      return {
        success: true,
        data: orderBasicInfo,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка ініціалізації замовлення: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Сканування унікальної мітки (заглушка для майбутньої реалізації)
   */
  async scanUniqueLabel(): Promise<OperationResult<string>> {
    try {
      // TODO: Інтеграція зі сканером QR/штрих-кодів
      return {
        success: false,
        error: 'Функція сканування ще не реалізована',
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка сканування: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const orderInitializationService = new OrderInitializationService();
