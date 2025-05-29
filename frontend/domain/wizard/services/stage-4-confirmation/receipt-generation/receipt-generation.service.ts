import { z } from 'zod';

import {
  generatePdfReceiptBody,
  generatePdfReceipt200Response,
  sendReceiptByEmailBody,
  sendReceiptByEmail200Response,
  getReceiptDataParams,
  getReceiptData200Response,
  downloadPdfReceiptParams,
} from '@/shared/api/generated/receipt/zod';

import { BaseWizardService } from '../../base.service';
import { PaymentMethodType } from '../../stage-3-order-params/payment-processing/payment-processing.service';

/**
 * Сервіс для бізнес-логіки генерації квитанції (Stage 4.4)
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація даних квитанції через orval Zod схеми
 * - Структурування даних квитанції згідно з бізнес-вимогами
 * - Форматування фінансових розрахунків з деталізацією
 * - Формування контенту email повідомлень українською мовою
 * - Генерація QR кодів для відстеження замовлень
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Фактичну генерацію PDF (роль backend API)
 * - Фактичну відправку email (роль backend API)
 */

// Використовуємо orval схеми напряму
export type PdfGenerationData = z.infer<typeof generatePdfReceiptBody>;
export type PdfGenerationResult = z.infer<typeof generatePdfReceipt200Response>;
export type EmailReceiptData = z.infer<typeof sendReceiptByEmailBody>;
export type EmailReceiptResult = z.infer<typeof sendReceiptByEmail200Response>;
export type ReceiptDataParams = z.infer<typeof getReceiptDataParams>;
export type ReceiptData = z.infer<typeof getReceiptData200Response>;
export type DownloadParams = z.infer<typeof downloadPdfReceiptParams>;

// Розширені типи для бізнес-логіки
export interface StructuredReceiptData {
  header: ReceiptHeaderData;
  orderInfo: ReceiptOrderInfo;
  clientInfo: ReceiptClientInfo;
  itemsTable: ReceiptItemData[];
  defectsSection: ReceiptDefectsSection;
  financialInfo: ReceiptFinancialInfo;
  legalInfo: ReceiptLegalInfo;
  signatures: ReceiptSignatures;
  footer: ReceiptFooter;
}

export interface ReceiptHeaderData {
  companyLogo: string;
  companyName: string;
  legalInfo: string;
  address: string;
  contacts: string;
  branchInfo: {
    name: string;
    address: string;
    phone: string;
    operatorName: string;
  };
}

export interface ReceiptOrderInfo {
  receiptNumber: string;
  tagNumber?: string;
  creationDate: string;
  expectedDeliveryDate: string;
  deliveryTime: string;
  expediteType?: 'STANDARD' | 'EXPRESS_48H' | 'EXPRESS_24H';
  expediteLabel: string;
}

export interface ReceiptClientInfo {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  communicationChannels: string[];
  preferredContactMethod: string;
}

export interface ReceiptItemData {
  orderNumber: number;
  name: string;
  serviceCategory: string;
  quantity: number;
  unitOfMeasure: string;
  material: string;
  color: string;
  filler?: string;
  wearPercentage?: number;
  basePrice: number;
  priceModifiers: ReceiptPriceModifier[];
  finalPrice: number;
  stains: string[];
  defects: string[];
  notes?: string;
}

export interface ReceiptPriceModifier {
  name: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  impact: number;
  formattedDescription: string;
}

export interface ReceiptDefectsSection {
  stains: Array<{
    type: string;
    description: string;
  }>;
  defects: Array<{
    type: string;
    description: string;
  }>;
  noWarrantyNote?: string;
  riskWarnings: string[];
}

export interface ReceiptFinancialInfo {
  servicesTotal: number;
  discountAmount?: number;
  discountType?: string;
  expediteSurcharge?: number;
  finalAmount: number;
  prepaymentAmount: number;
  balanceAmount: number;
  paymentMethod: 'TERMINAL' | 'CASH' | 'BANK_TRANSFER';
  formattedBreakdown: string[];
}

export interface ReceiptLegalInfo {
  serviceTerms: string;
  liabilityLimitations: string;
  riskInformation: string;
  fullTermsLink: string;
  warrantyConditions: string;
}

export interface ReceiptSignatures {
  customerDropOffSignature?: string;
  customerPickupSignature?: string;
  operatorSignature: string;
  companyStamp: boolean;
  termsAccepted: boolean;
}

