/**
 * Утиліти для роботи з параметрами замовлення
 * Допоміжні функції для розрахунків, валідації та форматування
 */

import { DiscountType, PaymentMethod } from '../types';

import type { UrgencyOption } from '../types';

/**
 * Опція варіанту терміновості
 */
export interface UrgencyOptionData {
  value: UrgencyOption;
  label: string;
  description: string;
  multiplier: number;
  daysToAdd: number;
}

/**
 * Опція типу знижки
 */
export interface DiscountTypeData {
  value: DiscountType;
  label: string;
  description: string;
  percentage: number;
  isDefault: boolean;
}

/**
 * Опція способу оплати
 */
export interface PaymentMethodData {
  value: PaymentMethod;
  label: string;
  description: string;
  icon?: string;
}

/**
 * Order Parameters Utils
 */
export class OrderParametersUtils {
  // === ВАРІАНТИ ТЕРМІНОВОСТІ ===

  /**
   * Отримання списку варіантів терміновості
   */
  static getUrgencyOptions(): UrgencyOptionData[] {
    return [
      {
        value: 'STANDARD',
        label: 'Звичайне виконання',
        description: '3 дні - стандартний термін без додаткових витрат',
        multiplier: 1.0,
        daysToAdd: 3,
      },
      {
        value: 'URGENT_48H',
        label: 'Терміново за 48 год',
        description: '2 дні - надбавка +50% до вартості',
        multiplier: 1.5,
        daysToAdd: 2,
      },
      {
        value: 'URGENT_24H',
        label: 'Терміново за 24 год',
        description: '1 день - надбавка +100% до вартості',
        multiplier: 2.0,
        daysToAdd: 1,
      },
      {
        value: 'CUSTOM',
        label: 'Індивідуальний термін',
        description: 'Встановіть власну дату виконання',
        multiplier: 1.0,
        daysToAdd: 0,
      },
    ];
  }

  /**
   * Отримання даних про варіант терміновості
   */
  static getUrgencyOptionData(option: UrgencyOption): UrgencyOptionData {
    const options = this.getUrgencyOptions();
    return options.find((opt) => opt.value === option) || options[0];
  }

  /**
   * Розрахунок дати виконання
   */
  static calculateExecutionDate(urgencyOption: UrgencyOption, startDate: Date = new Date()): Date {
    const optionData = this.getUrgencyOptionData(urgencyOption);
    const resultDate = new Date(startDate);

    if (urgencyOption !== 'CUSTOM') {
      resultDate.setDate(resultDate.getDate() + optionData.daysToAdd);
    }

    return resultDate;
  }

  /**
   * Розрахунок множника ціни для терміновості
   */
  static getUrgencyMultiplier(urgencyOption: UrgencyOption): number {
    const optionData = this.getUrgencyOptionData(urgencyOption);
    return optionData.multiplier;
  }

  // === ТИПИ ЗНИЖОК ===

  /**
   * Отримання списку типів знижок
   */
  static getDiscountTypes(): DiscountTypeData[] {
    return [
      {
        value: DiscountType.NONE,
        label: 'Без знижки',
        description: 'Повна оплата без знижок',
        percentage: 0,
        isDefault: true,
      },
      {
        value: DiscountType.EVERCARD,
        label: 'Еверкард',
        description: 'Знижка 10% для власників карти лояльності',
        percentage: 10,
        isDefault: false,
      },
      {
        value: DiscountType.SOCIAL_MEDIA,
        label: 'Соцмережі',
        description: 'Знижка 5% за підписку в соціальних мережах',
        percentage: 5,
        isDefault: false,
      },
      {
        value: DiscountType.MILITARY,
        label: 'ЗСУ',
        description: 'Знижка 10% для військовослужбовців',
        percentage: 10,
        isDefault: false,
      },
      {
        value: DiscountType.CUSTOM,
        label: 'Інше',
        description: 'Індивідуальна знижка (встановіть відсоток)',
        percentage: 0,
        isDefault: false,
      },
    ];
  }

  /**
   * Отримання даних про тип знижки
   */
  static getDiscountTypeData(type: DiscountType): DiscountTypeData {
    const types = this.getDiscountTypes();
    return types.find((t) => t.value === type) || types[0];
  }

  /**
   * Перевірка чи знижка застосовна
   */
  static isDiscountApplicable(
    discountType: DiscountType,
    serviceCategories: string[] = []
  ): boolean {
    if (discountType === DiscountType.NONE) return true;

    // Знижки не діють на прасування, прання і фарбування текстилю
    const excludedCategories = ['IRONING', 'WASHING', 'DYEING'];
    const hasExcludedServices = serviceCategories.some((category) =>
      excludedCategories.includes(category.toUpperCase())
    );

    return !hasExcludedServices;
  }

  /**
   * Розрахунок суми знижки
   */
  static calculateDiscountAmount(
    totalAmount: number,
    discountType: DiscountType,
    customPercentage?: number
  ): number {
    if (discountType === DiscountType.NONE) return 0;

    const typeData = this.getDiscountTypeData(discountType);
    const percentage =
      discountType === DiscountType.CUSTOM && customPercentage !== undefined
        ? customPercentage
        : typeData.percentage;

    return (totalAmount * percentage) / 100;
  }

