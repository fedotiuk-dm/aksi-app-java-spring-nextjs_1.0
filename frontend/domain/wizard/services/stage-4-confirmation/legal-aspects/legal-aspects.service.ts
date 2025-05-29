import { z } from 'zod';

import {
  saveSignatureBody,
  saveSignature201Response,
  getSignatureById200Response,
  getSignaturesByOrderId200Response,
  getSignatureByOrderIdAndType200Response,
} from '@/shared/api/generated/client/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс для бізнес-логіки юридичних аспектів (Stage 4.2)
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація підписів через orval Zod схеми
 * - Бізнес-правила для цифрового підпису
 * - Управління умовами надання послуг
 * - Валідація прийняття юридичних умов
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Відображення UI (роль компонентів)
 */

// Використовуємо orval схеми напряму
export type SignatureCreateData = z.infer<typeof saveSignatureBody>;
export type SignatureData = z.infer<typeof saveSignature201Response>;
export type SignatureInfo = z.infer<typeof getSignatureById200Response>;
export type OrderSignatures = z.infer<typeof getSignaturesByOrderId200Response>;
export type TypedSignature = z.infer<typeof getSignatureByOrderIdAndType200Response>;

// Енум типів підписів
export type SignatureType = 'CUSTOMER_RECEIPT' | 'CUSTOMER_PICKUP' | 'EMPLOYEE' | 'MANAGER';

// Локальна композитна схема для валідації юридичних даних
const legalValidationSchema = z.object({
  agreementAccepted: z.boolean().refine((val) => val === true, {
    message: 'Необхідно прийняти умови надання послуг',
  }),
  signatureRequired: z.boolean().optional().default(true),
  customerSignature: z.string().optional(),
  witnessRequired: z.boolean().optional().default(false),
  witnessSignature: z.string().optional(),
  documentsProvided: z.array(z.string()).optional(),
});

export type LegalValidationData = z.infer<typeof legalValidationSchema>;

// Схема для валідації підпису
const signatureValidationSchema = saveSignatureBody.extend({
  minLength: z.number().min(10).default(10),
  maxLength: z.number().max(5000).default(5000),
  mustAcceptTerms: z.boolean().default(true),
});

export type SignatureValidationData = z.infer<typeof signatureValidationSchema>;

export interface LegalValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingRequirements: string[];
}

export interface SignatureValidationResult {
  isValid: boolean;
  errors: string[];
  validatedData?: SignatureCreateData;
}

export interface LegalDocument {
  title: string;
  url: string;
  type: 'law' | 'regulation' | 'standard' | 'company_policy';
  description?: string;
  mandatory: boolean;
}

export interface TermsOfService {
  version: string;
  title: string;
  content: string[];
  effectiveDate: string;
  lastModified: string;
}

export class LegalAspectsService extends BaseWizardService {
  protected readonly serviceName = 'LegalAspectsService';

  /**
   * Валідація юридичних даних через orval Zod схему
   */
  validateLegalData(legalData: LegalValidationData): LegalValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingRequirements: string[] = [];