export interface ReceiptFooter {
  contactInfo: string;
  workingHours: string;
  trackingQrCode?: string;
  websiteUrl: string;
  socialMediaLinks: string[];
}

export interface ReceiptValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingData: string[];
  structuredData?: StructuredReceiptData;
}

export interface EmailContentData {
  subject: string;
  message: string;
  recipientName: string;
  orderNumber: string;
  expectedDate: string;
  contactInfo: string;
}

export interface QrCodeData {
  orderId: string;
  trackingUrl: string;
  qrCodeSvg: string;
  qrCodeDataUrl: string;
}

export class ReceiptGenerationService extends BaseWizardService {
  protected readonly serviceName = 'ReceiptGenerationService';

  // Константи для часто використовуваних значень
  private readonly DEFAULT_NOT_SPECIFIED = 'Не вказано';
  private readonly DEFAULT_UNKNOWN_ERROR = 'Невідома помилка';

  private readonly companyInfo = {
    name: 'АКСІ Хімчистка',
    legalInfo: 'ТОВ "АКСІ", ЄДРПОУ: 12345678',
    address: 'м. Київ, вул. Хрещатик, 1',
    phone: '+380 44 123-45-67',
    email: 'info@aksi.vn.ua',
    website: 'https://aksi.vn.ua',
    workingHours: 'Пн-Пт: 8:00-20:00, Сб-Нд: 9:00-18:00',
  };

