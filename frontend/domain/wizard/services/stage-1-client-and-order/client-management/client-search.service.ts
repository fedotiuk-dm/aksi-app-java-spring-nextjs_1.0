import { z } from 'zod';

import { BaseWizardService } from '../../base.service';

import type { ClientResponse } from '@/shared/api/generated/client';

// Zod схеми для валідації пошуку
const clientSearchCriteriaSchema = z.object({
  searchTerm: z.string().optional(),
  searchBy: z.enum(['name', 'phone', 'email', 'address', 'all']).optional(),
  limit: z.number().int().min(1).max(1000).optional(),
  sortBy: z.enum(['lastName', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

const searchTermSchema = z.string().min(1, 'Пошуковий термін не може бути порожнім').trim();

const phoneSearchSchema = z.string().min(3, 'Телефон для пошуку повинен містити мінімум 3 символи');

const clientArraySchema = z.array(z.any()); // Мінімальна валідація для масиву клієнтів

const searchWeightedResultSchema = z.object({
  searchScore: z.number().min(0, "Оцінка пошуку не може бути від'ємною"),
});

export type ValidatedClientSearchCriteria = z.infer<typeof clientSearchCriteriaSchema>;
export type SearchWeightedResult = ClientResponse & z.infer<typeof searchWeightedResultSchema>;

/**
 * Сервіс для пошуку та фільтрації клієнтів (SOLID: SRP - тільки пошук)
 *
 * Відповідальність:
 * - Фільтрація клієнтів за критеріями пошуку
 * - Сортування результатів пошуку
 * - Логіка пошуку по різних полях
 * - Валідація критеріїв пошуку (Zod)
 */

export interface ClientSearchCriteria {
  searchTerm?: string;
  searchBy?: 'name' | 'phone' | 'email' | 'address' | 'all';
  limit?: number;
  sortBy?: 'lastName' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export class ClientSearchService extends BaseWizardService {
  protected readonly serviceName = 'ClientSearchService';

  /**
   * Валідація критеріїв пошуку
   */
  private validateSearchCriteria(criteria: unknown): ValidatedClientSearchCriteria {
    const result = clientSearchCriteriaSchema.safeParse(criteria);
    if (!result.success) {
      this.logWarning('Невалідні критерії пошуку:', result.error.errors);
      // Повертаємо безпечні default значення
      return {
        searchBy: 'all',
        sortOrder: 'asc',
      };
    }
    return result.data;
  }

  /**
   * Валідація пошукового терміну
   */
  private validateSearchTerm(term: unknown): string {
    const result = searchTermSchema.safeParse(term);
    if (!result.success) {
      this.logWarning('Невалідний пошуковий термін:', result.error.errors);
      return '';
    }
    return result.data;
  }

  /**
   * Валідація масиву клієнтів
   */
  private validateClientsArray(clients: unknown): ClientResponse[] {
    const result = clientArraySchema.safeParse(clients);
    if (!result.success) {
      this.logWarning('Невалідний масив клієнтів:', result.error.errors);
      return [];
    }
    return result.data;
  }

  /**
   * Валідація телефону для пошуку
   */
  private validatePhoneSearch(phone: unknown): string {
    const result = phoneSearchSchema.safeParse(phone);
    if (!result.success) {
      this.logWarning('Невалідний телефон для пошуку:', result.error.errors);
      return '';
    }
    return result.data;
  }

  /**
   * Фільтрація клієнтів за критеріями пошуку
   */
  filterClients(clients: ClientResponse[], criteria: ClientSearchCriteria): ClientResponse[] {
    const validatedClients = this.validateClientsArray(clients);
    const validatedCriteria = this.validateSearchCriteria(criteria);

    let result = [...validatedClients];

    // Пошук за терміном
    if (validatedCriteria.searchTerm?.trim()) {
      const term = this.validateSearchTerm(validatedCriteria.searchTerm);
      if (term) {
        const normalizedTerm = term.toLowerCase();

        result = result.filter((client) => {
          switch (validatedCriteria.searchBy) {
            case 'name':
              return (
                client.firstName?.toLowerCase().includes(normalizedTerm) ||
                client.lastName?.toLowerCase().includes(normalizedTerm) ||
                client.fullName?.toLowerCase().includes(normalizedTerm)
              );
            case 'phone':
              return client.phone?.includes(normalizedTerm);
            case 'email':
              return client.email?.toLowerCase().includes(normalizedTerm) || false;
            case 'address':
              return client.address?.toLowerCase().includes(normalizedTerm) || false;
            case 'all':
            default:
              return (
                client.firstName?.toLowerCase().includes(normalizedTerm) ||
                client.lastName?.toLowerCase().includes(normalizedTerm) ||
                client.fullName?.toLowerCase().includes(normalizedTerm) ||
                client.phone?.includes(normalizedTerm) ||
                client.email?.toLowerCase().includes(normalizedTerm) ||
                client.address?.toLowerCase().includes(normalizedTerm)
              );
          }
        });
      }
    }

    // Сортування
    if (validatedCriteria.sortBy) {
      result.sort((a, b) => {
        let aValue = '';
        let bValue = '';

        switch (validatedCriteria.sortBy) {
          case 'lastName':
            aValue = `${a.lastName || ''} ${a.firstName || ''}`;
            bValue = `${b.lastName || ''} ${b.firstName || ''}`;
            break;
          case 'createdAt':
            aValue = a.createdAt || '';
            bValue = b.createdAt || '';
            break;
          case 'updatedAt':
            aValue = a.updatedAt || '';
            bValue = b.updatedAt || '';
            break;
        }

        const comparison = aValue.localeCompare(bValue, 'uk');
        return validatedCriteria.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Ліміт результатів
    if (validatedCriteria.limit && validatedCriteria.limit > 0) {
      result = result.slice(0, validatedCriteria.limit);
    }

    return result;
  }

  /**
   * Пошук клієнтів за конкретним полем
   */
  searchByField(
    clients: ClientResponse[],
    field: keyof ClientResponse,
    searchTerm: string
  ): ClientResponse[] {
    const validatedClients = this.validateClientsArray(clients);
    const validatedTerm = this.validateSearchTerm(searchTerm);

    if (!validatedTerm) return validatedClients;

    const normalizedTerm = validatedTerm.toLowerCase();

    return validatedClients.filter((client) => {
      const fieldValue = client[field];

      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(normalizedTerm);
      }

      return false;
    });
  }

  /**
   * Пошук клієнтів за повним ім'ям
   */
  searchByFullName(clients: ClientResponse[], searchTerm: string): ClientResponse[] {
    const validatedClients = this.validateClientsArray(clients);
    const validatedTerm = this.validateSearchTerm(searchTerm);

    if (!validatedTerm) return validatedClients;

    const normalizedTerm = validatedTerm.toLowerCase();

    return validatedClients.filter((client) => {
      const fullName = (client.fullName || `${client.firstName || ''} ${client.lastName || ''}`)
        .toLowerCase()
        .trim();

      return fullName.includes(normalizedTerm);
    });
  }

  /**
   * Пошук клієнтів за номером телефону з нормалізацією
   */
  searchByPhone(clients: ClientResponse[], searchTerm: string): ClientResponse[] {
    const validatedClients = this.validateClientsArray(clients);
    const validatedPhone = this.validatePhoneSearch(searchTerm);

    if (!validatedPhone) return validatedClients;

    const normalizedTerm = this.normalizePhoneForSearch(validatedPhone);

    return validatedClients.filter((client) => {
      if (!client.phone) return false;

      const normalizedPhone = this.normalizePhoneForSearch(client.phone);
      return normalizedPhone.includes(normalizedTerm);
    });
  }

  /**
   * Комплексний пошук по всіх полях з вагами
   */
  searchWithWeights(clients: ClientResponse[], searchTerm: string): SearchWeightedResult[] {
    const validatedClients = this.validateClientsArray(clients);
    const validatedTerm = this.validateSearchTerm(searchTerm);

    if (!validatedTerm) {
      return validatedClients.map((client) => ({ ...client, searchScore: 0 }));
    }

    const normalizedTerm = validatedTerm.toLowerCase();

    const results = validatedClients.map((client) => {
      let score = 0;

      // Пошук по імені (найвища вага)
      if (client.firstName?.toLowerCase().includes(normalizedTerm)) score += 10;
      if (client.lastName?.toLowerCase().includes(normalizedTerm)) score += 10;
      if (client.fullName?.toLowerCase().includes(normalizedTerm)) score += 8;

      // Пошук по телефону (висока вага)
      if (client.phone?.includes(normalizedTerm)) score += 8;

      // Пошук по email (середня вага)
      if (client.email?.toLowerCase().includes(normalizedTerm)) score += 5;

      // Пошук по адресі (низька вага)
      if (client.address?.toLowerCase().includes(normalizedTerm)) score += 3;

      const weightedResult = { ...client, searchScore: score };

      // Валідуємо результат
      const validationResult = searchWeightedResultSchema.safeParse({ searchScore: score });
      if (!validationResult.success) {
        this.logWarning('Невалідна оцінка пошуку:', validationResult.error.errors);
        return { ...client, searchScore: 0 };
      }

      return weightedResult;
    });

    // Фільтруємо тільки ті що мають score > 0 і сортуємо за score
    return results
      .filter((result) => result.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore);
  }

  // === ПРИВАТНІ МЕТОДИ ===

  /**
   * Нормалізація телефону для пошуку
   */
  private normalizePhoneForSearch(phone: string): string {
    const phoneValidation = z.string().min(1).safeParse(phone);
    if (!phoneValidation.success) {
      this.logWarning('Невалідний телефон для нормалізації пошуку:', phoneValidation.error.errors);
      return '';
    }

    // Видаляємо всі не-цифрові символи
    return phoneValidation.data.replace(/\D/g, '');
  }
}
