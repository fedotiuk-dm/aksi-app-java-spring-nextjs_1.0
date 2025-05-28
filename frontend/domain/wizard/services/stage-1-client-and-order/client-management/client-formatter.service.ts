import { z } from 'zod';

import { BaseWizardService } from '../../base.service';

import type {
  ClientResponse,
  AddressDTO,
  ClientResponseCommunicationChannelsItem,
  ClientResponseSource,
} from '@/shared/api/generated/client';

// Zod схеми для валідації даних при форматуванні
const phoneDisplaySchema = z.string().min(1, 'Телефон не може бути порожнім');

const addressFormatSchema = z.object({
  city: z.string().optional(),
  street: z.string().optional(),
  building: z.string().optional(),
  apartment: z.string().optional(),
  postalCode: z.string().optional(),
  fullAddress: z.string().optional(),
});

const communicationChannelSchema = z.enum(['PHONE', 'SMS', 'VIBER']);

const sourceSchema = z.enum(['INSTAGRAM', 'GOOGLE', 'RECOMMENDATION', 'OTHER']);

const clientFormatSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  communicationChannels: z.array(communicationChannelSchema).optional(),
  source: sourceSchema.optional(),
  sourceDetails: z.string().optional(),
  orderCount: z.number().optional(),
  updatedAt: z.string().optional(),
  address: z.string().optional(),
  structuredAddress: addressFormatSchema.optional(),
});

export type FormattableClient = z.infer<typeof clientFormatSchema>;
export type FormattableAddress = z.infer<typeof addressFormatSchema>;

/**
 * Сервіс для форматування даних клієнтів (SOLID: SRP - тільки форматування)
 *
 * Відповідальність:
 * - Форматування адрес для відображення
 * - Форматування імен клієнтів
 * - Форматування номерів телефонів
 * - Форматування способів зв'язку
 * - Форматування джерел інформації
 * - Валідація даних перед форматуванням (Zod)
 */

export class ClientFormatterService extends BaseWizardService {
  protected readonly serviceName = 'ClientFormatterService';

  // Константи для уникнення дублювання
  private static readonly NOT_SPECIFIED = 'Не вказано';
  private static readonly ADDRESS_NOT_SPECIFIED = 'Адреса не вказана';
  private static readonly SEPARATOR = ', ';
  private static readonly INVALID_DATE_MESSAGE = 'Невірна дата';

  /**
   * Валідація даних клієнта перед форматуванням
   */
  private validateClient(client: unknown): FormattableClient {
    const result = clientFormatSchema.safeParse(client);
    if (!result.success) {
      this.logWarning('Невалідні дані клієнта для форматування:', result.error.errors);
      // Повертаємо мінімальний об'єкт для безпечного форматування
      return {};
    }
    return result.data;
  }

  /**
   * Валідація адреси перед форматуванням
   */
  private validateAddress(address: unknown): FormattableAddress {
    const result = addressFormatSchema.safeParse(address);
    if (!result.success) {
      this.logWarning('Невалідна адреса для форматування:', result.error.errors);
      return {};
    }
    return result.data;
  }

  /**
   * Валідація телефону перед форматуванням
   */
  private validatePhone(phone: unknown): string {
    const result = phoneDisplaySchema.safeParse(phone);
    if (!result.success) {
      this.logWarning('Невалідний телефон для форматування:', result.error.errors);
      return '';
    }
    return result.data;
  }

  /**
   * Форматування адреси для відображення
   */
  formatAddress(address: AddressDTO): string {
    const validAddress = this.validateAddress(address);

    if (validAddress.fullAddress) {
      return validAddress.fullAddress;
    }

    const parts: string[] = [];

    if (validAddress.city) parts.push(validAddress.city);
    if (validAddress.street) parts.push(validAddress.street);
    if (validAddress.building) parts.push(`буд. ${validAddress.building}`);
    if (validAddress.apartment) parts.push(`кв. ${validAddress.apartment}`);
    if (validAddress.postalCode) parts.push(validAddress.postalCode);

    return (
      parts.join(ClientFormatterService.SEPARATOR) || ClientFormatterService.ADDRESS_NOT_SPECIFIED
    );
  }

  /**
   * Форматування короткої адреси (тільки місто та вулиця)
   */
  formatShortAddress(address: AddressDTO): string {
    const validAddress = this.validateAddress(address);
    const parts: string[] = [];

    if (validAddress.city) parts.push(validAddress.city);
    if (validAddress.street) parts.push(validAddress.street);
    if (validAddress.building) parts.push(validAddress.building);

    return (
      parts.join(ClientFormatterService.SEPARATOR) || ClientFormatterService.ADDRESS_NOT_SPECIFIED
    );
  }

  /**
   * Створення повного імені клієнта
   */
  formatClientFullName(client: ClientResponse): string {
    const validClient = this.validateClient(client);
    return (
      validClient.fullName || `${validClient.lastName || ''} ${validClient.firstName || ''}`.trim()
    );
  }

  /**
   * Форматування короткого імені (ініціали)
   */
  formatClientInitials(client: ClientResponse): string {
    const validClient = this.validateClient(client);
    const firstName = validClient.firstName?.charAt(0)?.toUpperCase() || '';
    const lastName = validClient.lastName?.charAt(0)?.toUpperCase() || '';
    return `${lastName}${firstName}`;
  }

