/**
 * Адаптер для перетворення Financial даних між API та доменом
 */

import { DiscountType, PaymentMethod, PaymentStatus } from '../types';

import type { OrderFinancials } from '../types';

export class FinancialAdapter {
  /**
   * Перетворює API фінансові дані в доменні
   */
  static fromApiData(data: any): OrderFinancials {
    return {
      basePrice: data.basePrice || 0,
      modifiersAmount: data.modifiersAmount || 0,
      subtotal: data.subtotal || 0,
      discountType: this.fromApiDiscountType(data.discountType),
      discountPercentage: data.discountPercentage || 0,
      discountAmount: data.discountAmount || 0,
      expediteAmount: data.expediteAmount || 0,
      totalAmount: data.totalAmount || 0,
      prepaymentAmount: data.prepaymentAmount || 0,
      balanceAmount: data.balanceAmount || 0,
      paymentMethod: this.fromApiPaymentMethod(data.paymentMethod),
    };
  }

  /**
   * Перетворює доменні фінансові дані в API формат
   */
  static toApiData(financials: OrderFinancials): any {
    return {
      basePrice: financials.basePrice,
      modifiersAmount: financials.modifiersAmount,
      subtotal: financials.subtotal,
      discountType: financials.discountType,
      discountPercentage: financials.discountPercentage,
      discountAmount: financials.discountAmount,
      expediteAmount: financials.expediteAmount,
      totalAmount: financials.totalAmount,
      prepaymentAmount: financials.prepaymentAmount,
      balanceAmount: financials.balanceAmount,
      paymentMethod: financials.paymentMethod,
    };
  }

  /**
   * Перетворює API тип знижки в доменний enum
   */
  private static fromApiDiscountType(discountType?: string): DiscountType {
    if (!discountType) return DiscountType.NONE;

    const discountMap: Record<string, DiscountType> = {
      NONE: DiscountType.NONE,
      EVERCARD: DiscountType.EVERCARD,
      SOCIAL_MEDIA: DiscountType.SOCIAL_MEDIA,
      MILITARY: DiscountType.MILITARY,
      CUSTOM: DiscountType.CUSTOM,
    };

    return discountMap[discountType] || DiscountType.NONE;
  }

  /**
   * Перетворює API спосіб оплати в доменний enum
   */
  private static fromApiPaymentMethod(paymentMethod?: string): PaymentMethod {
    if (!paymentMethod) return PaymentMethod.CASH;

    const paymentMap: Record<string, PaymentMethod> = {
      TERMINAL: PaymentMethod.TERMINAL,
      CASH: PaymentMethod.CASH,
      BANK_TRANSFER: PaymentMethod.BANK_TRANSFER,
    };

    return paymentMap[paymentMethod] || PaymentMethod.CASH;
  }

  /**
   * Визначає статус оплати на основі сум
   */
  static determinePaymentStatus(totalAmount: number, prepaymentAmount: number): PaymentStatus {
    if (prepaymentAmount <= 0) {
      return PaymentStatus.PENDING;
    } else if (prepaymentAmount >= totalAmount) {
      return PaymentStatus.PAID;
    } else {
      return PaymentStatus.PARTIAL;
    }
  }

  /**
   * Розраховує відсоток оплати
   */
  static calculatePaymentPercentage(totalAmount: number, prepaymentAmount: number): number {
    if (totalAmount <= 0) return 0;
    return Math.round((prepaymentAmount / totalAmount) * 100);
  }

  /**
   * Створює порожній фінансовий об'єкт
   */
  static createEmpty(): OrderFinancials {
    return {
      basePrice: 0,
      modifiersAmount: 0,
      subtotal: 0,
      discountType: DiscountType.NONE,
      discountPercentage: 0,
      discountAmount: 0,
      expediteAmount: 0,
      totalAmount: 0,
      prepaymentAmount: 0,
      balanceAmount: 0,
      paymentMethod: PaymentMethod.CASH,
    };
  }

  /**
   * Валідує фінансові дані
   */
  static validate(financials: OrderFinancials): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (financials.basePrice < 0) {
      errors.push("Базова ціна не може бути від'ємною");
    }

    if (financials.totalAmount < 0) {
      errors.push("Загальна сума не може бути від'ємною");
    }

    if (financials.prepaymentAmount < 0) {
      errors.push("Передоплата не може бути від'ємною");
    }

    if (financials.prepaymentAmount > financials.totalAmount) {
      errors.push('Передоплата не може перевищувати загальну суму');
    }

    if (financials.discountPercentage < 0 || financials.discountPercentage > 100) {
      errors.push('Відсоток знижки повинен бути від 0 до 100');
    }

    // Перевірка розрахунків
    const calculatedSubtotal = financials.basePrice + financials.modifiersAmount;
    if (Math.abs(financials.subtotal - calculatedSubtotal) > 0.01) {
      errors.push('Проміжна сума не відповідає розрахунку');
    }

    const calculatedBalance = financials.totalAmount - financials.prepaymentAmount;
    if (Math.abs(financials.balanceAmount - calculatedBalance) > 0.01) {
      errors.push('Залишок не відповідає розрахунку');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