    try {
      // Валідація через локальну схему
      const validation = legalValidationSchema.safeParse(legalData);
      if (!validation.success) {
        errors.push(...validation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      // Бізнес-логіка валідації
      if (legalData.signatureRequired && !legalData.customerSignature) {
        missingRequirements.push('Необхідний цифровий підпис клієнта');
      }

      if (legalData.witnessRequired && !legalData.witnessSignature) {
        missingRequirements.push('Необхідний підпис свідка');
      }

      if (!legalData.agreementAccepted) {
        missingRequirements.push('Клієнт повинен прийняти умови надання послуг');
      }

      // Попередження
      if (legalData.customerSignature && legalData.customerSignature.length < 20) {
        warnings.push('Підпис клієнта може бути занадто коротким');
      }

      if (!legalData.documentsProvided || legalData.documentsProvided.length === 0) {
        warnings.push('Не вказано які документи надані клієнту');
      }

      return {
        isValid: errors.length === 0 && missingRequirements.length === 0,
        errors,
        warnings,
        missingRequirements,
      };
    } catch (error) {
      this.logError('validateLegalData', error);
      return {
        isValid: false,
        errors: ['Невідома помилка валідації юридичних даних'],
        warnings: [],
        missingRequirements: [],
      };
    }
  }

  /**
   * Валідація підпису через orval Zod схему
   */
  validateSignature(signatureData: SignatureValidationData): SignatureValidationResult {
    const errors: string[] = [];

    try {
      // Валідація через orval схему
      const orvalValidation = saveSignatureBody.safeParse(signatureData);
      if (!orvalValidation.success) {
        errors.push(...orvalValidation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      // Додаткова валідація через розширену схему
      const extendedValidation = signatureValidationSchema.safeParse(signatureData);
      if (!extendedValidation.success) {
        errors.push(...extendedValidation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      // Бізнес-логіка валідації підпису
      if (!signatureData.signatureData || signatureData.signatureData.trim().length === 0) {
        errors.push('Підпис не може бути порожнім');
      }

      if (signatureData.signatureData && signatureData.signatureData.length < 10) {
        errors.push('Підпис занадто короткий (мінімум 10 символів)');
      }

      if (signatureData.signatureData && signatureData.signatureData.length > 5000) {
        errors.push('Підпис занадто довгий (максимум 5000 символів)');
      }

      if (signatureData.mustAcceptTerms && !signatureData.termsAccepted) {
        errors.push('Необхідно прийняти умови користування');
      }

      const validatedData = orvalValidation.success ? orvalValidation.data : undefined;

      return {
        isValid: errors.length === 0,
        errors,
        validatedData,
      };
    } catch (error) {
      this.logError('validateSignature', error);
      return {
        isValid: false,
        errors: ['Невідома помилка валідації підпису'],
      };
    }
  }

  /**
   * Перевірка типу підпису
   */
  validateSignatureType(signatureType: string): { isValid: boolean; errors: string[] } {
    const validTypes: SignatureType[] = [
      'CUSTOMER_RECEIPT',
      'CUSTOMER_PICKUP',
      'EMPLOYEE',
      'MANAGER',
    ];

    if (!validTypes.includes(signatureType as SignatureType)) {
      return {
        isValid: false,
        errors: [`Недопустимий тип підпису: ${signatureType}. Дозволені: ${validTypes.join(', ')}`],
      };
    }

    return { isValid: true, errors: [] };
  }

  /**
   * Отримання типів підписів з описом
   */
  getSignatureTypes(): Array<{
    type: SignatureType;
    label: string;
    description: string;
    required: boolean;
  }> {
    return [
      {
        type: 'CUSTOMER_RECEIPT',
        label: 'Підпис клієнта при здачі',
        description: 'Підпис клієнта під час здавання речей до хімчистки',
        required: true,
      },
      {
        type: 'CUSTOMER_PICKUP',
        label: 'Підпис клієнта при отриманні',
        description: 'Підпис клієнта під час отримання речей з хімчистки',
        required: false,
      },
      {
        type: 'EMPLOYEE',
        label: 'Підпис співробітника',
        description: 'Підпис співробітника, який приймає замовлення',
        required: true,
      },
      {
        type: 'MANAGER',
        label: 'Підпис менеджера',
        description: 'Підпис менеджера для особливих випадків',
        required: false,
      },
    ];
  }

  /**
   * Отримання стандартних умов надання послуг
   */
  getTermsOfService(): TermsOfService {
    return {
      version: '2.1',
      title: 'Умови надання послуг хімчистки',
      content: [
        'Термін виконання замовлення вказаний орієнтовно та може бути змінений з технічних причин',
        'Хімчистка не несе відповідальності за ризики, вказані у квитанції та підтверджені клієнтом',
        'Вироби видаються тільки при наявності квитанції та документа, що посвідчує особу',
        'Претензії щодо якості надання послуг приймаються протягом 3 днів після видачі замовлення',
        'У випадку втрати квитанції, видача замовлення здійснюється за особливою процедурою',
        'Клієнт несе відповідальність за достовірність інформації про характеристики виробів',
        'Хімчистка має право відмовитися від виконання замовлення у випадку неможливості обробки',
        'Строк зберігання готового замовлення складає 30 днів з дати готовності',
      ],
      effectiveDate: '2024-01-01T00:00:00Z',
      lastModified: new Date().toISOString(),
    };
  }

  /**
   * Отримання обов'язкових юридичних документів
   */
  getLegalDocuments(): LegalDocument[] {
    return [
      {
        title: 'Закон України "Про захист прав споживачів"',
        url: 'https://zakon.rada.gov.ua/laws/show/1023-12',
        type: 'law',
        description: 'Основний закон про права споживачів в Україні',
        mandatory: true,
      },
      {
        title: 'ДСТУ 7946:2015 "Послуги хімічної чистки"',
        url: 'https://dstu.gov.ua/ua/catalog/std?id=36895',
        type: 'standard',
        description: 'Національний стандарт України для послуг хімчистки',
        mandatory: true,
      },
      {
        title: 'Правила побутового обслуговування',
        url: 'https://zakon.rada.gov.ua/laws/show/z0786-94',
        type: 'regulation',
        description: 'Правила надання послуг у сфері побутового обслуговування',
        mandatory: true,
      },
      {
        title: 'Політика конфіденційності компанії',
        url: '/legal/privacy-policy',
        type: 'company_policy',
        description: 'Внутрішня політика обробки персональних даних',
        mandatory: false,
      },
    ];
  }

  /**
   * Перевірка необхідності додаткових підписів
   */
  checkAdditionalSignatureRequirements(orderData: {
    totalAmount: number;
    hasRisks: boolean;
    isUrgent: boolean;
    hasSpecialConditions: boolean;
  }): {
    managerSignatureRequired: boolean;
    witnessRequired: boolean;
    additionalDocuments: string[];
    reasons: string[];
  } {
    const reasons: string[] = [];
    const additionalDocuments: string[] = [];
    let managerSignatureRequired = false;
    let witnessRequired = false;

    // Великі суми потребують підпису менеджера
    if (orderData.totalAmount > 10000) {
      managerSignatureRequired = true;
      reasons.push('Сума замовлення перевищує 10,000 грн');
    }

    // Ризиковані замовлення
    if (orderData.hasRisks) {
      witnessRequired = true;
      reasons.push('Замовлення містить ризики пошкодження');
      additionalDocuments.push('Додаткова угода про ризики');
    }

    // Термінові замовлення
    if (orderData.isUrgent) {
      additionalDocuments.push('Угода про термінове виконання');
      reasons.push('Термінове виконання замовлення');
    }

    // Особливі умови
    if (orderData.hasSpecialConditions) {
      managerSignatureRequired = true;
      reasons.push('Замовлення має особливі умови виконання');
    }

    return {
      managerSignatureRequired,
      witnessRequired,
      additionalDocuments,
      reasons,
    };
  }

  /**
   * Генерація тексту угоди для конкретного замовлення
   */
  generateOrderAgreementText(orderData: {
    receiptNumber: string;
    clientName: string;
    totalAmount: number;
    expectedDate: string;
    risks?: string[];
  }): string {
    const { receiptNumber, clientName, totalAmount, expectedDate, risks = [] } = orderData;

    let agreementText = `
УГОДА про надання послуг хімчистки

Квитанція №: ${receiptNumber}
Клієнт: ${clientName}
Сума: ${this.formatAmount(totalAmount)}
Очікувана дата готовності: ${this.formatDate(expectedDate)}

Умови надання послуг:
${this.getTermsOfService()
  .content.map((term, index) => `${index + 1}. ${term}`)
  .join('\n')}
    `;

    if (risks.length > 0) {
      agreementText += `\n\nВИЯВЛЕНІ РИЗИКИ:\n${risks.map((risk, index) => `${index + 1}. ${risk}`).join('\n')}`;
      agreementText +=
        '\n\nКлієнт підтверджує, що ознайомлений з ризиками та погоджується на обробку.';
    }

    agreementText += '\n\nПідписуючи цю угоду, клієнт підтверджує згоду з усіма умовами.';

    return agreementText.trim();
  }

  /**
   * Форматування суми в гривнях
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

  /**
   * Перевірка дійсності підпису (базова валідація)
   */
  isSignatureValid(signatureData: string): {
    isValid: boolean;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    issues: string[];
  } {
    const issues: string[] = [];
    let quality: 'poor' | 'fair' | 'good' | 'excellent' = 'poor';

    if (!signatureData || signatureData.trim().length === 0) {
      issues.push('Підпис порожній');
      return { isValid: false, quality: 'poor', issues };
    }

    // Оцінка якості підпису за довжиною
    if (signatureData.length < 10) {
      issues.push('Підпис занадто короткий');
      quality = 'poor';
    } else if (signatureData.length < 50) {
      quality = 'fair';
    } else if (signatureData.length < 200) {
      quality = 'good';
    } else {
      quality = 'excellent';
    }

    // Перевірка на шаблонні підписи
    if (signatureData.includes('signature') || signatureData.includes('test')) {
      issues.push('Підпис схожий на тестовий');
      quality = 'poor';
    }

    return {
      isValid: issues.length === 0,
      quality,
      issues,
    };
  }
}
