import {
  searchClients,
  createClient,
  getClientById,
  checkPhoneUniqueness,
  checkEmailUniqueness,
  type WizardClient,
  type WizardClientCreateData,
} from '@/domain/wizard/adapters/client';
import {
  clientManagementSchema,
  clientUniquenessSchema,
  clientSearchSchema,
  type ClientManagementData,
  type ClientUniquenessData,
  type ClientSearchData,
  type ContactMethod,
  type InfoSource,
} from '@/domain/wizard/schemas';

import { BaseWizardService } from '../../base.service';

/**
 * Мінімалістський сервіс для управління клієнтами
 * Розмір: ~90 рядків (дотримання ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція client адаптерів для пошуку + створення + отримання
 * - Валідація через централізовані Zod схеми
 * - Мінімальна нормалізація телефонів
 *
 * НЕ дублює:
 * - API виклики (роль client адаптерів)
 * - Мапінг даних (роль адаптерів)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Схеми валідації (роль централізованих schemas)
 */

export class ClientManagementService extends BaseWizardService {
  protected readonly serviceName = 'ClientManagementService';

  /**
   * Композиція: адаптер + отримання клієнта за ID
   */
  async getClientById(id: string): Promise<WizardClient | null> {
    const result = await getClientById(id);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: адаптер + пошук з типізованими параметрами
   */
  async searchClients(searchData: ClientSearchData): Promise<WizardClient[]> {
    const validation = this.validateSearch(searchData);
    if (!validation.success) {
      return [];
    }

    const result = await searchClients(searchData.keyword);
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: адаптер + розширений пошук
   */
  async searchClientsByKeyword(keyword: string): Promise<WizardClient[]> {
    const result = await searchClients(keyword);
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: адаптер + перевірка унікальності з типізацією
   */
  async checkUniqueness(uniquenessData: ClientUniquenessData) {
    const validation = this.validateUniqueness(uniquenessData);
    if (!validation.success) {
      throw new Error(validation.error.errors[0].message);
    }

    const [phoneCheck, emailCheck] = await Promise.all([
      checkPhoneUniqueness(this.normalizePhone(uniquenessData.phone)),
      uniquenessData.email
        ? checkEmailUniqueness(uniquenessData.email)
        : Promise.resolve({ success: true, data: true }),
    ]);

    return {
      phoneUnique: phoneCheck.success ? phoneCheck.data || false : false,
      emailUnique: emailCheck.success ? emailCheck.data || false : false,
    };
  }

  /**
   * Валідація через централізовану схему + створення через адаптер
   */
  async createClient(clientData: ClientManagementData): Promise<WizardClient | null> {
    // 1. Централізована Zod валідація
    const validation = clientManagementSchema.safeParse(clientData);
    if (!validation.success) {
      throw new Error(validation.error.errors[0].message);
    }

    // 2. Створення через адаптер
    const createData: WizardClientCreateData = {
      firstName: clientData.firstName,
      lastName: clientData.lastName,
      phone: this.normalizePhone(clientData.phone),
      email: clientData.email ?? undefined,
      address: clientData.address ?? undefined,
      // TODO: Додати в адаптер підтримку contactMethods та infoSource
    };

    const result = await createClient(createData);
    return result.success ? result.data || null : null;
  }

  /**
   * Мінімальна нормалізація телефону
   */
  normalizePhone(phone: string): string {
    return phone.replace(/\D/g, ''); // Тільки цифри
  }

  /**
   * Валідація клієнта через централізовану схему
   */
  validateClient(data: unknown) {
    return clientManagementSchema.safeParse(data);
  }

  /**
   * Валідація пошуку через централізовану схему
   */
  validateSearch(data: unknown) {
    return clientSearchSchema.safeParse(data);
  }

  /**
   * Валідація унікальності через централізовану схему
   */
  validateUniqueness(data: unknown) {
    return clientUniquenessSchema.safeParse(data);
  }

  /**
   * Отримання доступних контактних методів
   */
  getContactMethods(): Array<{ method: ContactMethod; label: string }> {
    return [
      { method: 'phone', label: 'Номер телефону' },
      { method: 'sms', label: 'SMS' },
      { method: 'viber', label: 'Viber' },
    ];
  }

  /**
   * Отримання доступних джерел інформації
   */
  getInfoSources(): Array<{ source: InfoSource; label: string; needsDetails?: boolean }> {
    return [
      { source: 'instagram', label: 'Інстаграм' },
      { source: 'google', label: 'Google' },
      { source: 'recommendation', label: 'Рекомендації' },
      { source: 'other', label: 'Інше', needsDetails: true },
    ];
  }
}