  /**
   * Форматування номеру телефону для відображення
   */
  formatPhoneForDisplay(phone: string): string {
    const validPhone = this.validatePhone(phone);
    if (!validPhone) return phone;

    // Очікуємо формат +380XXXXXXXXX
    const cleaned = validPhone.replace(/\D/g, '');

    if (cleaned.length === 12 && cleaned.startsWith('380')) {
      const countryCode = cleaned.substring(0, 3);
      const operatorCode = cleaned.substring(3, 5);
      const number1 = cleaned.substring(5, 8);
      const number2 = cleaned.substring(8, 10);
      const number3 = cleaned.substring(10, 12);

      return `+${countryCode} (${operatorCode}) ${number1}-${number2}-${number3}`;
    }

    return validPhone; // Повертаємо як є, якщо формат не відповідає
  }

  /**
   * Форматування способу зв'язку для відображення
   */
  formatCommunicationChannel(channel: ClientResponseCommunicationChannelsItem): string {
    const validationResult = communicationChannelSchema.safeParse(channel);
    if (!validationResult.success) {
      this.logWarning("Невалідний спосіб зв'язку:", validationResult.error.errors);
      return 'Інший';
    }

    const validChannel = validationResult.data;
    switch (validChannel) {
      case 'PHONE':
        return 'Телефон';
      case 'SMS':
        return 'SMS';
      case 'VIBER':
        return 'Viber';
      default:
        return 'Інший';
    }
  }

  /**
   * Форматування списку способів зв'язку
   */
  formatCommunicationChannelsList(channels: ClientResponseCommunicationChannelsItem[]): string {
    if (!channels || channels.length === 0) {
      return ClientFormatterService.NOT_SPECIFIED;
    }

    return channels
      .map((channel) => this.formatCommunicationChannel(channel))
      .join(ClientFormatterService.SEPARATOR);
  }

  /**
   * Форматування джерела інформації
   */
  formatInformationSource(source: ClientResponseSource, sourceDetails?: string): string {
    const validationResult = sourceSchema.safeParse(source);
    if (!validationResult.success) {
      this.logWarning('Невалідне джерело інформації:', validationResult.error.errors);
      return ClientFormatterService.NOT_SPECIFIED;
    }

    const validSource = validationResult.data;
    let baseSource = '';

    switch (validSource) {
      case 'INSTAGRAM':
        baseSource = 'Instagram';
        break;
      case 'GOOGLE':
        baseSource = 'Google';
        break;
      case 'RECOMMENDATION':
        baseSource = 'Рекомендації';
        break;
      case 'OTHER':
        baseSource = 'Інше';
        break;
      default:
        baseSource = ClientFormatterService.NOT_SPECIFIED;
    }

    if (sourceDetails && validSource === 'OTHER') {
      return `${baseSource} (${sourceDetails})`;
    }

    return baseSource;
  }

  /**
   * Форматування дати створення/оновлення
   */
  formatDate(dateString?: string): string {
    if (!dateString) return ClientFormatterService.NOT_SPECIFIED;

    const dateValidation = z.string().datetime().or(z.string().date()).safeParse(dateString);
    if (!dateValidation.success) {
      this.logWarning('Невалідна дата для форматування:', dateValidation.error.errors);
      return ClientFormatterService.INVALID_DATE_MESSAGE;
    }

    try {
      const date = new Date(dateValidation.data);
      return date.toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return ClientFormatterService.INVALID_DATE_MESSAGE;
    }
  }

  /**
   * Форматування дати та часу
   */
  formatDateTime(dateString?: string): string {
    if (!dateString) return ClientFormatterService.NOT_SPECIFIED;

    const dateValidation = z.string().datetime().or(z.string().date()).safeParse(dateString);
    if (!dateValidation.success) {
      this.logWarning('Невалідна дата для форматування:', dateValidation.error.errors);
      return ClientFormatterService.INVALID_DATE_MESSAGE;
    }

    try {
      const date = new Date(dateValidation.data);
      return date.toLocaleString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return ClientFormatterService.INVALID_DATE_MESSAGE;
    }
  }

  /**
   * Форматування кількості замовлень
   */
  formatOrderCount(count?: number): string {
    const countValidation = z.number().int().min(0).optional().safeParse(count);
    if (!countValidation.success) {
      this.logWarning('Невалідна кількість замовлень:', countValidation.error.errors);
      return 'Немає замовлень';
    }

    const validCount = countValidation.data;
    if (!validCount || validCount === 0) return 'Немає замовлень';
    if (validCount === 1) return '1 замовлення';
    if (validCount < 5) return `${validCount} замовлення`;
    return `${validCount} замовлень`;
  }

  /**
   * Форматування контактної інформації для відображення в списку
   */
  formatClientContactInfo(client: ClientResponse): string {
    const validClient = this.validateClient(client);
    const parts: string[] = [];

    if (validClient.phone) {
      parts.push(this.formatPhoneForDisplay(validClient.phone));
    }

    if (validClient.email) {
      parts.push(validClient.email);
    }

    return parts.join(' • ') || 'Контакти не вказані';
  }

  /**
   * Форматування повної інформації про клієнта для картки
   */
  formatClientCard(client: ClientResponse): {
    fullName: string;
    contactInfo: string;
    address: string;
    source: string;
    orderCount: string;
    lastUpdate: string;
  } {
    const validClient = this.validateClient(client);

    return {
      fullName: this.formatClientFullName(client),
      contactInfo: this.formatClientContactInfo(client),
      address: validClient.structuredAddress
        ? this.formatAddress(validClient.structuredAddress as AddressDTO)
        : validClient.address || 'Адреса не вказана',
      source: this.formatInformationSource(
        (validClient.source as ClientResponseSource) || 'RECOMMENDATION',
        validClient.sourceDetails
      ),
      orderCount: this.formatOrderCount(validClient.orderCount),
      lastUpdate: this.formatDate(validClient.updatedAt),
    };
  }
}
