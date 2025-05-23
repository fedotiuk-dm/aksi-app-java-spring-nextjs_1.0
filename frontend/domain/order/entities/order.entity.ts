/**
 * Доменна сутність Order (Замовлення)
 * Реалізує бізнес-логіку замовлення згідно з DDD принципами
 */

import { Entity } from '@/domain/shared/types';

import { OrderStatus, ExpediteType } from '../types';

import type { Order, OrderItem, OrderOperationResult, OrderSearchParams } from '../types';
import type { BranchLocationDTO, ClientResponse } from '@/lib/api';

export class OrderEntity implements Entity<string> {
  constructor(
    public readonly id: string,
    public readonly receiptNumber: string,
    public readonly client: ClientResponse,
    public readonly branchLocation: BranchLocationDTO,
    public readonly status: OrderStatus,
    public readonly createdDate: Date,
    public readonly tagNumber?: string,
    public readonly items: OrderItem[] = [],
    public readonly totalAmount: number = 0,
    public readonly discountAmount: number = 0,
    public readonly finalAmount: number = 0,
    public readonly prepaymentAmount: number = 0,
    public readonly balanceAmount: number = 0,
    public readonly updatedDate?: Date,
    public readonly expectedCompletionDate?: Date,
    public readonly completedDate?: Date,
    public readonly customerNotes?: string,
    public readonly internalNotes?: string,
    public readonly completionComments?: string,
    public readonly expediteType: ExpediteType = ExpediteType.STANDARD,
    public readonly termsAccepted: boolean = false,
    public readonly finalizedAt?: Date,
    public readonly express: boolean = false,
    public readonly draft: boolean = false,
    public readonly printed: boolean = false,
    public readonly emailed: boolean = false
  ) {}

  /**
   * Створює нову сутність з об'єкта
   */
  static fromObject(data: Order): OrderEntity {
    return new OrderEntity(
      data.id || crypto.randomUUID(),
      data.receiptNumber,
      data.client,
      data.branchLocation,
      data.status,
      data.createdDate || new Date(),
      data.tagNumber,
      data.items || [],
      data.totalAmount || 0,
      data.discountAmount || 0,
      data.finalAmount || 0,
      data.prepaymentAmount || 0,
      data.balanceAmount || 0,
      data.updatedDate,
      data.expectedCompletionDate,
      data.completedDate,
      data.customerNotes,
      data.internalNotes,
      data.completionComments,
      data.expediteType || ExpediteType.STANDARD,
      data.termsAccepted || false,
      data.finalizedAt,
      data.express || false,
      data.draft || false,
      data.printed || false,
      data.emailed || false
    );
  }

  /**
   * Перетворює сутність в звичайний об'єкт
   */
  toPlainObject(): Order {
    return {
      id: this.id,
      receiptNumber: this.receiptNumber,
      tagNumber: this.tagNumber,
      client: this.client,
      clientId: this.client.id,
      items: this.items,
      itemsCount: this.items.length,
      totalAmount: this.totalAmount,
      discountAmount: this.discountAmount,
      finalAmount: this.finalAmount,
      prepaymentAmount: this.prepaymentAmount,
      balanceAmount: this.balanceAmount,
      branchLocation: this.branchLocation,
      branchLocationId: this.branchLocation.id,
      status: this.status,
      createdDate: this.createdDate,
      updatedDate: this.updatedDate,
      expectedCompletionDate: this.expectedCompletionDate,
      completedDate: this.completedDate,
      customerNotes: this.customerNotes,
      internalNotes: this.internalNotes,
      completionComments: this.completionComments,
      expediteType: this.expediteType,
      termsAccepted: this.termsAccepted,
      finalizedAt: this.finalizedAt,
      express: this.express,
      draft: this.draft,
      printed: this.printed,
      emailed: this.emailed,

      // Додаткові доменні властивості
      isEditable: this.isEditable(),
      canBeCancelled: this.canBeCancelled(),
      canBeCompleted: this.canBeCompleted(),
      displayStatus: this.getDisplayStatus(),
      progressPercentage: this.getProgressPercentage(),
    };
  }

