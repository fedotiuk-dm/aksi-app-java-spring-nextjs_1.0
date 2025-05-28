import { z, ZodError } from 'zod';

import {
  createClientBody,
  updateClientBody,
  getClientById200Response,
} from '@/shared/api/generated/client/zod/aksiApi';

import { BaseWizardService } from '../../base.service';

import type {
  ClientResponseCommunicationChannelsItem,
  AddressDTO,
} from '@/shared/api/generated/client';

// Константи для уникнення дублювання
const INVALID_PHONE_ERROR = 'Невірний формат телефону';
const INVALID_EMAIL_ERROR = 'Невірний формат email';
const OTHER_SOURCE_ERROR_MESSAGE = 'Вкажіть джерело інформації в полі "Інше"';

// Zod схеми для валідації додаткових полів
const phoneValidationSchema = z
  .string()
  .regex(/^\+380[0-9]{9}$/, 'Введіть коректний український номер телефону (+380XXXXXXXXX)');

const emailValidationSchema = z.string().email('Введіть коректний email адресу');

const addressFieldSchema = z.object({
  city: z
    .string()
    .min(2, 'Назва міста має містити мінімум 2 символи')
    .max(100, 'Назва міста не може містити більше 100 символів')
    .regex(/^[\p{L}\s.,\-']+$/u, 'Назва міста містить недопустимі символи')
    .optional(),
  street: z
    .string()
    .min(2, 'Назва вулиці має містити мінімум 2 символи')
    .max(150, 'Назва вулиці не може містити більше 150 символів')
    .regex(/^[\p{L}\s0-9.,\-']+$/u, 'Назва вулиці містить недопустимі символи')
    .optional(),
  building: z.string().max(20, 'Номер будинку не може містити більше 20 символів').optional(),
  apartment: z.string().max(20, 'Номер квартири не може містити більше 20 символів').optional(),
  postalCode: z
    .string()
    .max(10, 'Поштовий код не може містити більше 10 символів')
    .regex(/^[0-9\-]+$/, 'Поштовий код може містити тільки цифри та дефіси')
    .optional(),
  fullAddress: z
    .string()
    .min(5, 'Повна адреса має містити мінімум 5 символів')
    .max(500, 'Повна адреса не може містити більше 500 символів')
    .optional(),
});

const contactMethodSchema = z.object({
  type: z.enum(['PHONE', 'SMS', 'VIBER']),
  value: z.string().min(1, "Значення способу зв'язку не може бути порожнім"),
  preferred: z.boolean().optional(),
});

const contactMethodsArraySchema = z.array(contactMethodSchema).refine(
  (methods) => {
    const preferredMethods = methods.filter((m) => m.preferred);
    return preferredMethods.length <= 1;
  },
  {
    message: "Можна обрати тільки один основний спосіб зв'язку",
  }
);

/**
 * Сервіс валідації даних клієнтів (SOLID: SRP - тільки валідація)
 *
 * Відповідальність:
 * - Валідація даних клієнта через Orval + Zod схеми
 * - Валідація контактних даних
 * - Валідація структурованих адрес
 * - Валідація способів зв'язку
 * - Додаткова бізнес-валідація через власні Zod схеми
 */

// === ZOD СХЕМА ДЛЯ UI ФОРМИ ===

/**
 * Zod схема для форми клієнта (UI-friendly)
 * Основана на API схемі з додатковими полями для UI
 */
export const clientFormSchema = createClientBody
  .extend({
    // Додаткові UI поля для зручності форми
    informationSourceOther: z.string().optional(),
  })
  .refine(
    (data) => {
      // Якщо джерело "OTHER", то потрібно вказати деталі
      return !(data.source === 'OTHER' && !data.sourceDetails?.trim());
    },
    {
      message: OTHER_SOURCE_ERROR_MESSAGE,
      path: ['sourceDetails'],
    }
  );

// === ТИПИ ===

export interface ClientValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ContactMethod {
  type: ClientResponseCommunicationChannelsItem;
  value: string;
  preferred?: boolean;
}

// UI-зручний тип для форми на основі Zod схем
export type ClientFormData = z.infer<typeof clientFormSchema>;

export class ClientValidationService extends BaseWizardService {
  protected readonly serviceName = 'ClientValidationService';

  /**
   * 🔥 Валідація даних клієнта через Orval + Zod схеми
   */
  validateClientData(clientData: ClientFormData): ClientValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Валідація через Orval Zod схему
    const zodValidation = this.validateWithZodSchema(clientFormSchema, clientData);
    errors.push(...zodValidation.errors);

    // Додаткова бізнес-валідація
    const businessValidation = this.performBusinessValidation(clientData);
    errors.push(...businessValidation.errors);
    warnings.push(...businessValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * 🔥 Валідація даних для оновлення клієнта через Orval + Zod схеми
   */
  validateUpdateClientData(clientData: ClientFormData): ClientValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Валідація через Orval Zod схему для оновлення
    const zodValidation = this.validateWithZodSchema(updateClientBody, clientData);
    errors.push(...zodValidation.errors);

    // Додаткова бізнес-валідація (та ж сама як для створення)
    const businessValidation = this.performBusinessValidation(clientData);
    errors.push(...businessValidation.errors);
    warnings.push(...businessValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * 🔥 Валідація відповіді API через Zod схему
   */
  validateClientResponse(responseData: unknown): ClientValidationResult {
    const errors: string[] = [];

    try {
      getClientById200Response.parse(responseData);
      return { isValid: true, errors: [] };
    } catch (zodError) {
      if (zodError instanceof ZodError) {
        zodError.errors.forEach((error) => {
          const field = error.path.join('.');
          errors.push(`API Response ${field}: ${error.message}`);
        });
      } else {
        errors.push('Невірна структура відповіді від сервера');
      }
    }

    return {
      isValid: false,
      errors,
    };
  }

  /**
   * Валідація структурованої адреси
   */
  validateStructuredAddress(address: AddressDTO): ClientValidationResult {
    return this.validateStructuredAddressWithZod(address);
  }

  /**
   * Валідація структурованої адреси через Zod схеми
   */
  private validateStructuredAddressWithZod(address: AddressDTO): ClientValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      addressFieldSchema.parse(address);
    } catch (zodError) {
      if (zodError instanceof ZodError) {
        zodError.errors.forEach((error) => {
          const field = error.path.join('.');
          errors.push(`Адреса ${field}: ${error.message}`);
        });
      } else {
        errors.push('Невірні дані адреси');
      }
    }

    // Додаткові попередження
    const addressWarnings = this.getAddressWarnings(address);
    warnings.push(...addressWarnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Валідація способів зв'язку через Zod
   */
  validateContactMethodsWithZod(methods: ContactMethod[]): ClientValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      contactMethodsArraySchema.parse(methods);
    } catch (zodError) {
      if (zodError instanceof ZodError) {
        zodError.errors.forEach((error) => {
          const field = error.path.join('.');
          errors.push(`Способи зв'язку ${field}: ${error.message}`);
        });
      } else {
        errors.push("Невірні дані способів зв'язку");
      }
    }

    // Додаткова валідація телефонних номерів
    methods.forEach((method, index) => {
      const phoneValidation = this.validatePhoneNumber(method.value);
      if (!phoneValidation.isValid) {
        errors.push(`Спосіб зв'язку ${index + 1}: ${phoneValidation.error}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  // === ПРИВАТНІ МЕТОДИ ВАЛІДАЦІЇ ===

  /**
   * Загальна валідація через Zod схему
   */
  private validateWithZodSchema(schema: z.ZodType, data: unknown): { errors: string[] } {
    const errors: string[] = [];

    try {
      schema.parse(data);
    } catch (zodError) {
      if (zodError instanceof ZodError) {
        zodError.errors.forEach((error) => {
          const field = error.path.join('.');
          errors.push(`${field}: ${error.message}`);
        });
      } else {
        errors.push('Невірні дані форми');
      }
    }

    return { errors };
  }

  /**
   * Додаткова бізнес-валідація
   */
  private performBusinessValidation(clientData: ClientFormData): {
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Валідація телефону
    const phoneValidation = this.validatePhoneNumber(clientData.phone);
    if (!phoneValidation.isValid) {
      errors.push(phoneValidation.error || INVALID_PHONE_ERROR);
    }

    // Валідація email
    if (clientData.email?.trim()) {
      const emailValidation = this.validateEmail(clientData.email);
      if (!emailValidation.isValid) {
        errors.push(emailValidation.error || INVALID_EMAIL_ERROR);
      }
    }

    // Валідація адреси
    if (clientData.structuredAddress) {
      const addressValidation = this.validateStructuredAddressWithZod(clientData.structuredAddress);
      errors.push(...addressValidation.errors);
      if (addressValidation.warnings) {
        warnings.push(...addressValidation.warnings);
      }
    }

    // Перевірка джерела інформації
    if (clientData.source === 'OTHER' && !clientData.informationSourceOther?.trim()) {
      warnings.push(OTHER_SOURCE_ERROR_MESSAGE);
    }

    return { errors, warnings };
  }

  /**
   * Валідація номеру телефону через Zod
   */
  private validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
    const normalized = this.normalizePhoneNumber(phone);

    const result = phoneValidationSchema.safeParse(normalized);
    if (!result.success) {
      this.logWarning('Невалідний телефон:', result.error.errors);
      return {
        isValid: false,
        error: result.error.errors[0]?.message || 'Невірний формат телефону',
      };
    }

    return { isValid: true };
  }

  /**
   * Нормалізація номеру телефону через Zod
   */
  private normalizePhoneNumber(phone: string): string {
    const inputValidation = z.string().min(1).safeParse(phone);
    if (!inputValidation.success) {
      this.logWarning('Порожній телефон для нормалізації');
      return '';
    }

    // Видаляємо всі не-цифрові символи крім +
    let normalized = inputValidation.data.replace(/[^\d+]/g, '');

    // Перетворюємо на український формат
    if (normalized.startsWith('0')) {
      normalized = '+38' + normalized;
    } else if (normalized.startsWith('380')) {
      normalized = '+' + normalized;
    } else if (!normalized.startsWith('+380')) {
      normalized = '+380' + normalized.replace(/^\+?/, '');
    }

    return normalized;
  }

  /**
   * Валідація email через Zod
   */
  private validateEmail(email: string): { isValid: boolean; error?: string } {
    const result = emailValidationSchema.safeParse(email);
    if (!result.success) {
      this.logWarning('Невалідний email:', result.error.errors);
      return {
        isValid: false,
        error: result.error.errors[0]?.message || 'Невірний формат email',
      };
    }

    return { isValid: true };
  }

  /**
   * Валідація поля повної адреси через Zod
   */
  private validateFullAddress(fullAddress?: string): string[] {
    if (!fullAddress) return [];

    const result = z
      .string()
      .min(5, 'Повна адреса має містити мінімум 5 символів')
      .max(500, 'Повна адреса не може містити більше 500 символів')
      .safeParse(fullAddress);

    if (!result.success) {
      this.logWarning('Невалідна повна адреса:', result.error.errors);
      return result.error.errors.map((e) => e.message);
    }

    return [];
  }

  /**
   * Валідація окремих полів адреси через Zod
   */
  private validateAddressFields(address: AddressDTO): string[] {
    const result = addressFieldSchema.safeParse(address);

    if (!result.success) {
      this.logWarning('Невалідні поля адреси:', result.error.errors);
      return result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    }

    return [];
  }

  /**
   * Валідація поля міста через Zod
   */
  private validateCityField(city: string): string[] {
    const result = z
      .string()
      .min(2, 'Назва міста має містити від 2 до 100 символів')
      .max(100, 'Назва міста має містити від 2 до 100 символів')
      .regex(/^[\p{L}\s.,\-']+$/u, 'Назва міста містить недопустимі символи')
      .safeParse(city);

    if (!result.success) {
      this.logWarning('Невалідне місто:', result.error.errors);
      return result.error.errors.map((e) => e.message);
    }

    return [];
  }

  /**
   * Валідація поля вулиці через Zod
   */
  private validateStreetField(street: string): string[] {
    const result = z
      .string()
      .min(2, 'Назва вулиці має містити від 2 до 150 символів')
      .max(150, 'Назва вулиці має містити від 2 до 150 символів')
      .regex(/^[\p{L}\s0-9.,\-']+$/u, 'Назва вулиці містить недопустимі символи')
      .safeParse(street);

    if (!result.success) {
      this.logWarning('Невалідна вулиця:', result.error.errors);
      return result.error.errors.map((e) => e.message);
    }

    return [];
  }

  /**
   * Валідація поштового коду через Zod
   */
  private validatePostalCode(postalCode: string): string[] {
    const result = z
      .string()
      .max(10, 'Поштовий код не може містити більше 10 символів')
      .regex(/^[0-9\-]+$/, 'Поштовий код може містити тільки цифри та дефіси')
      .safeParse(postalCode);

    if (!result.success) {
      this.logWarning('Невалідний поштовий код:', result.error.errors);
      return result.error.errors.map((e) => e.message);
    }

    return [];
  }

  /**
   * Збір попереджень для адреси
   */
  private getAddressWarnings(address: AddressDTO): string[] {
    const warnings: string[] = [];

    if (address.city && !address.street) {
      warnings.push('Рекомендується вказати вулицю');
    }

    if (address.street && !address.building) {
      warnings.push('Рекомендується вказати номер будинку');
    }

    return warnings;
  }
}
