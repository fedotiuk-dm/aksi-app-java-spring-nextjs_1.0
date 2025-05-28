import { z } from 'zod';

import { BaseWizardService } from '../../base.service';

import type { ClientFormData, ContactMethod } from './client-validation.service';
import type {
  ClientResponse,
  CreateClientRequest,
  UpdateClientRequest,
  ClientResponseCommunicationChannelsItem,
  ClientResponseSource,
} from '@/shared/api/generated/client';

// Zod схеми для валідації маппінгу
const phoneNormalizationSchema = z.string().min(10, 'Телефон повинен містити мінімум 10 цифр');

const structuredAddressMapSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  building: z.string().optional(),
  apartment: z.string().optional(),
});

const wizardClientSchema = z.object({
  id: z.string().min(1, "ID клієнта обов'язковий"),
  firstName: z.string().min(1, "Ім'я обов'язкове"),
  lastName: z.string().min(1, "Прізвище обов'язкове"),
  fullName: z.string().min(1, "Повне ім'я обов'язкове"),
  phone: z.string().min(10, "Телефон обов'язковий"),
  email: z.string().email().optional(),
  address: z.string().optional(),
  structuredAddress: z
    .object({
      street: z.string(),
      city: z.string(),
      zipCode: z.string().optional(),
      country: z.string(),
    })
    .optional(),
  communicationChannels: z.array(z.enum(['PHONE', 'SMS', 'VIBER'])),
  source: z.enum(['INSTAGRAM', 'GOOGLE', 'RECOMMENDATION', 'OTHER']).optional(),
  sourceDetails: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  orderCount: z.number().int().min(0).optional(),
});

const createClientRequestSchema = z.object({
  firstName: z.string().min(1, "Ім'я обов'язкове").trim(),
  lastName: z.string().min(1, "Прізвище обов'язкове").trim(),
  phone: z.string().min(10, "Телефон обов'язковий"),
  email: z.string().email().optional().or(z.literal(undefined)),
  address: z.string().optional().or(z.literal(undefined)),
  structuredAddress: structuredAddressMapSchema.optional(),
  communicationChannels: z.array(z.enum(['PHONE', 'SMS', 'VIBER'])),
  source: z.enum(['INSTAGRAM', 'GOOGLE', 'RECOMMENDATION', 'OTHER']),
  sourceDetails: z.string().optional().or(z.literal(undefined)),
});

export type ValidatedWizardClient = z.infer<typeof wizardClientSchema>;
export type ValidatedCreateClientRequest = z.infer<typeof createClientRequestSchema>;

/**
 * Сервіс для перетворення типів даних клієнтів (SOLID: SRP - тільки mapping)
 *
 * Відповідальність:
 * - Перетворення Orval типів в UI-зручні типи
 * - Перетворення UI типів в Orval типи для API
 * - Перетворення API відповідей в Wizard типи
 * - Нормалізація даних
 * - Валідація даних при перетворенні (Zod)
 */

export interface InformationSource {
  type: ClientResponseSource;
  details?: string;
}

// 🔥 Proper тип для Wizard Client замість any
export interface WizardClient {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  structuredAddress?: {
    street: string;
    city: string;
    zipCode?: string;
    country: string;
  };
  communicationChannels: ClientResponseCommunicationChannelsItem[];
  source?: ClientResponseSource;
  sourceDetails?: string;
  createdAt: string;
  updatedAt: string;
  orderCount?: number;
}

export class ClientMapperService extends BaseWizardService {
  protected readonly serviceName = 'ClientMapperService';

  /**
   * Валідація даних клієнта з API перед маппінгом
   */
  private validateApiResponse(data: unknown): ClientResponse {
    // Мінімальна валідація для API відповідей
    if (!data || typeof data !== 'object') {
      this.logWarning('Невалідна API відповідь клієнта');
      throw new Error('Невалідна API відповідь клієнта');
    }
    return data as ClientResponse;
  }

  /**
   * Валідація CreateClientRequest перед відправкою
   */
  private validateCreateRequest(data: unknown): ValidatedCreateClientRequest {
    const result = createClientRequestSchema.safeParse(data);
    if (!result.success) {
      this.logError('Невалідні дані для створення клієнта:', result.error.errors);
      throw new Error(`Валідація створення клієнта: ${result.error.errors[0]?.message}`);
    }
    return result.data;
  }

  /**
   * Валідація телефону для нормалізації
   */
  private validatePhone(phone: unknown): string {
    const result = phoneNormalizationSchema.safeParse(phone);
    if (!result.success) {
      this.logWarning('Невалідний телефон для нормалізації:', result.error.errors);
      return String(phone || '');
    }
    return result.data;
  }

  /**
   * Перетворення Orval типу в UI-зручний тип
   */
  mapApiToForm(clientResponse: ClientResponse): ClientFormData {
    const validatedResponse = this.validateApiResponse(clientResponse);

    // Створюємо базовий об'єкт з обов'язковими полями для ClientFormData
    const formData: ClientFormData = {
      firstName: validatedResponse.firstName || '',
      lastName: validatedResponse.lastName || '',
      phone: validatedResponse.phone || '',
      email: validatedResponse.email || undefined,
      address: validatedResponse.address || undefined,
      structuredAddress: validatedResponse.structuredAddress,
      communicationChannels: validatedResponse.communicationChannels,
      source: validatedResponse.source || 'RECOMMENDATION',
      sourceDetails: validatedResponse.sourceDetails,
      // informationSourceOther заповнюється окремо при необхідності
    };

    return formData;
  }

