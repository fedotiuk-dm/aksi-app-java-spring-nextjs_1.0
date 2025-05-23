/**
 * Сутність OrderFinancials (Фінанси замовлення)
 * Реалізує бізнес-логіку фінансових розрахунків
 */

import { Entity } from '@/domain/shared/types';

import { DiscountType, PaymentMethod, PaymentStatus, ExpediteType } from '../../types';

import type { OrderFinancials, FinancialBreakdown, OrderItem } from '../../types';

export class OrderFinancialsEntity implements Entity<string> {
  constructor(
    public readonly id: string,
    public readonly basePrice: number,
    public readonly modifiersAmount: number,
    public readonly subtotal: number,
    public readonly discountType: DiscountType,
    public readonly discountPercentage: number,
    public readonly discountAmount: number,
    public readonly expediteAmount: number,
    public readonly totalAmount: number,
    public readonly prepaymentAmount: number,
    public readonly balanceAmount: number,
    public readonly paymentMethod: PaymentMethod
  ) {}

  /**
   * Створює нову сутність з об'єкта
   */
  static fromObject(data: OrderFinancials & { id?: string }): OrderFinancialsEntity {
    return new OrderFinancialsEntity(
      data.id || crypto.randomUUID(),
      data.basePrice,
      data.modifiersAmount,
      data.subtotal,
      data.discountType,
      data.discountPercentage,
      data.discountAmount,
      data.expediteAmount,
      data.totalAmount,
      data.prepaymentAmount,
      data.balanceAmount,
      data.paymentMethod
    );
  }

  /**
   * Розраховує фінанси для замовлення
   */
  static calculateFromItems(
    items: OrderItem[],
    discountType: DiscountType = DiscountType.NONE,
    discountPercentage: number = 0,
    expediteType: ExpediteType = ExpediteType.STANDARD,
    prepaymentAmount: number = 0,
    paymentMethod: PaymentMethod = PaymentMethod.CASH
  ): OrderFinancialsEntity {
    // Базова ціна всіх предметів
    const basePrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    // Сума модифікаторів (розраховується окремо для кожного предмета)
    const modifiersAmount = items.reduce((sum, item) => {
      const itemModifiers = item.calculatedPrice
        ? item.calculatedPrice - item.unitPrice * item.quantity
        : 0;
      return sum + itemModifiers;
    }, 0);

    const subtotal = basePrice + modifiersAmount;

    // Розрахунок знижки
    const applicableAmount = this.getApplicableDiscountAmount(items, discountType, subtotal);
    const discountAmount =
      discountType !== DiscountType.NONE ? (applicableAmount * discountPercentage) / 100 : 0;

    const afterDiscount = subtotal - discountAmount;

    // Розрахунок терміновості
    const expediteAmount = this.calculateExpediteAmount(afterDiscount, expediteType);

    const totalAmount = afterDiscount + expediteAmount;
    const balanceAmount = Math.max(0, totalAmount - prepaymentAmount);

    return new OrderFinancialsEntity(
      crypto.randomUUID(),
      basePrice,
      modifiersAmount,
      subtotal,
      discountType,
      discountPercentage,
      discountAmount,
      expediteAmount,
      totalAmount,
      prepaymentAmount,
      balanceAmount,
      paymentMethod
    );
  }

  /**
   * Розраховує суму на яку поширюється знижка
   */
  private static getApplicableDiscountAmount(
    items: OrderItem[],
    discountType: DiscountType,
    subtotal: number
  ): number {
    if (discountType === DiscountType.NONE) return 0;

    // Знижки не діють на прасування, прання і фарбування текстилю
    const excludedCategories = ['прасування', 'прання', 'фарбування'];

    const excludedAmount = items.reduce((sum, item) => {
      const isExcluded = excludedCategories.some(
        (category) =>
          item.category?.toLowerCase().includes(category) ||
          item.name?.toLowerCase().includes(category)
      );

      if (isExcluded) {
        return sum + (item.calculatedPrice || item.totalPrice || item.unitPrice * item.quantity);
      }

      return sum;
    }, 0);

    return subtotal - excludedAmount;
  }

