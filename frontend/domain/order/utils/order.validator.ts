/**
 * Валідатор доменних правил для Order
 * Реалізує складну бізнес-логіку валідації
 */

import { OrderStatus, ExpediteType, DiscountType } from '../types';

import type { Order, OrderItem, OrderOperationResult } from '../types';

export class OrderValidator {
  /**
   * Повна валідація замовлення
   */
  static validateOrder(order: Order): OrderOperationResult {
    const errors: Record<string, string> = {};

    // Основні поля
    const basicValidation = this.validateBasicFields(order);
    if (!basicValidation.success) {
      Object.assign(errors, basicValidation.errors);
    }

    // Предмети
    const itemsValidation = this.validateItems(order.items || []);
    if (!itemsValidation.success) {
      Object.assign(errors, itemsValidation.errors);
    }

    // Фінанси
    const financialValidation = this.validateFinancials(order);
    if (!financialValidation.success) {
      Object.assign(errors, financialValidation.errors);
    }

    // Бізнес-правила
    const businessValidation = this.validateBusinessRules(order);
    if (!businessValidation.success) {
      Object.assign(errors, businessValidation.errors);
    }

    const success = Object.keys(errors).length === 0;

    return {
      order: success ? order : null,
      success,
      errors: success ? null : errors,
    };
  }

  /**
   * Валідація основних полів
   */
  private static validateBasicFields(order: Order): {
    success: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (!order.receiptNumber?.trim()) {
      errors.receiptNumber = "Номер квитанції обов'язковий";
    }

    if (!order.client?.id) {
      errors.client = "Клієнт обов'язковий";
    }

    if (!order.branchLocation?.id) {
      errors.branchLocation = "Філія обов'язкова";
    }

    // Валідація дат
    if (order.expectedCompletionDate && order.createdDate) {
      if (order.expectedCompletionDate < order.createdDate) {
        errors.expectedCompletionDate = 'Дата виконання не може бути раніше дати створення';
      }
    }

    if (order.completedDate && order.createdDate) {
      if (order.completedDate < order.createdDate) {
        errors.completedDate = 'Дата завершення не може бути раніше дати створення';
      }
    }

    return {
      success: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Валідація предметів замовлення
   */
  private static validateItems(items: OrderItem[]): {
    success: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (items.length === 0) {
      errors.items = 'Замовлення повинно містити хоча б один предмет';
      return { success: false, errors };
    }

    items.forEach((item, index) => {
      if (!item.name?.trim()) {
        errors[`item_${index}_name`] = `Назва предмета ${index + 1} обов'язкова`;
      }

      if (item.quantity <= 0) {
        errors[`item_${index}_quantity`] = `Кількість предмета ${index + 1} повинна бути більше 0`;
      }

      if (item.unitPrice < 0) {
        errors[`item_${index}_price`] = `Ціна предмета ${index + 1} не може бути від'ємною`;
      }

      // Валідація "без гарантій"
      if (item.noGuaranteeReason && !item.noGuaranteeReason.trim()) {
        errors[`item_${index}_warranty`] =
          `Причина "без гарантій" для предмета ${index + 1} обов'язкова`;
      }
    });

    return {
      success: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Валідація фінансових даних
   */
  private static validateFinancials(order: Order): {
    success: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if ((order.totalAmount || 0) < 0) {
      errors.totalAmount = "Загальна сума не може бути від'ємною";
    }

    if ((order.prepaymentAmount || 0) < 0) {
      errors.prepaymentAmount = "Передоплата не може бути від'ємною";
    }

    if ((order.discountAmount || 0) < 0) {
      errors.discountAmount = "Знижка не може бути від'ємною";
    }

    if ((order.prepaymentAmount || 0) > (order.finalAmount || 0)) {
      errors.prepaymentAmount = 'Передоплата не може перевищувати фінальну суму';
    }

    // Перевірка балансу
    const expectedBalance = (order.finalAmount || 0) - (order.prepaymentAmount || 0);
    if (Math.abs((order.balanceAmount || 0) - expectedBalance) > 0.01) {
      errors.balanceAmount = 'Залишок не відповідає розрахунку';
    }

    return {
      success: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Валідація бізнес-правил
   */
  private static validateBusinessRules(order: Order): {
    success: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    // Правило: чернетка не може мати дату завершення
    if (order.status === OrderStatus.DRAFT && order.completedDate) {
      errors.status = 'Чернетка не може мати дату завершення';
    }

    // Правило: доставлене замовлення повинно бути повністю оплачене
    if (order.status === OrderStatus.DELIVERED && (order.balanceAmount || 0) > 0) {
      errors.payment = 'Доставлене замовлення повинно бути повністю оплачене';
    }

    // Правило: скасоване замовлення не може мати нову дату завершення
    if (order.status === OrderStatus.CANCELLED && order.expectedCompletionDate) {
      const now = new Date();
      if (order.expectedCompletionDate > now) {
        errors.expectedCompletionDate =
          'Скасоване замовлення не може мати майбутню дату завершення';
      }
    }

    // Правило: терміновість вимагає додаткової оплати
    if (order.expediteType !== ExpediteType.STANDARD) {
      const hasExpediteCharge =
        (order.totalAmount || 0) >
        (order.items || []).reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      if (!hasExpediteCharge) {
        errors.expedite = 'Терміновість повинна включати додаткову оплату';
      }
    }

    return {
      success: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Валідація можливості переходу між статусами
   */
  static validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ): { allowed: boolean; reason?: string } {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.DRAFT]: [OrderStatus.NEW, OrderStatus.CANCELLED],
      [OrderStatus.NEW]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELLED],
      [OrderStatus.IN_PROGRESS]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      [OrderStatus.COMPLETED]: [OrderStatus.DELIVERED, OrderStatus.IN_PROGRESS],
      [OrderStatus.DELIVERED]: [], // Фінальний стан
      [OrderStatus.CANCELLED]: [], // Фінальний стан
    };

    const allowedTransitions = transitions[currentStatus] || [];

    if (allowedTransitions.includes(newStatus)) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `Неможливо змінити статус з "${currentStatus}" на "${newStatus}"`,
    };
  }

  /**
   * Валідація застосування знижки
   */
  static validateDiscount(
    discountType: DiscountType,
    discountPercentage: number,
    items: OrderItem[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (discountPercentage < 0 || discountPercentage > 100) {
      errors.push('Відсоток знижки повинен бути від 0 до 100');
    }

    // Перевірка чи діє знижка на предмети
    const excludedCategories = ['прасування', 'прання', 'фарбування'];
    const applicableItems = items.filter(
      (item) =>
        !excludedCategories.some(
          (category) =>
            item.category?.toLowerCase().includes(category) ||
            item.name?.toLowerCase().includes(category)
        )
    );

    if (discountType !== DiscountType.NONE && applicableItems.length === 0) {
      errors.push('Знижка не може бути застосована до жодного предмета в замовленні');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валідація готовності до завершення
   */
  static validateReadyForCompletion(order: Order): { ready: boolean; reasons: string[] } {
    const reasons: string[] = [];

    if (!order.items || order.items.length === 0) {
      reasons.push('Замовлення не містить предметів');
    }

    const incompleteItems = order.items?.filter((item) => !item.isComplete) || [];
    if (incompleteItems.length > 0) {
      reasons.push(`${incompleteItems.length} предметів ще не завершені`);
    }

    if (order.status !== OrderStatus.IN_PROGRESS) {
      reasons.push('Замовлення повинно бути в статусі "В роботі"');
    }

    return {
      ready: reasons.length === 0,
      reasons,
    };
  }
}