  /**
   * Перетворення UI форми в Orval тип для створення клієнта
   */
  mapFormToCreateRequest(clientData: ClientFormData): CreateClientRequest {
    const mappedData = {
      firstName: clientData.firstName.trim(),
      lastName: clientData.lastName.trim(),
      phone: this.normalizePhoneNumber(clientData.phone),
      email: clientData.email?.trim() || undefined,
      address: clientData.address?.trim() || undefined,
      structuredAddress: clientData.structuredAddress,
      communicationChannels: clientData.communicationChannels || [],
      source: clientData.source || 'RECOMMENDATION',
      sourceDetails: clientData.informationSourceOther?.trim() || clientData.sourceDetails,
    };

    // Валідуємо перед поверненням
    const validated = this.validateCreateRequest(mappedData);
    return validated as CreateClientRequest;
  }

  /**
   * Перетворення UI форми в Orval тип для оновлення клієнта
   */
  mapFormToUpdateRequest(clientData: ClientFormData): UpdateClientRequest {
    // Використовуємо ті ж дані що і для створення
    const createData = this.mapFormToCreateRequest(clientData);
    return createData as UpdateClientRequest;
  }

  /**
   * Перетворення ClientResponse з API в ClientSearchResult для wizard
   */
  mapApiToWizardClient(client: ClientResponse): WizardClient {
    const validatedResponse = this.validateApiResponse(client);

    const mappedClient = {
      id: validatedResponse.id || '',
      firstName: validatedResponse.firstName || '',
      lastName: validatedResponse.lastName || '',
      fullName: this.formatClientFullName(validatedResponse),
      phone: validatedResponse.phone || '',
      email: validatedResponse.email,
      address: validatedResponse.address,
      structuredAddress: validatedResponse.structuredAddress
        ? {
            street: validatedResponse.structuredAddress.street || '',
            city: validatedResponse.structuredAddress.city || '',
            zipCode: validatedResponse.structuredAddress.postalCode,
            country: 'Україна',
          }
        : undefined,
      communicationChannels: validatedResponse.communicationChannels || [],
      source: validatedResponse.source,
      sourceDetails: validatedResponse.sourceDetails,
      createdAt: validatedResponse.createdAt || new Date().toISOString(),
      updatedAt: validatedResponse.updatedAt || new Date().toISOString(),
      orderCount: validatedResponse.orderCount,
    };

    // Валідуємо результат маппінгу
    const validationResult = wizardClientSchema.safeParse(mappedClient);
    if (!validationResult.success) {
      this.logWarning('Невалідний результат маппінгу WizardClient:', validationResult.error.errors);
      // Повертаємо як є, але логуємо попередження
    }

    return mappedClient;
  }

  /**
   * Створення повного імені клієнта
   */
  formatClientFullName(client: ClientResponse): string {
    const validatedResponse = this.validateApiResponse(client);
    return (
      validatedResponse.fullName ||
      `${validatedResponse.lastName || ''} ${validatedResponse.firstName || ''}`.trim()
    );
  }

  // === ПРИВАТНІ МЕТОДИ ПЕРЕТВОРЕННЯ ===

  /**
   * Нормалізація номеру телефону
   */
  private normalizePhoneNumber(phone: string): string {
    const validPhone = this.validatePhone(phone);

    // Видаляємо всі не-цифрові символи крім +
    let normalized = validPhone.replace(/[^\d+]/g, '');

    // Перетворюємо на український формат
    if (normalized.startsWith('0')) {
      normalized = '+38' + normalized;
    } else if (normalized.startsWith('380')) {
      normalized = '+' + normalized;
    } else if (!normalized.startsWith('+380')) {
      normalized = '+380' + normalized.replace(/^\+?/, '');
    }

    // Фінальна валідація нормалізованого телефону
    const finalValidation = z
      .string()
      .regex(/^\+380\d{9}$/, 'Невірний формат українського телефону')
      .safeParse(normalized);
    if (!finalValidation.success) {
      this.logWarning('Неможливо нормалізувати телефон:', finalValidation.error.errors);
      return validPhone; // Повертаємо оригінал
    }

    return finalValidation.data;
  }

  /**
   * Перетворення способів зв'язку з API формату
   */
  private mapContactMethods(
    apiMethods?: ClientResponseCommunicationChannelsItem[]
  ): ContactMethod[] {
    if (!apiMethods) return [];

    // Валідуємо кожен метод
    const validMethods = apiMethods.filter((method) => {
      const validation = z.enum(['PHONE', 'SMS', 'VIBER']).safeParse(method);
      if (!validation.success) {
        this.logWarning("Невалідний спосіб зв'язку:", method);
        return false;
      }
      return true;
    });

    return validMethods.map((method) => ({
      type: method,
      value: '', // Значення має встановлюватися окремо або через додаткову логіку
      preferred: false,
    }));
  }

  /**
   * Перетворення способів зв'язку в API формат
   */
  private mapContactMethodsToApi(
    methods?: ContactMethod[]
  ): ClientResponseCommunicationChannelsItem[] {
    if (!methods) return [];

    // Валідуємо та фільтруємо методи
    const validMethods = methods
      .map((method) => method.type)
      .filter((type) => {
        const validation = z.enum(['PHONE', 'SMS', 'VIBER']).safeParse(type);
        if (!validation.success) {
          this.logWarning("Невалідний тип зв'язку при маппінгу:", type);
          return false;
        }
        return true;
      });

    return validMethods as ClientResponseCommunicationChannelsItem[];
  }
}