  /**
   * Розраховує надбавку за терміновість
   */
  private static calculateExpediteAmount(amount: number, expediteType: ExpediteType): number {
    switch (expediteType) {
      case ExpediteType.EXPRESS_48H:
        return amount * 0.5; // +50%
      case ExpediteType.EXPRESS_24H:
        return amount * 1.0; // +100%
      default:
        return 0;
    }
  }

  /**
   * Перетворює сутність в звичайний об'єкт
   */
  toPlainObject(): OrderFinancials {
    return {
      basePrice: this.basePrice,
      modifiersAmount: this.modifiersAmount,
      subtotal: this.subtotal,
      discountType: this.discountType,
      discountPercentage: this.discountPercentage,
      discountAmount: this.discountAmount,
      expediteAmount: this.expediteAmount,
      totalAmount: this.totalAmount,
      prepaymentAmount: this.prepaymentAmount,
      balanceAmount: this.balanceAmount,
      paymentMethod: this.paymentMethod,
    };
  }

  /**
   * Створює детальний розклад фінансів
   */
  createBreakdown(items: OrderItem[]): FinancialBreakdown {
    return {
      items: items.map((item) => ({
        itemId: item.id || '',
        itemName: item.name,
        quantity: item.quantity,
        basePrice: item.unitPrice,
        modifiers: [], // TODO: додати модифікатори предмета
        itemSubtotal: item.unitPrice * item.quantity,
        discountApplied: item.discountApplied || 0,
        itemTotal: item.calculatedPrice || item.totalPrice || item.unitPrice * item.quantity,
      })),
      totals: {
        itemsSubtotal: this.basePrice,
        modifiersSubtotal: this.modifiersAmount,
        beforeDiscounts: this.subtotal,
        totalDiscounts: this.discountAmount,
        afterDiscounts: this.subtotal - this.discountAmount,
        expediteAmount: this.expediteAmount,
        finalAmount: this.totalAmount,
      },
      discounts:
        this.discountAmount > 0
          ? [
              {
                type: this.discountType,
                name: this.getDiscountDisplayName(),
                percentage: this.discountPercentage,
                appliedToAmount: this.subtotal,
                discountAmount: this.discountAmount,
                excludedItems: [], // TODO: додати виключені предмети
              },
            ]
          : [],
      expedite:
        this.expediteAmount > 0
          ? {
              type: this.getExpediteType(),
              name: this.getExpediteDisplayName(),
              percentage: this.getExpeditePercentage(),
              appliedToAmount: this.subtotal - this.discountAmount,
              expediteAmount: this.expediteAmount,
            }
          : null,
      payment: {
        method: this.paymentMethod,
        totalAmount: this.totalAmount,
        prepaidAmount: this.prepaymentAmount,
        remainingAmount: this.balanceAmount,
        paymentStatus: this.getPaymentStatus(),
      },
    };
  }

  /**
   * Отримує тип терміновості з суми
   */
  private getExpediteType(): 'EXPRESS_48H' | 'EXPRESS_24H' {
    const baseAmount = this.subtotal - this.discountAmount;
    const expeditePercentage = (this.expediteAmount / baseAmount) * 100;

    if (expeditePercentage >= 90) return 'EXPRESS_24H'; // близько 100%
    return 'EXPRESS_48H'; // близько 50%
  }

  /**
   * Отримує відсоток терміновості
   */
  private getExpeditePercentage(): number {
    const baseAmount = this.subtotal - this.discountAmount;
    return baseAmount > 0 ? Math.round((this.expediteAmount / baseAmount) * 100) : 0;
  }

  /**
   * Отримує відображувану назву знижки
   */
  getDiscountDisplayName(): string {
    const discountMap: Record<DiscountType, string> = {
      [DiscountType.NONE]: 'Без знижки',
      [DiscountType.EVERCARD]: 'Еверкард',
      [DiscountType.SOCIAL_MEDIA]: 'Соцмережі',
      [DiscountType.MILITARY]: 'ЗСУ',
      [DiscountType.CUSTOM]: 'Індивідуальна знижка',
    };
    return discountMap[this.discountType] || this.discountType;
  }

