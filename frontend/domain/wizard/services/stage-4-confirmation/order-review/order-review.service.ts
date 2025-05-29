import { z } from 'zod';

import {
  getOrderDetailedSummaryParams,
  getOrderDetailedSummary200Response,
} from '@/shared/api/generated/order/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс для бізнес-логіки перегляду замовлення (Stage 4.1)
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація параметрів перегляду через orval Zod схеми
 * - Структурування детального розрахунку (згідно документації 4.1)
 * - Бізнес-правила для відображення модифікаторів ціни
 * - Форматування фінансових даних
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Відображення UI (роль компонентів)
 */

// Використовуємо orval схеми напряму
export type OrderDetailedSummary = z.infer<typeof getOrderDetailedSummary200Response>;
export type OrderDetailedParams = z.infer<typeof getOrderDetailedSummaryParams>;

// Локальна схема для опцій перегляду
const reviewOptionsSchema = z.object({
  orderId: z.string().uuid('Некоректний формат ID замовлення'),
  includeCalculationDetails: z.boolean().default(true),
  includePaymentSummary: z.boolean().default(true),
  includeItemPhotos: z.boolean().default(false),
  includePriceModifiers: z.boolean().default(true),
  showDiscountBreakdown: z.boolean().default(true),
});

export type ReviewOptions = z.infer<typeof reviewOptionsSchema>;

// Структуровані типи для детального перегляду (згідно документації 4.1)
export interface DetailedOrderInfo {
  id: string;
  receiptNumber: string;
  tagNumber?: string;
  createdDate: string;
  expectedCompletionDate?: string;
  customerNotes?: string;
}

export interface DetailedClientInfo {
  id?: string;
  fullName: string;
  phone?: string;
  email?: string;
  address?: string;
  communicationChannels?: ('PHONE' | 'SMS' | 'VIBER')[];
  source?: 'INSTAGRAM' | 'GOOGLE' | 'RECOMMENDATION' | 'OTHER';
}

export interface DetailedBranchInfo {
  id?: string;
  name: string;
  address: string;
  phone?: string;
  code: string;
}

export interface PriceModifier {
  name: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'MULTIPLIER';
  value: number;
  amount: number;
}

export interface DetailedOrderItem {
  id: string;
  name: string;
  category?: string;
  quantity: number;
  unitOfMeasure?: string;
  material?: string;
  color?: string;
  filler?: string;
  fillerClumped?: boolean;
  wearPercentage?: number;
  stains?: string[];
  defects?: string[];
  defectNotes?: string;
  basePrice: number;
  priceModifiers: PriceModifier[];
  finalPrice: number;
  photos?: Array<{
    id?: string;
    fileUrl?: string;
    thumbnailUrl?: string;
    description?: string;
  }>;
}

export interface DetailedPaymentSummary {
  totalAmount: number;
  discountAmount?: number;
  discountType?: string;
  discountPercentage?: number;
  expediteSurchargeAmount?: number;
  expediteType?: 'STANDARD' | 'EXPRESS_48H' | 'EXPRESS_24H';
  finalAmount: number;
  prepaymentAmount?: number;
  balanceAmount?: number;
}

export interface StructuredOrderReview {
  orderInfo: DetailedOrderInfo;
  clientInfo?: DetailedClientInfo;
  branchInfo?: DetailedBranchInfo;
  items: DetailedOrderItem[];
  paymentSummary: DetailedPaymentSummary;
  calculationBreakdown?: {
    itemsTotal: number;
    modifiersTotal: number;
    discountTotal: number;
    expediteTotal: number;
    grandTotal: number;
  };
}

export interface ReviewValidationResult {
  isValid: boolean;
  errors: string[];
  validatedParams?: OrderDetailedParams;
}

export class OrderReviewService extends BaseWizardService {
  protected readonly serviceName = 'OrderReviewService';