  /**
   * Валідація параметрів генерації PDF через orval Zod схему
   */
  validatePdfGeneration(params: { orderId: string; format?: string; includeSignature?: boolean }): {
    isValid: boolean;
    errors: string[];
    validatedParams?: PdfGenerationData;
  } {
    const errors: string[] = [];

    try {
      // Валідація через orval схему
      const orvalValidation = generatePdfReceiptBody.safeParse(params);
      if (!orvalValidation.success) {
        errors.push(...orvalValidation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      // Додаткова бізнес-валідація
      if (!params.orderId || params.orderId.trim().length === 0) {
        errors.push("ID замовлення обов'язкове для генерації квитанції");
      }

      if (params.format && !['A4', 'A5', 'THERMAL'].includes(params.format)) {
        errors.push('Непідтримуваний формат квитанції');
      }

      const validatedParams = orvalValidation.success ? orvalValidation.data : undefined;

      return {
        isValid: errors.length === 0,
        errors,
        validatedParams,
      };
    } catch (error) {
      this.logError('validatePdfGeneration', error);
      return {
        isValid: false,
        errors: [
          `Невідома помилка валідації параметрів PDF: ${error instanceof Error ? error.message : this.DEFAULT_UNKNOWN_ERROR}`,
        ],
      };
    }
  }

  /**
   * Валідація параметрів відправки email через orval Zod схему
   */
  validateEmailReceipt(params: {
    orderId: string;
    recipientEmail: string;
    subject?: string;
    message?: string;
    includeSignature?: boolean;
  }): {
    isValid: boolean;
    errors: string[];
    validatedParams?: EmailReceiptData;
  } {
    const errors: string[] = [];

    try {
      // Валідація через orval схему
      const orvalValidation = sendReceiptByEmailBody.safeParse(params);
      if (!orvalValidation.success) {
        errors.push(...orvalValidation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      // Додаткова валідація email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(params.recipientEmail)) {
        errors.push('Некоректний формат email адреси');
      }

      const validatedParams = orvalValidation.success ? orvalValidation.data : undefined;

      return {
        isValid: errors.length === 0,
        errors,
        validatedParams,
      };
    } catch (error) {
      this.logError('validateEmailReceipt', error);
      return {
        isValid: false,
        errors: [
          `Невідома помилка валідації email параметрів: ${error instanceof Error ? error.message : this.DEFAULT_UNKNOWN_ERROR}`,
        ],
      };
    }
  }

  /**
   * Валідація параметрів отримання даних квитанції
   */
  validateReceiptDataParams(params: { orderId: string }): {
    isValid: boolean;
    errors: string[];
    validatedParams?: ReceiptDataParams;
  } {
    const errors: string[] = [];

    try {
      // Валідація через orval схему
      const orvalValidation = getReceiptDataParams.safeParse(params);
      if (!orvalValidation.success) {
        errors.push(...orvalValidation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      const validatedParams = orvalValidation.success ? orvalValidation.data : undefined;

      return {
        isValid: errors.length === 0,
        errors,
        validatedParams,
      };
    } catch (error) {
      this.logError('validateReceiptDataParams', error);
      return {
        isValid: false,
        errors: [
          `Невідома помилка валідації параметрів даних: ${error instanceof Error ? error.message : this.DEFAULT_UNKNOWN_ERROR}`,
        ],
      };
    }
  }

  /**
   * Структурування даних квитанції з бізнес-логікою
   */
  structureReceiptData(receiptData: ReceiptData): ReceiptValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingData: string[] = [];

    try {
      // Валідація через orval схему
      const orvalValidation = getReceiptData200Response.safeParse(receiptData);
      if (!orvalValidation.success) {
        errors.push(...orvalValidation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      // Делегуємо валідацію до окремих методів
      this.validateReceiptHeader(receiptData, missingData);
      this.validateReceiptOrderInfo(receiptData, errors, missingData);
      this.validateReceiptClientInfo(receiptData, warnings, missingData);
      this.validateReceiptItems(receiptData, errors, warnings);
      this.validateReceiptFinancials(receiptData, errors);

      // Створюємо структуровані дані
      const structuredData = this.buildStructuredData(receiptData);

      return {
        isValid: errors.length === 0 && missingData.length === 0,
        errors,
        warnings,
        missingData,
        structuredData: errors.length === 0 ? structuredData : undefined,
      };
    } catch (error) {
      this.logError('structureReceiptData', error);
      return {
        isValid: false,
        errors: [
          `Помилка структурування даних квитанції: ${error instanceof Error ? error.message : this.DEFAULT_UNKNOWN_ERROR}`,
        ],
        warnings: [],
        missingData: [],
      };
    }
  }

  /**
   * Валідація заголовка квитанції
   */
  private validateReceiptHeader(receiptData: ReceiptData, missingData: string[]): void {
    if (!receiptData.branchInfo) {
      missingData.push('Інформація про філію');
    } else {
      if (!receiptData.branchInfo.branchName) {
        missingData.push('Назва філії');
      }
      if (!receiptData.branchInfo.address) {
        missingData.push('Адреса філії');
      }
      if (!receiptData.branchInfo.operatorName) {
        missingData.push("Ім'я оператора");
      }
    }
  }

  /**
   * Валідація інформації про замовлення
   */
  private validateReceiptOrderInfo(
    receiptData: ReceiptData,
    errors: string[],
    missingData: string[]
  ): void {
    if (!receiptData.receiptNumber) {
      missingData.push('Номер квитанції');
    }

    if (!receiptData.createdDate) {
      missingData.push('Дата створення');
    }

    if (!receiptData.expectedCompletionDate) {
      missingData.push('Дата завершення');
    } else {
      const createdDate = receiptData.createdDate ? new Date(receiptData.createdDate) : null;
      const completionDate = new Date(receiptData.expectedCompletionDate);

      if (createdDate && completionDate <= createdDate) {
        errors.push('Дата завершення не може бути раніше дати створення');
      }
    }
  }

  /**
   * Валідація інформації про клієнта
   */
  private validateReceiptClientInfo(
    receiptData: ReceiptData,
    warnings: string[],
    missingData: string[]
  ): void {
    if (!receiptData.clientInfo) {
      missingData.push('Інформація про клієнта');
      return;
    }

    if (!receiptData.clientInfo.firstName && !receiptData.clientInfo.lastName) {
      missingData.push("Ім'я або прізвище клієнта");
    }

    if (!receiptData.clientInfo.phone) {
      warnings.push("Відсутній номер телефону клієнта для зв'язку");
    }

    if (!receiptData.clientInfo.communicationChannels?.length) {
      warnings.push("Не вказані способи зв'язку з клієнтом");
    }
  }

  /**
   * Валідація предметів замовлення
   */
  private validateReceiptItems(
    receiptData: ReceiptData,
    errors: string[],
    warnings: string[]
  ): void {
    if (!receiptData.items || receiptData.items.length === 0) {
      errors.push('Замовлення не містить предметів');
      return;
    }

    receiptData.items.forEach((item, index) => {
      if (!item.name) {
        errors.push(`Предмет ${index + 1}: відсутня назва`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Предмет ${index + 1}: некоректна кількість`);
      }
      if (item.basePrice === undefined || item.basePrice < 0) {
        errors.push(`Предмет ${index + 1}: некоректна базова ціна`);
      }
      if (item.finalPrice === undefined || item.finalPrice < 0) {
        errors.push(`Предмет ${index + 1}: некоректна фінальна ціна`);
      }
      if (item.defects && item.defects.length > 0) {
        warnings.push(`Предмет ${index + 1}: має дефекти - потребує уваги`);
      }
    });
  }

  /**
   * Валідація фінансових даних
   */
  private validateReceiptFinancials(receiptData: ReceiptData, errors: string[]): void {
    if (!receiptData.financialInfo) {
      errors.push('Відсутня фінансова інформація');
      return;
    }

    const { financialInfo } = receiptData;

    if (financialInfo.finalAmount === undefined || financialInfo.finalAmount <= 0) {
      errors.push('Некоректна фінальна сума замовлення');
    }

    if (financialInfo.prepaymentAmount && financialInfo.finalAmount) {
      if (financialInfo.prepaymentAmount > financialInfo.finalAmount) {
        errors.push('Передоплата не може перевищувати загальну суму');
      }
    }

    // Перевірка розрахунку балансу
    if (financialInfo.finalAmount && financialInfo.prepaymentAmount !== undefined) {
      const expectedBalance = financialInfo.finalAmount - financialInfo.prepaymentAmount;
      if (
        financialInfo.balanceAmount !== undefined &&
        Math.abs(expectedBalance - financialInfo.balanceAmount) > 0.01
      ) {
        errors.push('Невідповідність розрахунку балансу');
      }
    }
  }

  /**
   * Побудова структурованих даних квитанції
   */
  private buildStructuredData(receiptData: ReceiptData): StructuredReceiptData {
    return {
      header: this.buildHeaderData(receiptData),
      orderInfo: this.buildOrderInfo(receiptData),
      clientInfo: this.buildClientInfo(receiptData),
      itemsTable: this.buildItemsTable(receiptData),
      defectsSection: this.buildDefectsSection(receiptData),
      financialInfo: this.buildFinancialInfo(receiptData),
      legalInfo: this.buildLegalInfo(receiptData),
      signatures: this.buildSignatures(receiptData),
      footer: this.buildFooter(receiptData),
    };
  }

  /**
   * Побудова даних заголовка
   */
  private buildHeaderData(receiptData: ReceiptData): ReceiptHeaderData {
    return {
      companyLogo: '/images/logo.png',
      companyName: this.companyInfo.name,
      legalInfo: this.companyInfo.legalInfo,
      address: this.companyInfo.address,
      contacts: `Тел: ${this.companyInfo.phone}, Email: ${this.companyInfo.email}`,
      branchInfo: {
        name: receiptData.branchInfo?.branchName || 'Основна філія',
        address: receiptData.branchInfo?.address || this.DEFAULT_NOT_SPECIFIED,
        phone: receiptData.branchInfo?.phone || this.companyInfo.phone,
        operatorName: receiptData.branchInfo?.operatorName || this.DEFAULT_NOT_SPECIFIED,
      },
    };
  }

  /**
   * Побудова інформації про замовлення
   */
  private buildOrderInfo(receiptData: ReceiptData): ReceiptOrderInfo {
    const expediteLabels = {
      STANDARD: 'Звичайне виконання',
      EXPRESS_48H: 'Термінове 48 годин (+50%)',
      EXPRESS_24H: 'Термінове 24 години (+100%)',
    };

    return {
      receiptNumber: receiptData.receiptNumber || 'Не присвоєно',
      tagNumber: receiptData.tagNumber,
      creationDate: this.formatDate(receiptData.createdDate),
      expectedDeliveryDate: this.formatDate(receiptData.expectedCompletionDate),
      deliveryTime: 'після 14:00',
      expediteType: receiptData.expediteType,
      expediteLabel: receiptData.expediteType
        ? expediteLabels[receiptData.expediteType]
        : expediteLabels.STANDARD,
    };
  }

  /**
   * Побудова інформації про клієнта
   */
  private buildClientInfo(receiptData: ReceiptData): ReceiptClientInfo {
    const clientInfo = receiptData.clientInfo;
    const fullName = clientInfo
      ? `${clientInfo.lastName || ''} ${clientInfo.firstName || ''}`.trim()
      : this.DEFAULT_NOT_SPECIFIED;

    return {
      fullName: fullName || this.DEFAULT_NOT_SPECIFIED,
      phone: clientInfo?.phone || this.DEFAULT_NOT_SPECIFIED,
      email: clientInfo?.email,
      address: clientInfo?.address,
      communicationChannels: clientInfo?.communicationChannels || [],
      preferredContactMethod: this.formatCommunicationChannels(
        clientInfo?.communicationChannels || []
      ),
    };
  }

  /**
   * Побудова таблиці предметів
   */
  private buildItemsTable(receiptData: ReceiptData): ReceiptItemData[] {
    if (!receiptData.items) return [];

    return receiptData.items.map((item, index) => ({
      orderNumber: item.orderNumber || index + 1,
      name: item.name || this.DEFAULT_NOT_SPECIFIED,
      serviceCategory: item.serviceCategory || this.DEFAULT_NOT_SPECIFIED,
      quantity: item.quantity || 1,
      unitOfMeasure: item.unitOfMeasure || 'шт',
      material: item.material || this.DEFAULT_NOT_SPECIFIED,
      color: item.color || this.DEFAULT_NOT_SPECIFIED,
      filler: item.filler,
      wearPercentage: item.wearPercentage,
      basePrice: item.basePrice || 0,
      priceModifiers: this.formatPriceModifiers(item.priceModifiers || []),
      finalPrice: item.finalPrice || 0,
      stains: item.stains || [],
      defects: item.defects || [],
      notes: item.notes,
    }));
  }

  /**
   * Форматування модифікаторів ціни
   */
  private formatPriceModifiers(
    modifiers: Array<{
      name?: string;
      description?: string;
      percentageValue?: number;
      fixedValue?: number;
      impact?: number;
    }>
  ): ReceiptPriceModifier[] {
    return modifiers.map((modifier) => {
      const isPercentage = modifier.percentageValue !== undefined;
      const value = isPercentage ? modifier.percentageValue || 0 : modifier.fixedValue || 0;

      return {
        name: modifier.name || 'Додаткова послуга',
        description: modifier.description || '',
        type: isPercentage ? 'PERCENTAGE' : 'FIXED',
        value,
        impact: modifier.impact || 0,
        formattedDescription: this.formatModifierDescription(modifier, isPercentage),
      };
    });
  }

  /**
   * Форматування опису модифікатора
   */
  private formatModifierDescription(
    modifier: {
      name?: string;
      description?: string;
      percentageValue?: number;
      fixedValue?: number;
      impact?: number;
    },
    isPercentage: boolean
  ): string {
    const name = modifier.name || 'Послуга';
    const impact = modifier.impact || 0;

    if (isPercentage) {
      const percentage = modifier.percentageValue || 0;
      const sign = impact >= 0 ? '+' : '';
      return `${name}: ${sign}${percentage}% (${sign}${this.formatAmount(impact)})`;
    } else {
      const sign = impact >= 0 ? '+' : '';
      return `${name}: ${sign}${this.formatAmount(impact)}`;
    }
  }

  /**
   * Побудова секції дефектів
   */
  private buildDefectsSection(receiptData: ReceiptData): ReceiptDefectsSection {
    const allStains: Array<{ type: string; description: string }> = [];
    const allDefects: Array<{ type: string; description: string }> = [];
    const riskWarnings: string[] = [];

    receiptData.items?.forEach((item) => {
      item.stains?.forEach((stain) => {
        allStains.push({ type: stain, description: stain });
      });

      item.defects?.forEach((defect) => {
        allDefects.push({ type: defect, description: defect });
        riskWarnings.push(`Предмет "${item.name}": ${defect}`);
      });
    });

    // Додаємо загальні попередження
    if (allDefects.length > 0) {
      riskWarnings.push('Хімчистка не несе відповідальності за предмети з існуючими дефектами');
    }

    return {
      stains: allStains,
      defects: allDefects,
      noWarrantyNote: allDefects.length > 0 ? 'Без гарантій через наявність дефектів' : undefined,
      riskWarnings,
    };
  }

  /**
   * Побудова фінансової інформації
   */
  private buildFinancialInfo(receiptData: ReceiptData): ReceiptFinancialInfo {
    const financialInfo = receiptData.financialInfo || {};
    const breakdown: string[] = [];

    // Формуємо деталізацію розрахунку
    if (financialInfo.totalAmount) {
      breakdown.push(`Вартість послуг: ${this.formatAmount(financialInfo.totalAmount)}`);
    }

    if (financialInfo.discountAmount && financialInfo.discountAmount > 0) {
      const discountType = financialInfo.discountType || 'Знижка';
      breakdown.push(`${discountType}: -${this.formatAmount(financialInfo.discountAmount)}`);
    }

    if (financialInfo.expediteSurcharge && financialInfo.expediteSurcharge > 0) {
      breakdown.push(
        `Надбавка за терміновість: +${this.formatAmount(financialInfo.expediteSurcharge)}`
      );
    }

    return {
      servicesTotal: financialInfo.totalAmount || 0,
      discountAmount: financialInfo.discountAmount,
      discountType: financialInfo.discountType,
      expediteSurcharge: financialInfo.expediteSurcharge,
      finalAmount: financialInfo.finalAmount || 0,
      prepaymentAmount: financialInfo.prepaymentAmount || 0,
      balanceAmount: financialInfo.balanceAmount || 0,
      paymentMethod: this.validatePaymentMethod(receiptData.paymentMethod),
      formattedBreakdown: breakdown,
    };
  }

  /**
   * Валідація та нормалізація способу оплати
   */
  private validatePaymentMethod(paymentMethod: unknown): PaymentMethodType {
    const validMethods: PaymentMethodType[] = ['TERMINAL', 'CASH', 'BANK_TRANSFER'];

    if (
      typeof paymentMethod === 'string' &&
      validMethods.includes(paymentMethod as PaymentMethodType)
    ) {
      return paymentMethod as PaymentMethodType;
    }

    // За замовчуванням повертаємо готівку
    return 'CASH';
  }

  /**
   * Побудова юридичної інформації
   */
  private buildLegalInfo(receiptData: ReceiptData): ReceiptLegalInfo {
    return {
      serviceTerms: receiptData.legalTerms || this.getDefaultLegalTerms(),
      liabilityLimitations: this.getLiabilityLimitations(),
      riskInformation: this.getRiskInformation(),
      fullTermsLink: `${this.companyInfo.website}/terms`,
      warrantyConditions: this.getWarrantyConditions(),
    };
  }

  /**
   * Побудова інформації про підписи
   */
  private buildSignatures(receiptData: ReceiptData): ReceiptSignatures {
    return {
      customerDropOffSignature: receiptData.customerSignatureData,
      operatorSignature: 'Підпис оператора',
      companyStamp: true,
      termsAccepted: receiptData.termsAccepted || false,
    };
  }

  /**
   * Побудова футера
   */
  private buildFooter(receiptData: ReceiptData): ReceiptFooter {
    return {
      contactInfo: `${this.companyInfo.phone} | ${this.companyInfo.email}`,
      workingHours: this.companyInfo.workingHours,
      trackingQrCode: receiptData.orderId
        ? this.generateTrackingUrl(receiptData.orderId)
        : undefined,
      websiteUrl: this.companyInfo.website,
      socialMediaLinks: ['@aksi_kyiv', 'facebook.com/aksi.kyiv'],
    };
  }

  /**
   * Генерація контенту email повідомлення
   */
  generateEmailContent(receiptData: ReceiptData, recipientName?: string): EmailContentData {
    const clientName =
      recipientName ||
      (receiptData.clientInfo
        ? `${receiptData.clientInfo.firstName || ''} ${receiptData.clientInfo.lastName || ''}`.trim()
        : 'Шановний клієнте');

    const orderNumber = receiptData.receiptNumber || 'Не присвоєно';
    const expectedDate = this.formatDate(receiptData.expectedCompletionDate);

    return {
      subject: `АКСІ Хімчистка - Квитанція №${orderNumber}`,
      message: this.buildEmailMessage(clientName, orderNumber, expectedDate),
      recipientName: clientName,
      orderNumber,
      expectedDate,
      contactInfo: `${this.companyInfo.phone} | ${this.companyInfo.email}`,
    };
  }

  /**
   * Побудова тексту email повідомлення
   */
  private buildEmailMessage(clientName: string, orderNumber: string, expectedDate: string): string {
    return `${clientName}!

Дякуємо, що обрали АКСІ Хімчистка!

Ваше замовлення №${orderNumber} прийнято до виконання.

Деталі замовлення:
- Номер квитанції: ${orderNumber}
- Очікувана дата готовності: ${expectedDate} після 14:00

У додатку знаходиться PDF-квитанція з детальною інформацією про Ваше замовлення.

При отриманні замовлення, будь ласка, мийте при собі:
- Дану квитанцію або її номер
- Документ, що посвідчує особу

Для довідок та відстеження статусу замовлення:
Телефон: ${this.companyInfo.phone}
Email: ${this.companyInfo.email}
Сайт: ${this.companyInfo.website}

Графік роботи: ${this.companyInfo.workingHours}

З повагою,
Команда АКСІ Хімчистка`;
  }

  /**
   * Генерація URL для відстеження замовлення
   */
  private generateTrackingUrl(orderId: string): string {
    return `${this.companyInfo.website}/track/${orderId}`;
  }

  /**
   * Отримання стандартних умов обслуговування
   */
  private getDefaultLegalTerms(): string {
    return `Умови надання послуг хімчистки:
1. Строк зберігання готових виробів - 30 діб з дня готовності.
2. При несвоєчасному отриманні замовлення нараховується плата за зберігання.
3. Рекламації приймаються протягом 3-х діб з моменту видачі.
4. Хімчистка не несе відповідальності за предмети з прихованими дефектами.`;
  }

  /**
   * Отримання обмежень відповідальності
   */
  private getLiabilityLimitations(): string {
    return `Обмеження відповідальності:
- За предмети з натурального хутра та шкіри - згідно з технологічними можливостями
- За вироби з втраченими або пошкодженими бирками складу
- За зміну кольору внаслідок особливостей фарбування виробу`;
  }

  /**
   * Отримання інформації про ризики
   */
  private getRiskInformation(): string {
    return `Можливі ризики обробки:
- Усадка виробів з натуральних волокон
- Зміна кольору застарілих або некачественних фарбників
- Деформація декоративних елементів`;
  }

  /**
   * Отримання умов гарантії
   */
  private getWarrantyConditions(): string {
    return `Гарантійні зобов'язання:
- Повторна обробка у разі незадовільної якості (безкоштовно)
- Відшкодування вартості послуги при доведеній вині хімчистки
- Гарантія не поширюється на предмети з попередніми дефектами`;
  }

  /**
   * Форматування дати українською мовою
   */
  private formatDate(dateString?: string): string {
    if (!dateString) return this.DEFAULT_NOT_SPECIFIED;

    const date = new Date(dateString);
    const months = [
      'січня',
      'лютого',
      'березня',
      'квітня',
      'травня',
      'червня',
      'липня',
      'серпня',
      'вересня',
      'жовтня',
      'листопада',
      'грудня',
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year} р.`;
  }

  /**
   * Форматування способів зв'язку
   */
  private formatCommunicationChannels(channels: string[]): string {
    if (!channels.length) return 'Телефонний дзвінок';

    const channelLabels: Record<string, string> = {
      PHONE: 'Телефонний дзвінок',
      SMS: 'SMS повідомлення',
      VIBER: 'Viber',
      TELEGRAM: 'Telegram',
      EMAIL: 'Email',
    };

    return channels.map((channel) => channelLabels[channel] || channel).join(', ');
  }

  /**
   * Форматування фінансових сум
   */
  private formatAmount(amount: number): string {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Перевірка готовності даних для генерації квитанції
   */
  checkReceiptReadiness(receiptData: ReceiptData): {
    isReady: boolean;
    readinessIssues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Критичні перевірки
    if (!receiptData.orderId) {
      issues.push('Відсутній ID замовлення');
    }

    if (!receiptData.receiptNumber) {
      issues.push('Відсутній номер квитанції');
    }

    if (!receiptData.clientInfo) {
      issues.push('Відсутня інформація про клієнта');
    }

    if (!receiptData.items || receiptData.items.length === 0) {
      issues.push('Відсутні предмети замовлення');
    }

    if (!receiptData.financialInfo?.finalAmount) {
      issues.push('Відсутня фінальна сума замовлення');
    }

    // Рекомендації
    if (!receiptData.clientInfo?.email) {
      recommendations.push('Додайте email клієнта для автоматичної відправки квитанції');
    }

    if (!receiptData.customerSignatureData) {
      recommendations.push('Додайте цифровий підпис клієнта');
    }

    if (!receiptData.tagNumber) {
      recommendations.push('Додайте унікальну мітку замовлення');
    }

    return {
      isReady: issues.length === 0,
      readinessIssues: issues,
      recommendations,
    };
  }
}
