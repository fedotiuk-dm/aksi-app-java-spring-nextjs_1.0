/**
 * Основний сервіс для управління замовленнями
 * Містить CRUD операції та бізнес-логіку
 */

import { OrderStatus, ExpediteType, DiscountType } from '../types';
import { CompletionCalculator } from '../utils/completion.calculator';
import { FinancialAdapter } from '../utils/financial.adapter';
import { OrderUtils } from '../utils/order.utils';
import { OrderValidator } from '../utils/order.validator';
import { PriceCalculator } from '../utils/price.calculator';

import type {
  Order,
  OrderItem,
  OrderOperationResult,
  OrderSearchParams,
  OrderSearchResult,
  OrderFinancials,
  OrderSummary,
} from '../types';

export class OrderService {
  /**
   * Створює нове замовлення
   */
  static createOrder(
    clientId: string,
    branchLocationId: string,
    tagNumber?: string
  ): OrderOperationResult {
    try {
      const receiptNumber = OrderUtils.generateReceiptNumber();
      const generatedTagNumber = tagNumber || OrderUtils.generateTagNumber();

      const order: Order = {
        receiptNumber,
        tagNumber: generatedTagNumber,
        client: { id: clientId } as any, // Буде заповнено з API
        branchLocation: { id: branchLocationId } as any, // Буде заповнено з API
        status: OrderStatus.DRAFT,
        createdDate: new Date(),
        items: [],
        totalAmount: 0,
        finalAmount: 0,
        prepaymentAmount: 0,
        balanceAmount: 0,
        expediteType: ExpediteType.STANDARD,
        isEditable: true,
        canBeCancelled: true,
        progressPercentage: 0,
      };

      const validation = OrderValidator.validateOrder(order);
      if (!validation.success) {
        return validation;
      }

      return {
        order,
        success: true,
        errors: null,
      };
    } catch (error) {
      return {
        order: null,
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Помилка створення замовлення',
        },
      };
    }
  }

  /**
   * Оновлює замовлення
   */
  static updateOrder(order: Order): OrderOperationResult {
    try {
      // Перевіряємо чи можна редагувати
      if (!OrderUtils.canEditOrder(order)) {
        return {
          order: null,
          success: false,
          errors: {
            status: 'Замовлення не може бути відредаговане в поточному статусі',
          },
        };
      }

      // Перераховуємо фінанси
      const updatedOrder = this.recalculateOrderFinancials(order);

      // Оновлюємо доменні властивості
      updatedOrder.updatedDate = new Date();
      updatedOrder.progressPercentage = OrderUtils.calculateOrderProgress(updatedOrder);
      updatedOrder.isEditable = OrderUtils.canEditOrder(updatedOrder);
      updatedOrder.canBeCancelled = OrderUtils.canCancelOrder(updatedOrder);
      updatedOrder.canBeCompleted = OrderUtils.canCompleteOrder(updatedOrder);

      // Валідуємо
      const validation = OrderValidator.validateOrder(updatedOrder);
      if (!validation.success) {
        return validation;
      }

      return {
        order: updatedOrder,
        success: true,
        errors: null,
      };
    } catch (error) {
      return {
        order: null,
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Помилка оновлення замовлення',
        },
      };
    }
  }

  /**
   * Додає предмет до замовлення
   */
  static addItemToOrder(order: Order, item: OrderItem): OrderOperationResult {
    try {
      if (!OrderUtils.canEditOrder(order)) {
        return {
          order: null,
          success: false,
          errors: {
            status: 'Неможливо додати предмет - замовлення не може бути відредаговане',
          },
        };
      }

      // Розраховуємо ціну предмета
      const priceCalculation = PriceCalculator.calculateItemWithModifiers(item);
      const updatedItem: OrderItem = {
        ...item,
        calculatedPrice: priceCalculation.finalPrice,
        totalPrice: priceCalculation.finalPrice,
        discountApplied: priceCalculation.discountAmount,
        modifiersApplied: priceCalculation.modifiers.map((m) => m.id),
        isComplete: false,
      };

      // Додаємо предмет
      const updatedOrder: Order = {
        ...order,
        items: [...(order.items || []), updatedItem],
        itemsCount: (order.items || []).length + 1,
      };

      return this.updateOrder(updatedOrder);
    } catch (error) {
      return {
        order: null,
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Помилка додавання предмета',
        },
      };
    }
  }

  /**
   * Видаляє предмет з замовлення
   */
  static removeItemFromOrder(order: Order, itemId: string): OrderOperationResult {
    try {
      if (!OrderUtils.canEditOrder(order)) {
        return {
          order: null,
          success: false,
          errors: {
            status: 'Неможливо видалити предмет - замовлення не може бути відредаговане',
          },
        };
      }

      const updatedOrder: Order = {
        ...order,
        items: (order.items || []).filter((item) => item.id !== itemId),
        itemsCount: Math.max(0, (order.items || []).length - 1),
      };

      return this.updateOrder(updatedOrder);
    } catch (error) {
      return {
        order: null,
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Помилка видалення предмета',
        },
      };
    }
  }

  /**
   * Змінює статус замовлення
   */
  static changeOrderStatus(order: Order, newStatus: OrderStatus): OrderOperationResult {
    try {
      // Перевіряємо можливість переходу
      const transition = OrderValidator.validateStatusTransition(order.status, newStatus);
      if (!transition.allowed) {
        return {
          order: null,
          success: false,
          errors: {
            status: transition.reason || 'Неможливо змінити статус',
          },
        };
      }

      const updatedOrder: Order = {
        ...order,
        status: newStatus,
        updatedDate: new Date(),
      };

      // Встановлюємо спеціальні дати
      if (newStatus === OrderStatus.COMPLETED && !order.completedDate) {
        updatedOrder.completedDate = new Date();
      }

      return this.updateOrder(updatedOrder);
    } catch (error) {
      return {
        order: null,
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Помилка зміни статусу',
        },
      };
    }
  }

  /**
   * Застосовує знижку до замовлення
   */
  static applyDiscountToOrder(
    order: Order,
    discountType: DiscountType,
    discountPercentage: number
  ): OrderOperationResult {
    try {
      // Валідуємо знижку
      const validation = OrderValidator.validateDiscount(
        discountType,
        discountPercentage,
        order.items || []
      );

      if (!validation.valid) {
        return {
          order: null,
          success: false,
          errors: {
            general: validation.errors.join(', '),
          },
        };
      }

      // Розраховуємо нову фінансову інформацію
      const financials = PriceCalculator.calculateFinalAmount(
        order.items || [],
        discountType,
        discountPercentage,
        order.expediteType || ExpediteType.STANDARD,
        order.prepaymentAmount || 0
      );

      const updatedOrder: Order = {
        ...order,
        totalAmount: financials.totalAmount,
        discountAmount: financials.discountAmount,
        finalAmount: financials.totalAmount,
        balanceAmount: financials.balanceAmount,
      };

      return this.updateOrder(updatedOrder);
    } catch (error) {
      return {
        order: null,
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Помилка застосування знижки',
        },
      };
    }
  }

  /**
   * Розраховує дату завершення замовлення
   */
  static calculateOrderCompletion(order: Order): Date {
    const completion = CompletionCalculator.calculateCompletion({
      items: order.items || [],
      expediteType: order.expediteType || ExpediteType.STANDARD,
      startDate: order.createdDate || new Date(),
    });
    return completion.expectedCompletionDate;
  }

  /**
   * Пошук замовлень
   */
  static searchOrders(orders: Order[], params: OrderSearchParams): OrderSearchResult {
    // Фільтруємо
    let filteredOrders = OrderUtils.filterOrders(orders, {
      status: params.status,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      branchId: params.branchId,
      clientId: params.clientId,
      keyword: params.keyword,
      minAmount: params.minAmount,
      maxAmount: params.maxAmount,
    });

    // Додаткові фільтри
    if (params.hasItems !== undefined) {
      filteredOrders = filteredOrders.filter((order) =>
        params.hasItems ? (order.items || []).length > 0 : (order.items || []).length === 0
      );
    }

    if (params.expediteType) {
      filteredOrders = filteredOrders.filter((order) => order.expediteType === params.expediteType);
    }

    // Статистика
    const stats = OrderUtils.calculateOrderStatistics(filteredOrders);

    // Створюємо правильні OrderSummary об'єкти
    const summaries = filteredOrders.map(
      (order): OrderSummary => ({
        id: order.id,
        receiptNumber: order.receiptNumber,
        status: order.status,
        totalAmount: order.finalAmount,
        createdAt: order.createdDate,
        completionDate: order.expectedCompletionDate,
        itemCount: (order.items || []).length,
        clientName: order.client?.lastName
          ? `${order.client.lastName} ${order.client.firstName || ''}`.trim()
          : order.client?.phone || 'Невідомий клієнт',
        branchName: order.branchLocation?.name || 'Невідома філія',
      })
    );

    return {
      orders: filteredOrders,
      summaries,
      totalCount: orders.length,
      filteredCount: filteredOrders.length,
      hasMore: false, // Для пагінації в майбутньому
      stats: {
        byStatus: stats.byStatus,
        byBranch: {},
        totalAmount: stats.totalAmount,
        averageAmount: stats.averageAmount,
        completionRate: 0, // Буде розраховано в майбутньому
      },
    };
  }

  /**
   * Перераховує фінансову інформацію замовлення
   */
  private static recalculateOrderFinancials(order: Order): Order {
    if (!order.items || order.items.length === 0) {
      return {
        ...order,
        totalAmount: 0,
        finalAmount: 0,
        balanceAmount: order.prepaymentAmount ? -order.prepaymentAmount : 0,
      };
    }

    // Розраховуємо загальну суму
    const financials = PriceCalculator.calculateFinalAmount(
      order.items,
      DiscountType.NONE, // Тут буде реальний тип знижки
      0, // Тут буде реальний відсоток
      order.expediteType || ExpediteType.STANDARD,
      order.prepaymentAmount || 0
    );

    // Розраховуємо дату завершення
    const expectedCompletionDate = this.calculateOrderCompletion(order);

    return {
      ...order,
      totalAmount: financials.totalAmount,
      finalAmount: financials.totalAmount,
      balanceAmount: financials.balanceAmount,
      expectedCompletionDate,
    };
  }
}
