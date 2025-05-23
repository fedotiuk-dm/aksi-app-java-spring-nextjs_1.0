/**
 * Загальні утиліти для Order домену
 * Містить допоміжні функції та константи
 */

import { OrderStatus, ExpediteType, DiscountType, PaymentMethod } from '../types';

import type { Order, OrderItem } from '../types';

export class OrderUtils {
  /**
   * Константи для бізнес-логіки
   */
  static readonly CONSTANTS = {
    CHILD_SIZE_DISCOUNT: 30, // 30% знижка за дитячі речі
    MANUAL_CLEANING_SURCHARGE: 20, // +20% за ручну чистку
    EXPEDITE_48H_SURCHARGE: 50, // +50% за терміновість 48h
    EXPEDITE_24H_SURCHARGE: 100, // +100% за терміновість 24h
    STANDARD_COMPLETION_DAYS: 2, // 2 дні стандартний термін
    LEATHER_COMPLETION_DAYS: 14, // 14 днів для шкіри
    READY_TIME_HOUR: 14, // Готовність після 14:00
    MAX_PHOTOS_PER_ITEM: 5, // Максимум 5 фото на предмет
    MAX_PHOTO_SIZE_MB: 5, // Максимум 5MB на фото
  } as const;

  /**
   * Відсотки знижок за типами
   */
  static readonly DISCOUNT_PERCENTAGES: Record<DiscountType, number> = {
    [DiscountType.NONE]: 0,
    [DiscountType.EVERCARD]: 10,
    [DiscountType.SOCIAL_MEDIA]: 5,
    [DiscountType.MILITARY]: 10,
    [DiscountType.CUSTOM]: 0, // Буде вказано вручну
  };

  /**
   * Категорії що виключаються зі знижок
   */
  static readonly DISCOUNT_EXCLUDED_CATEGORIES = ['прасування', 'прання', 'фарбування'] as const;

  /**
   * Генерує унікальний номер квитанції
   */
  static generateReceiptNumber(branchCode?: string, date: Date = new Date()): string {
    const prefix = branchCode || 'DC';
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const timestamp = Date.now().toString().slice(-4);

    return `${prefix}-${year}${month}${day}-${timestamp}`;
  }