  /**
   * Валідація параметрів перегляду через orval Zod схему
   */
  validateReviewParams(params: { orderId: string }): ReviewValidationResult {
    const errors: string[] = [];

    try {
      // Валідація через orval схему
      const orvalValidation = getOrderDetailedSummaryParams.safeParse(params);
      if (!orvalValidation.success) {
        errors.push(...orvalValidation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      // Додаткова бізнес-валідація
      if (!params.orderId || params.orderId.trim().length === 0) {
        errors.push("ID замовлення обов'язкове");
      }

      const validatedParams = orvalValidation.success ? orvalValidation.data : undefined;

      return {
        isValid: errors.length === 0,
        errors,
        validatedParams,
      };
    } catch (error) {
      this.logError('validateReviewParams', error);
      return {
        isValid: false,
        errors: ['Невідома помилка валідації параметрів'],
      };
    }
  }

  /**
   * Валідація опцій перегляду
   */
  validateReviewOptions(options: ReviewOptions): {
    isValid: boolean;
    errors: string[];
    validatedOptions?: ReviewOptions;
  } {
    try {
      const validation = reviewOptionsSchema.safeParse(options);

      if (!validation.success) {
        return {
          isValid: false,
          errors: validation.error.errors.map((e: z.ZodIssue) => e.message),
        };
      }

      return {
        isValid: true,
        errors: [],
        validatedOptions: validation.data,
      };
    } catch (error) {
      this.logError('validateReviewOptions', error);
      return {
        isValid: false,
        errors: ['Помилка валідації опцій перегляду'],
      };
    }
  }

  /**
   * Структурування детального перегляду з деталізацією розрахунків (згідно документації 4.1)
   */
  structureOrderReview(
    orderData: OrderDetailedSummary,
    options: ReviewOptions = {
      orderId: '',
      includeCalculationDetails: true,
      includePaymentSummary: true,
      includeItemPhotos: false,
      includePriceModifiers: true,
      showDiscountBreakdown: true,
    }
  ): StructuredOrderReview {
    // Структурування інформації про замовлення
    const orderInfo: DetailedOrderInfo = {
      id: orderData.id || '',
      receiptNumber: orderData.receiptNumber || '',
      tagNumber: orderData.tagNumber,
      createdDate: orderData.createdDate || new Date().toISOString(),
      expectedCompletionDate: orderData.expectedCompletionDate,
      customerNotes: orderData.customerNotes,
    };

    // Структурування інформації про клієнта
    const clientInfo: DetailedClientInfo | undefined = orderData.client
      ? {
          id: orderData.client.id,
          fullName:
            orderData.client.fullName ||
            `${orderData.client.firstName || ''} ${orderData.client.lastName || ''}`.trim(),
          phone: orderData.client.phone,
          email: orderData.client.email,
          address: orderData.client.address,
          communicationChannels: orderData.client.communicationChannels,
          source: orderData.client.source,
        }
      : undefined;

    // Структурування інформації про філію
    const branchInfo: DetailedBranchInfo | undefined = orderData.branchLocation
      ? {
          id: orderData.branchLocation.id,
          name: orderData.branchLocation.name,
          address: orderData.branchLocation.address,
          phone: orderData.branchLocation.phone,
          code: orderData.branchLocation.code,
        }
      : undefined;

    // Структурування предметів з детальною деталізацією розрахунків
    const items: DetailedOrderItem[] = (orderData.items || []).map((item) => ({
      id: item.id || '',
      name: item.name || '',
      category: item.category,
      quantity: item.quantity || 1,
      unitOfMeasure: item.unitOfMeasure,
      material: item.material,
      color: item.color,
      filler: item.filler,
      fillerClumped: item.fillerClumped,
      wearPercentage: item.wearPercentage,
      stains: item.stains,
      defects: item.defects,
      defectNotes: item.defectNotes,
      basePrice: item.basePrice || 0,
      priceModifiers: options.includePriceModifiers
        ? (item.priceModifiers || []).map((mod) => ({
            name: mod.name || '',
            description: mod.description,
            type: mod.type || 'PERCENTAGE',
            value: mod.value || 0,
            amount: mod.amount || 0,
          }))
        : [],
      finalPrice: item.finalPrice || 0,
      photos: options.includeItemPhotos
        ? (item.photos || []).map((photo) => ({
            id: photo.id,
            fileUrl: photo.fileUrl,
            thumbnailUrl: photo.thumbnailUrl,
            description: photo.description,
          }))
        : undefined,
    }));

    // Структурування платіжного підсумку
    const paymentSummary: DetailedPaymentSummary = {
      totalAmount: orderData.totalAmount || 0,
      discountAmount: orderData.discountAmount,
      discountType: orderData.discountType,
      discountPercentage: orderData.discountPercentage,
      expediteSurchargeAmount: orderData.expediteSurchargeAmount,
      expediteType: orderData.expediteType,
      finalAmount: orderData.finalAmount || 0,
      prepaymentAmount: orderData.prepaymentAmount,
      balanceAmount: orderData.balanceAmount,
    };

    // Розрахунок детального розбивання (якщо потрібно)
    const calculationBreakdown = options.includeCalculationDetails
      ? this.calculateBreakdown(items, paymentSummary)
      : undefined;

    return {
      orderInfo,
      clientInfo,
      branchInfo,
      items,
      paymentSummary,
      calculationBreakdown,
    };
  }

  /**
   * Розрахунок детального розбивання витрат
   */
  private calculateBreakdown(
    items: DetailedOrderItem[],
    paymentSummary: DetailedPaymentSummary
  ): {
    itemsTotal: number;
    modifiersTotal: number;
    discountTotal: number;
    expediteTotal: number;
    grandTotal: number;
  } {
    const itemsTotal = items.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);
    const modifiersTotal = items.reduce(
      (sum, item) => sum + item.priceModifiers.reduce((modSum, mod) => modSum + mod.amount, 0),
      0
    );

    return {
      itemsTotal,
      modifiersTotal,
      discountTotal: paymentSummary.discountAmount || 0,
      expediteTotal: paymentSummary.expediteSurchargeAmount || 0,
      grandTotal: paymentSummary.finalAmount,
    };
  }

  /**
   * Перевірка готовності замовлення до підтвердження
   */
  checkOrderReadiness(orderData: OrderDetailedSummary): {
    isReady: boolean;
    missingData: string[];
    warnings: string[];
  } {
    const missingData: string[] = [];
    const warnings: string[] = [];

    // Перевірка обов'язкових даних
    if (!orderData.receiptNumber) {
      missingData.push('Номер квитанції');
    }

    if (!orderData.client?.fullName && !orderData.client?.firstName) {
      missingData.push('Інформація про клієнта');
    }

    if (!orderData.branchLocation?.name) {
      missingData.push('Інформація про філію');
    }

    if (!orderData.items || orderData.items.length === 0) {
      missingData.push('Предмети замовлення');
    }

    if (!orderData.finalAmount || orderData.finalAmount <= 0) {
      missingData.push('Сума замовлення');
    }

    // Попередження
    if (!orderData.client?.phone) {
      warnings.push('Відсутній номер телефону клієнта');
    }

    if (!orderData.expectedCompletionDate) {
      warnings.push('Не вказана дата виконання');
    }

    if ((orderData.balanceAmount || 0) > 0) {
      warnings.push('Замовлення не повністю оплачене');
    }

    return {
      isReady: missingData.length === 0,
      missingData,
      warnings,
    };
  }

  /**
   * Форматування модифікаторів ціни для відображення
   */
  formatPriceModifiers(modifiers: PriceModifier[]): Array<{
    name: string;
    description: string;
    displayValue: string;
    amount: string;
    isPositive: boolean;
  }> {
    return modifiers.map((modifier) => ({
      name: modifier.name,
      description: modifier.description || '',
      displayValue: this.formatModifierValue(modifier),
      amount: this.formatAmount(modifier.amount),
      isPositive: modifier.amount >= 0,
    }));
  }

  /**
   * Форматування значення модифікатора
   */
  private formatModifierValue(modifier: PriceModifier): string {
    switch (modifier.type) {
      case 'PERCENTAGE':
        return `${modifier.value > 0 ? '+' : ''}${modifier.value}%`;
      case 'FIXED_AMOUNT':
        return this.formatAmount(modifier.value);
      case 'MULTIPLIER':
        return `×${modifier.value}`;
      default:
        return modifier.value.toString();
    }
  }

  /**
   * Форматування фінансових сум
   */
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Створення підсумку для квитанції
   */
  generateReceiptSummary(orderReview: StructuredOrderReview): {
    orderInfo: string[];
    clientInfo: string[];
    itemsSummary: string[];
    financialSummary: string[];
  } {
    const orderInfo = [
      `Квитанція №: ${orderReview.orderInfo.receiptNumber}`,
      `Дата створення: ${this.formatDate(orderReview.orderInfo.createdDate)}`,
    ];

    if (orderReview.orderInfo.tagNumber) {
      orderInfo.push(`Мітка: ${orderReview.orderInfo.tagNumber}`);
    }

    if (orderReview.orderInfo.expectedCompletionDate) {
      orderInfo.push(
        `Готовність: ${this.formatDate(orderReview.orderInfo.expectedCompletionDate)}`
      );
    }

    const clientInfo = orderReview.clientInfo
      ? [
          `Клієнт: ${orderReview.clientInfo.fullName}`,
          ...(orderReview.clientInfo.phone ? [`Телефон: ${orderReview.clientInfo.phone}`] : []),
          ...(orderReview.clientInfo.email ? [`Email: ${orderReview.clientInfo.email}`] : []),
        ]
      : [];

    const itemsSummary = orderReview.items.map(
      (item) =>
        `${item.name} - ${item.quantity} ${item.unitOfMeasure || 'шт.'} - ${this.formatAmount(item.finalPrice)}`
    );

    const financialSummary = [
      `Сума до знижок: ${this.formatAmount(orderReview.paymentSummary.totalAmount)}`,
      ...(orderReview.paymentSummary.discountAmount
        ? [`Знижка: ${this.formatAmount(orderReview.paymentSummary.discountAmount)}`]
        : []),
      ...(orderReview.paymentSummary.expediteSurchargeAmount
        ? [`Терміновість: ${this.formatAmount(orderReview.paymentSummary.expediteSurchargeAmount)}`]
        : []),
      `Загальна сума: ${this.formatAmount(orderReview.paymentSummary.finalAmount)}`,
      ...(orderReview.paymentSummary.prepaymentAmount
        ? [`Передоплата: ${this.formatAmount(orderReview.paymentSummary.prepaymentAmount)}`]
        : []),
      ...(orderReview.paymentSummary.balanceAmount
        ? [`До доплати: ${this.formatAmount(orderReview.paymentSummary.balanceAmount)}`]
        : []),
    ];

    return {
      orderInfo,
      clientInfo,
      itemsSummary,
      financialSummary,
    };
  }

  /**
   * Форматування дати
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}