  /**
   * Перевіряє чи можна редагувати замовлення
   */
  isEditable(): boolean {
    return this.status === OrderStatus.DRAFT || this.status === OrderStatus.NEW;
  }

  /**
   * Перевіряє чи можна скасувати замовлення
   */
  canBeCancelled(): boolean {
    return (
      this.status !== OrderStatus.DELIVERED &&
      this.status !== OrderStatus.CANCELLED &&
      this.status !== OrderStatus.COMPLETED
    );
  }

  /**
   * Перевіряє чи можна завершити замовлення
   */
  canBeCompleted(): boolean {
    return (
      this.status === OrderStatus.IN_PROGRESS &&
      this.items.length > 0 &&
      this.hasAllItemsCompleted()
    );
  }

  /**
   * Перевіряє чи всі предмети завершені
   */
  hasAllItemsCompleted(): boolean {
    return this.items.every((item) => item.isComplete === true);
  }

  /**
   * Отримує відображуваний статус українською
   */
  getDisplayStatus(): string {
    const statusMap: Record<OrderStatus, string> = {
      [OrderStatus.DRAFT]: 'Чернетка',
      [OrderStatus.NEW]: 'Нове',
      [OrderStatus.IN_PROGRESS]: 'В роботі',
      [OrderStatus.COMPLETED]: 'Завершено',
      [OrderStatus.DELIVERED]: 'Видано',
      [OrderStatus.CANCELLED]: 'Скасовано',
    };
    return statusMap[this.status] || this.status;
  }

  /**
   * Розраховує відсоток прогресу замовлення
   */
  getProgressPercentage(): number {
    const statusProgress: Record<OrderStatus, number> = {
      [OrderStatus.DRAFT]: 0,
      [OrderStatus.NEW]: 20,
      [OrderStatus.IN_PROGRESS]: 60,
      [OrderStatus.COMPLETED]: 90,
      [OrderStatus.DELIVERED]: 100,
      [OrderStatus.CANCELLED]: 0,
    };

    let baseProgress = statusProgress[this.status] || 0;

    // Додаткові бонуси за виконані кроки
    if (this.items.length > 0) baseProgress += 5;
    if (this.hasAllItemsCompleted()) baseProgress += 10;
    if (this.prepaymentAmount > 0) baseProgress += 5;

    return Math.min(baseProgress, 100);
  }

  /**
   * Перевіряє чи замовлення прострочене
   */
  isOverdue(): boolean {
    if (!this.expectedCompletionDate) return false;
    if (this.status === OrderStatus.DELIVERED || this.status === OrderStatus.CANCELLED)
      return false;

    return new Date() > this.expectedCompletionDate;
  }