  /**
   * Генерує унікальну мітку
   */
  static generateTagNumber(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Валідує номер квитанції
   */
  static validateReceiptNumber(receiptNumber: string): boolean {
    // Формат: XX-YYMMDD-ZZZZ
    const pattern = /^[A-Z]{2,3}-\d{6}-\d{4}$/;
    return pattern.test(receiptNumber);
  }

  /**
   * Валідує унікальну мітку
   */
  static validateTagNumber(tagNumber: string): boolean {
    // 8 символів: літери та цифри
    const pattern = /^[A-Z0-9]{8}$/;
    return pattern.test(tagNumber);
  }

  /**
   * Перевіряє чи можна редагувати замовлення
   */
  static canEditOrder(order: Order): boolean {
    return order.status === OrderStatus.DRAFT || order.status === OrderStatus.NEW;
  }

  /**
   * Перевіряє чи можна скасувати замовлення
   */
  static canCancelOrder(order: Order): boolean {
    return (
      order.status !== OrderStatus.DELIVERED &&
      order.status !== OrderStatus.CANCELLED &&
      order.status !== OrderStatus.COMPLETED
    );
  }

  /**
   * Перевіряє чи можна завершити замовлення
   */
  static canCompleteOrder(order: Order): boolean {
    return (
      order.status === OrderStatus.IN_PROGRESS &&
      (order.items || []).length > 0 &&
      (order.items || []).every((item) => item.isComplete)
    );
  }

  /**
   * Перевіряє чи можна видати замовлення
   */
  static canDeliverOrder(order: Order): boolean {
    return (
      order.status === OrderStatus.COMPLETED && (order.balanceAmount || 0) <= 0 // Повністю оплачено
    );
  }

  /**
   * Розраховує прогрес замовлення у відсотках
   */
  static calculateOrderProgress(order: Order): number {
    const statusProgress: Record<OrderStatus, number> = {
      [OrderStatus.DRAFT]: 0,
      [OrderStatus.NEW]: 20,
      [OrderStatus.IN_PROGRESS]: 60,
      [OrderStatus.COMPLETED]: 90,
      [OrderStatus.DELIVERED]: 100,
      [OrderStatus.CANCELLED]: 0,
    };

    let baseProgress = statusProgress[order.status] || 0;

    // Додаткові бонуси
    if ((order.items || []).length > 0) baseProgress += 5;
    if ((order.items || []).every((item) => item.isComplete)) baseProgress += 10;
    if ((order.prepaymentAmount || 0) > 0) baseProgress += 5;

    return Math.min(baseProgress, 100);
  }

  /**
   * Фільтрує замовлення за критеріями
   */
  static filterOrders(
    orders: Order[],
    filters: {
      status?: OrderStatus[];
      dateFrom?: Date;
      dateTo?: Date;
      branchId?: string;
      clientId?: string;
      keyword?: string;
      minAmount?: number;
      maxAmount?: number;
    }
  ): Order[] {
    return orders.filter((order) => {
      return (
        this.matchesStatusFilter(order, filters.status) &&
        this.matchesDateFilter(order, filters.dateFrom, filters.dateTo) &&
        this.matchesBranchFilter(order, filters.branchId) &&
        this.matchesClientFilter(order, filters.clientId) &&
        this.matchesAmountFilter(order, filters.minAmount, filters.maxAmount) &&
        this.matchesKeywordFilter(order, filters.keyword)
      );
    });
  }

  /**
   * Перевіряє фільтр за статусом
   */
  private static matchesStatusFilter(order: Order, status?: OrderStatus[]): boolean {
    return !status || status.length === 0 || status.includes(order.status);
  }

  /**
   * Перевіряє фільтр за датою
   */
  private static matchesDateFilter(order: Order, dateFrom?: Date, dateTo?: Date): boolean {
    const createdDate = order.createdDate;
    return (
      (!dateFrom || !createdDate || createdDate >= dateFrom) &&
      (!dateTo || !createdDate || createdDate <= dateTo)
    );
  }

  /**
   * Перевіряє фільтр за філією
   */
  private static matchesBranchFilter(order: Order, branchId?: string): boolean {
    return !branchId || order.branchLocation?.id === branchId;
  }

  /**
   * Перевіряє фільтр за клієнтом
   */
  private static matchesClientFilter(order: Order, clientId?: string): boolean {
    return !clientId || order.client?.id === clientId;
  }

  /**
   * Перевіряє фільтр за сумою
   */
  private static matchesAmountFilter(
    order: Order,
    minAmount?: number,
    maxAmount?: number
  ): boolean {
    const finalAmount = order.finalAmount || 0;
    return (!minAmount || finalAmount >= minAmount) && (!maxAmount || finalAmount <= maxAmount);
  }

  /**
   * Перевіряє фільтр за ключовим словом
   */
  private static matchesKeywordFilter(order: Order, keyword?: string): boolean {
    if (!keyword) return true;

    const searchKeyword = keyword.toLowerCase();
    const searchText = [
      order.receiptNumber,
      order.tagNumber,
      order.client?.firstName,
      order.client?.lastName,
      order.client?.phone,
      order.customerNotes,
      ...(order.items || []).map((item) => item.name),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchText.includes(searchKeyword);
  }

  /**
   * Сортує замовлення за критеріями
   */
  static sortOrders(
    orders: Order[],
    sortBy: 'date' | 'status' | 'amount' | 'client' | 'completion',
    direction: 'asc' | 'desc' = 'desc'
  ): Order[] {
    return [...orders].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = (a.createdDate?.getTime() || 0) - (b.createdDate?.getTime() || 0);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'amount':
          comparison = (a.finalAmount || 0) - (b.finalAmount || 0);
          break;
        case 'client':
          const clientA = `${a.client?.lastName || ''} ${a.client?.firstName || ''}`;
          const clientB = `${b.client?.lastName || ''} ${b.client?.firstName || ''}`;
          comparison = clientA.localeCompare(clientB);
          break;
        case 'completion':
          comparison =
            (a.expectedCompletionDate?.getTime() || 0) - (b.expectedCompletionDate?.getTime() || 0);
          break;
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Групує замовлення за статусом
   */
  static groupOrdersByStatus(orders: Order[]): Record<OrderStatus, Order[]> {
    const groups: Record<OrderStatus, Order[]> = {
      [OrderStatus.DRAFT]: [],
      [OrderStatus.NEW]: [],
      [OrderStatus.IN_PROGRESS]: [],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    orders.forEach((order) => {
      groups[order.status].push(order);
    });

    return groups;
  }

  /**
   * Розраховує статистику замовлень
   */
  static calculateOrderStatistics(orders: Order[]): {
    total: number;
    byStatus: Record<OrderStatus, number>;
    totalAmount: number;
    averageAmount: number;
    overdueCount: number;
    completedToday: number;
  } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const byStatus: Record<OrderStatus, number> = {
      [OrderStatus.DRAFT]: 0,
      [OrderStatus.NEW]: 0,
      [OrderStatus.IN_PROGRESS]: 0,
      [OrderStatus.COMPLETED]: 0,
      [OrderStatus.DELIVERED]: 0,
      [OrderStatus.CANCELLED]: 0,
    };

    let totalAmount = 0;
    let overdueCount = 0;
    let completedToday = 0;

    orders.forEach((order) => {
      byStatus[order.status]++;
      totalAmount += order.finalAmount || 0;

      // Прострочені
      if (
        order.expectedCompletionDate &&
        order.expectedCompletionDate < now &&
        order.status !== OrderStatus.DELIVERED &&
        order.status !== OrderStatus.CANCELLED
      ) {
        overdueCount++;
      }

      // Завершені сьогодні
      if (
        order.completedDate &&
        order.completedDate >= today &&
        order.status === OrderStatus.COMPLETED
      ) {
        completedToday++;
      }
    });

    return {
      total: orders.length,
      byStatus,
      totalAmount,
      averageAmount: orders.length > 0 ? totalAmount / orders.length : 0,
      overdueCount,
      completedToday,
    };
  }

  /**
   * Створює резюме замовлення для відображення
   */
  static createOrderSummary(order: Order): {
    title: string;
    subtitle: string;
    status: string;
    amount: string;
    itemsCount: string;
    client: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  } {
    const title = `№${order.receiptNumber}`;
    const subtitle = order.tagNumber || '';

    const status = this.getStatusDisplayName(order.status);

    const amount = `${(order.finalAmount || 0).toFixed(2)} грн`;

    const itemsCount = `${(order.items || []).length} пред.`;

    const client = order.client?.lastName
      ? `${order.client.lastName} ${order.client.firstName || ''}`.trim()
      : order.client?.phone || 'Невідомий клієнт';

    const dueDate = order.expectedCompletionDate
      ? order.expectedCompletionDate.toLocaleDateString('uk-UA')
      : 'Не визначено';

    const priority = this.calculateOrderPriority(order);

    return {
      title,
      subtitle,
      status,
      amount,
      itemsCount,
      client,
      dueDate,
      priority,
    };
  }

  /**
   * Отримує локалізовану назву статусу
   */
  static getStatusDisplayName(status: OrderStatus): string {
    const statusNames: Record<OrderStatus, string> = {
      [OrderStatus.DRAFT]: 'Чернетка',
      [OrderStatus.NEW]: 'Нове',
      [OrderStatus.IN_PROGRESS]: 'В роботі',
      [OrderStatus.COMPLETED]: 'Завершено',
      [OrderStatus.DELIVERED]: 'Видано',
      [OrderStatus.CANCELLED]: 'Скасовано',
    };
    return statusNames[status] || status;
  }

  /**
   * Розраховує пріоритет замовлення
   */
  static calculateOrderPriority(order: Order): 'low' | 'medium' | 'high' | 'urgent' {
    const now = new Date();

    // Прострочені - найвищий пріоритет
    if (
      order.expectedCompletionDate &&
      order.expectedCompletionDate < now &&
      order.status !== OrderStatus.DELIVERED &&
      order.status !== OrderStatus.CANCELLED
    ) {
      return 'urgent';
    }

    // Терміново 24h
    if (order.expediteType === ExpediteType.EXPRESS_24H) {
      return 'urgent';
    }

    // Терміново 48h або завершення сьогодні
    if (
      order.expediteType === ExpediteType.EXPRESS_48H ||
      (order.expectedCompletionDate &&
        order.expectedCompletionDate.toDateString() === now.toDateString())
    ) {
      return 'high';
    }

    // Завершення завтра
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (
      order.expectedCompletionDate &&
      order.expectedCompletionDate.toDateString() === tomorrow.toDateString()
    ) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Створює уніфікований ідентифікатор замовлення
   */
  static createOrderIdentifier(order: Order): string {
    return order.tagNumber || order.receiptNumber || order.id || '';
  }

  /**
   * Перевіряє валідність електронної пошти
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Перевіряє валідність номера телефону (український формат)
   */
  static isValidPhoneNumber(phone: string): boolean {
    // Українські номери: +380XXXXXXXXX або 0XXXXXXXXX
    const phoneRegex = /^(\+380|380|0)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
  }

  /**
   * Форматує номер телефону в уніфікований вигляд
   */
  static formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\s|-|\(|\)/g, '');

    if (cleaned.startsWith('+380')) {
      return cleaned;
    } else if (cleaned.startsWith('380')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0') && cleaned.length === 10) {
      return `+38${cleaned}`;
    }

    return phone; // Повертаємо оригінал якщо не можемо розпізнати формат
  }

  /**
   * Створює список дій доступних для замовлення
   */
  static getAvailableActions(order: Order): string[] {
    const actions: string[] = [];

    if (this.canEditOrder(order)) {
      actions.push('edit');
    }

    if (this.canCancelOrder(order)) {
      actions.push('cancel');
    }

    if (this.canCompleteOrder(order)) {
      actions.push('complete');
    }

    if (this.canDeliverOrder(order)) {
      actions.push('deliver');
    }

    actions.push('view', 'print');

    if (order.client?.id) {
      actions.push('email');
    }

    return actions;
  }
}