  // === СПОСОБИ ОПЛАТИ ===

  /**
   * Отримання списку способів оплати
   */
  static getPaymentMethods(): PaymentMethodData[] {
    return [
      {
        value: PaymentMethod.CASH,
        label: 'Готівка',
        description: 'Оплата готівкою при здачі або отриманні',
        icon: 'money',
      },
      {
        value: PaymentMethod.TERMINAL,
        label: 'Термінал',
        description: 'Безготівкова оплата карткою через термінал',
        icon: 'credit_card',
      },
      {
        value: PaymentMethod.BANK_TRANSFER,
        label: 'На рахунок',
        description: 'Переказ на банківський рахунок компанії',
        icon: 'account_balance',
      },
    ];
  }

  /**
   * Отримання даних про спосіб оплати
   */
  static getPaymentMethodData(method: PaymentMethod): PaymentMethodData {
    const methods = this.getPaymentMethods();
    return methods.find((m) => m.value === method) || methods[0];
  }

  // === ФІНАНСОВІ РОЗРАХУНКИ ===

  /**
   * Розрахунок всіх фінансових сум
   */
  static calculateFinancialAmounts(
    baseAmount: number,
    urgencyMultiplier: number,
    discountAmount: number,
    prepaymentAmount: number
  ): {
    totalAmount: number;
    finalAmount: number;
    balanceAmount: number;
  } {
    const totalAmount = baseAmount * urgencyMultiplier;
    const finalAmount = Math.max(0, totalAmount - discountAmount);
    const balanceAmount = Math.max(0, finalAmount - prepaymentAmount);

    return {
      totalAmount: Math.round(totalAmount * 100) / 100, // Округлення до копійок
      finalAmount: Math.round(finalAmount * 100) / 100,
      balanceAmount: Math.round(balanceAmount * 100) / 100,
    };
  }

  /**
   * Перевірка чи передоплата валідна
   */
  static isValidPrepayment(prepaymentAmount: number, finalAmount: number): boolean {
    return prepaymentAmount >= 0 && prepaymentAmount <= finalAmount;
  }

  // === ВАЛІДАЦІЯ ===

  /**
   * Валідація дати виконання
   */
  static validateExecutionDate(date: Date | null): string | null {
    if (!date) {
      return "Дата виконання обов'язкова";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const executionDate = new Date(date);
    executionDate.setHours(0, 0, 0, 0);

    if (executionDate < today) {
      return 'Дата виконання не може бути в минулому';
    }

    return null;
  }

  /**
   * Валідація відсотка знижки
   */
  static validateDiscountPercentage(percentage: number): string | null {
    if (percentage < 0) {
      return "Відсоток знижки не може бути від'ємним";
    }

    if (percentage > 100) {
      return 'Відсоток знижки не може перевищувати 100%';
    }

    return null;
  }

  /**
   * Валідація суми передоплати
   */
  static validatePrepaymentAmount(prepaymentAmount: number, finalAmount: number): string | null {
    if (prepaymentAmount < 0) {
      return "Передоплата не може бути від'ємною";
    }

    if (prepaymentAmount > finalAmount) {
      return 'Передоплата не може перевищувати загальну суму';
    }

    return null;
  }

  // === ФОРМАТУВАННЯ ===

  /**
   * Форматування грошової суми
   */
  static formatCurrency(amount: number, currency = 'грн'): string {
    return `${amount.toFixed(2)} ${currency}`;
  }

  /**
   * Форматування відсотка
   */
  static formatPercentage(percentage: number): string {
    return `${percentage}%`;
  }

  /**
   * Форматування дати
   */
  static formatDate(date: Date | null): string {
    if (!date) return 'Не встановлено';

    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Форматування часу до дедлайну
   */
  static formatTimeToDeadline(executionDate: Date): string {
    const now = new Date();
    const diffMs = executionDate.getTime() - now.getTime();
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

  // === ГЕНЕРАЦІЯ ПІДКАЗОК ===

  /**
   * Генерація підказки для терміновості
   */
  static getUrgencyHint(urgencyOption: UrgencyOption): string {
    const optionData = this.getUrgencyOptionData(urgencyOption);

    if (urgencyOption === 'STANDARD') {
      return 'Стандартний термін виконання без додаткових витрат';
    }

    const extraCost = ((optionData.multiplier - 1) * 100).toFixed(0);
    return `Терміновий режим додасть ${extraCost}% до вартості замовлення`;
  }

  /**
   * Генерація підказки для знижки
   */
  static getDiscountHint(discountType: DiscountType, isApplicable: boolean): string {
    if (discountType === DiscountType.NONE) {
      return 'Оплата без знижок за повною вартістю';
    }

    if (!isApplicable) {
      return 'Знижка не може бути застосована до деяких послуг (прасування, прання, фарбування)';
    }

    const typeData = this.getDiscountTypeData(discountType);
    return `Знижка ${typeData.percentage}%: ${typeData.description}`;
  }

  /**
   * Генерація підказки для оплати
   */
  static getPaymentHint(paymentMethod: PaymentMethod): string {
    const methodData = this.getPaymentMethodData(paymentMethod);
    return methodData.description;
  }
}
