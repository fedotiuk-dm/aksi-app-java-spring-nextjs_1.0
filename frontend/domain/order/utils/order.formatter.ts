/**
 * Форматер для відображення Order даних
 * Забезпечує консистентне форматування для UI
 */

import { DiscountType, PaymentMethod, PaymentStatus } from '../types';

import type { Order, OrderItem, OrderStatus, ExpediteType } from '../types';

export class OrderFormatter {
  /**
   * Форматує статус замовлення українською
   */
  static formatStatus(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
      DRAFT: 'Чернетка',
      NEW: 'Нове',
      IN_PROGRESS: 'В роботі',
      COMPLETED: 'Завершено',
      DELIVERED: 'Видано',
      CANCELLED: 'Скасовано',
    };
    return statusMap[status] || status;
  }

  /**
   * Форматує тип терміновості українською
   */
  static formatExpediteType(expediteType: ExpediteType): string {
    const expediteMap: Record<ExpediteType, string> = {
      STANDARD: 'Стандартно',
      EXPRESS_48H: 'Терміново 48 год (+50%)',
      EXPRESS_24H: 'Терміново 24 год (+100%)',
    };
    return expediteMap[expediteType] || expediteType;
  }

  /**
   * Форматує тип знижки українською
   */
  static formatDiscountType(discountType: DiscountType): string {
    const discountMap: Record<DiscountType, string> = {
      NONE: 'Без знижки',
      EVERCARD: 'Еверкард (10%)',
      SOCIAL_MEDIA: 'Соцмережі (5%)',
      MILITARY: 'ЗСУ (10%)',
      CUSTOM: 'Індивідуальна знижка',
    };
    return discountMap[discountType] || discountType;
  }

  /**
   * Форматує спосіб оплати українською
   */
  static formatPaymentMethod(method: PaymentMethod): string {
    const methodMap: Record<PaymentMethod, string> = {
      TERMINAL: 'Термінал',
      CASH: 'Готівка',
      BANK_TRANSFER: 'На рахунок',
    };
    return methodMap[method] || method;
  }

  /**
   * Форматує статус оплати українською
   */
  static formatPaymentStatus(status: PaymentStatus): string {
    const statusMap: Record<PaymentStatus, string> = {
      PENDING: 'Очікує оплати',
      PARTIAL: 'Часткова оплата',
      PAID: 'Оплачено',
      REFUNDED: 'Повернено',
    };
    return statusMap[status] || status;
  }

  /**
   * Форматує грошову суму
   */
  static formatAmount(amount: number, withCurrency: boolean = true): string {
    const formatted = amount.toFixed(2);
    return withCurrency ? `${formatted} грн` : formatted;
  }

  /**
   * Форматує дату
   */
  static formatDate(date: Date, includeTime: boolean = false): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    return date.toLocaleDateString('uk-UA', options);
  }

  /**
   * Форматує короткий опис замовлення
   */
  static formatOrderSummary(order: Order): string {
    const parts = [
      `№${order.receiptNumber}`,
      order.client.lastName
        ? `${order.client.lastName} ${order.client.firstName || ''}`.trim()
        : order.client.phone,
      `${order.items?.length || 0} пред.`,
      this.formatAmount(order.finalAmount || 0),
    ];

    return parts.filter(Boolean).join(' | ');
  }

  /**
   * Форматує опис предмета
   */
  static formatItemDescription(item: OrderItem): string {
    const parts = [item.name];

    if (item.color) parts.push(item.color);
    if (item.material) parts.push(this.formatMaterial(item.material));
    if (item.quantity > 1) parts.push(`${item.quantity} шт.`);

    return parts.join(', ');
  }

  /**
   * Форматує матеріал українською
   */
  static formatMaterial(material: string): string {
    const materialMap: Record<string, string> = {
      COTTON: 'Бавовна',
      WOOL: 'Шерсть',
      SILK: 'Шовк',
      SYNTHETIC: 'Синтетика',
      LEATHER: 'Шкіра',
      NUBUCK: 'Нубук',
      SUEDE: 'Замша',
      SPLIT_LEATHER: 'Спілок',
    };
    return materialMap[material] || material;
  }

  /**
   * Форматує список дефектів
   */
  static formatDefects(defects?: string): string {
    if (!defects) return '';

    const defectList = defects
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);
    return defectList.join(', ');
  }

  /**
   * Форматує список плям
   */
  static formatStains(stains?: string, otherStains?: string): string {
    const allStains = [stains, otherStains].filter(Boolean);
    return allStains.join(', ');
  }

  /**
   * Форматує інформацію про термін виконання
   */
  static formatCompletionInfo(order: Order): string {
    if (!order.expectedCompletionDate) return 'Термін не визначено';

    const completionDate = this.formatDate(order.expectedCompletionDate);
    const isOverdue = new Date() > order.expectedCompletionDate;
    const expediteInfo =
      order.expediteType !== 'STANDARD' ? ` (${this.formatExpediteType(order.expediteType)})` : '';

    if (isOverdue && order.status !== 'DELIVERED' && order.status !== 'CANCELLED') {
      return `⚠️ Прострочено: ${completionDate}${expediteInfo}`;
    }

    return `${completionDate}${expediteInfo}`;
  }

  /**
   * Форматує відсоток прогресу
   */
  static formatProgress(percentage: number): string {
    return `${Math.round(percentage)}%`;
  }

  /**
   * Форматує повну інформацію про фінанси
   */
  static formatFinancialSummary(order: Order): string {
    const parts = [`Загальна: ${this.formatAmount(order.totalAmount || 0)}`];

    if (order.discountAmount && order.discountAmount > 0) {
      parts.push(`Знижка: ${this.formatAmount(order.discountAmount)}`);
    }

    parts.push(`До сплати: ${this.formatAmount(order.finalAmount || 0)}`);

    if (order.prepaymentAmount && order.prepaymentAmount > 0) {
      parts.push(`Сплачено: ${this.formatAmount(order.prepaymentAmount)}`);
      parts.push(`Залишок: ${this.formatAmount(order.balanceAmount || 0)}`);
    }

    return parts.join(' | ');
  }

  /**
   * Форматує час до дедлайну
   */
  static formatTimeToDeadline(order: Order): string {
    if (!order.expectedCompletionDate) return '';

    const now = new Date();
    const deadline = order.expectedCompletionDate;
    const diffMs = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Прострочено на ${Math.abs(diffDays)} дн.`;
    } else if (diffDays === 0) {
      return 'Сьогодні';
    } else if (diffDays === 1) {
      return 'Завтра';
    } else {
      return `Через ${diffDays} дн.`;
    }
  }

  /**
   * Створює короткий ідентифікатор замовлення
   */
  static createShortId(order: Order): string {
    if (order.tagNumber) {
      return order.tagNumber;
    }
    return order.receiptNumber || order.id?.slice(-6) || '';
  }
}