  /**
   * Отримує кількість днів до дедлайну (або після нього з мінусом)
   */
  getDaysToDeadline(): number {
    if (!this.expectedCompletionDate) return 0;

    const now = new Date();
    const diffTime = this.expectedCompletionDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Перевіряє чи замовлення має проблеми
   */
  hasIssues(): boolean {
    return (
      this.isOverdue() ||
      this.items.some((item) => item.hasIssues) ||
      (this.status === OrderStatus.IN_PROGRESS && this.items.length === 0)
    );
  }

  /**
   * Отримує загальну кількість фото в замовленні
   */
  getTotalPhotoCount(): number {
    return this.items.reduce((count, item) => count + (item.photoCount || 0), 0);
  }

  /**
   * Перевіряє чи має замовлення невирішені дефекти
   */
  hasUnresolvedDefects(): boolean {
    return this.items.some(
      (item) => item.defects && item.defects.length > 0 && !item.noGuaranteeReason
    );
  }

  /**
   * Отримує підсумок фінансів
   */
  getFinancialSummary() {
    return {
      subtotal: this.totalAmount,
      discount: this.discountAmount,
      total: this.finalAmount,
      paid: this.prepaymentAmount,
      remaining: this.balanceAmount,
      isFullyPaid: this.balanceAmount <= 0,
      needsPayment: this.balanceAmount > 0,
    };
  }

  /**
   * Перевіряє чи підходить замовлення під пошукові критерії
   */
  matchesSearchCriteria(params: OrderSearchParams): boolean {
    return (
      this.matchesKeyword(params.keyword) &&
      this.matchesStatus(params.status) &&
      this.matchesDateRange(params.dateFrom, params.dateTo) &&
      this.matchesBranch(params.branchId) &&
      this.matchesClient(params.clientId) &&
      this.matchesAmountRange(params.minAmount, params.maxAmount) &&
      this.matchesItemsFilter(params.hasItems) &&
      this.matchesExpediteType(params.expediteType)
    );
  }

  /**
   * Перевіряє відповідність ключовому слову
   */
  private matchesKeyword(keyword?: string): boolean {
    if (!keyword) return true;

    const searchKeyword = keyword.toLowerCase();
    const searchText = [
      this.receiptNumber,
      this.tagNumber,
      this.client.firstName,
      this.client.lastName,
      this.client.phone,
      this.customerNotes,
      ...this.items.map((item) => item.name),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchText.includes(searchKeyword);
  }

  /**
   * Перевіряє відповідність статусу
   */
  private matchesStatus(status?: OrderStatus[]): boolean {
    if (!status || status.length === 0) return true;
    return status.includes(this.status);
  }

  /**
   * Перевіряє відповідність діапазону дат
   */
  private matchesDateRange(dateFrom?: Date, dateTo?: Date): boolean {
    return (!dateFrom || this.createdDate >= dateFrom) && (!dateTo || this.createdDate <= dateTo);
  }

  /**
   * Перевіряє відповідність філії
   */
  private matchesBranch(branchId?: string): boolean {
    if (!branchId) return true;
    return this.branchLocation.id === branchId;
  }

  /**
   * Перевіряє відповідність клієнту
   */
  private matchesClient(clientId?: string): boolean {
    if (!clientId) return true;
    return this.client.id === clientId;
  }

  /**
   * Перевіряє відповідність діапазону сум
   */
  private matchesAmountRange(minAmount?: number, maxAmount?: number): boolean {
    return (
      (!minAmount || this.finalAmount >= minAmount) && (!maxAmount || this.finalAmount <= maxAmount)
    );
  }

  /**
   * Перевіряє відповідність фільтру предметів
   */
  private matchesItemsFilter(hasItems?: boolean): boolean {
    if (hasItems === undefined) return true;
    const hasItemsActual = this.items.length > 0;
    return hasItems === hasItemsActual;
  }

  /**
   * Перевіряє відповідність типу терміновості
   */
  private matchesExpediteType(expediteType?: ExpediteType): boolean {
    return !expediteType || this.expediteType === expediteType;
  }

  /**
   * Створює копію з оновленими полями
   */
  update(updates: Partial<Order>): OrderEntity {
    return OrderEntity.fromObject({
      ...this.toPlainObject(),
      ...updates,
      updatedDate: new Date(),
    });
  }

  /**
   * Валідує сутність перед збереженням
   */
  validate(): OrderOperationResult {
    const errors: string[] = [];

    if (!this.receiptNumber?.trim()) {
      errors.push("Номер квитанції обов'язковий");
    }

    if (!this.client?.id) {
      errors.push("Клієнт обов'язковий");
    }

    if (!this.branchLocation?.id) {
      errors.push("Філія обов'язкова");
    }

    if (this.finalAmount < 0) {
      errors.push("Фінальна сума не може бути від'ємною");
    }

    if (this.prepaymentAmount > this.finalAmount) {
      errors.push('Передоплата не може перевищувати загальну суму');
    }

    return {
      order: errors.length === 0 ? this.toPlainObject() : null,
      success: errors.length === 0,
      errors: errors.length > 0 ? { general: errors.join(', ') } : null,
    };
  }
}