  /**
   * Отримує відображувану назву терміновості
   */
  getExpediteDisplayName(): string {
    if (this.expediteAmount === 0) return 'Звичайне виконання';

    const expediteType = this.getExpediteType();
    const expediteMap = {
      EXPRESS_48H: 'Терміново 48 год (+50%)',
      EXPRESS_24H: 'Терміново 24 год (+100%)',
    };

    return expediteMap[expediteType] || 'Терміново';
  }

  /**
   * Отримує статус оплати
   */
  getPaymentStatus(): PaymentStatus {
    if (this.balanceAmount <= 0) return PaymentStatus.PAID;
    if (this.prepaymentAmount > 0) return PaymentStatus.PARTIAL;
    return PaymentStatus.PENDING;
  }

  /**
   * Перевіряє чи повністю оплачено
   */
  isFullyPaid(): boolean {
    return this.balanceAmount <= 0;
  }

  /**
   * Перевіряє чи є передоплата
   */
  hasPrepayment(): boolean {
    return this.prepaymentAmount > 0;
  }

  /**
   * Отримує відсоток оплати
   */
  getPaymentPercentage(): number {
    return this.totalAmount > 0 ? Math.round((this.prepaymentAmount / this.totalAmount) * 100) : 0;
  }

  /**
   * Додає передоплату
   */
  addPrepayment(amount: number): OrderFinancialsEntity {
    const newPrepayment = this.prepaymentAmount + amount;
    const newBalance = Math.max(0, this.totalAmount - newPrepayment);

    return new OrderFinancialsEntity(
      this.id,
      this.basePrice,
      this.modifiersAmount,
      this.subtotal,
      this.discountType,
      this.discountPercentage,
      this.discountAmount,
      this.expediteAmount,
      this.totalAmount,
      newPrepayment,
      newBalance,
      this.paymentMethod
    );
  }

  /**
   * Застосовує знижку
   */
  applyDiscount(discountType: DiscountType, percentage: number): OrderFinancialsEntity {
    // Перерахунок з новою знижкою
    const applicableAmount = this.subtotal; // Спрощена логіка, в реальності потрібні предмети
    const newDiscountAmount =
      discountType !== DiscountType.NONE ? (applicableAmount * percentage) / 100 : 0;

    const afterDiscount = this.subtotal - newDiscountAmount;
    const newTotalAmount = afterDiscount + this.expediteAmount;
    const newBalanceAmount = Math.max(0, newTotalAmount - this.prepaymentAmount);

    return new OrderFinancialsEntity(
      this.id,
      this.basePrice,
      this.modifiersAmount,
      this.subtotal,
      discountType,
      percentage,
      newDiscountAmount,
      this.expediteAmount,
      newTotalAmount,
      this.prepaymentAmount,
      newBalanceAmount,
      this.paymentMethod
    );
  }

  /**
   * Змінює спосіб оплати
   */
  changePaymentMethod(method: PaymentMethod): OrderFinancialsEntity {
    return new OrderFinancialsEntity(
      this.id,
      this.basePrice,
      this.modifiersAmount,
      this.subtotal,
      this.discountType,
      this.discountPercentage,
      this.discountAmount,
      this.expediteAmount,
      this.totalAmount,
      this.prepaymentAmount,
      this.balanceAmount,
      method
    );
  }

  /**
   * Валідує фінансові дані
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.basePrice < 0) {
      errors.push("Базова ціна не може бути від'ємною");
    }

    if (this.totalAmount < 0) {
      errors.push("Загальна сума не може бути від'ємною");
    }

    if (this.prepaymentAmount < 0) {
      errors.push("Передоплата не може бути від'ємною");
    }

    if (this.prepaymentAmount > this.totalAmount) {
      errors.push('Передоплата не може перевищувати загальну суму');
    }

    if (this.discountPercentage < 0 || this.discountPercentage > 100) {
      errors.push('Відсоток знижки повинен бути від 0 до 100');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
