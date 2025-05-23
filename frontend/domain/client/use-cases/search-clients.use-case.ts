import { ClientRepository } from '../repositories';
import { ClientSearchParams, ClientSearchResult } from '../types';

/**
 * Use Case для пошуку клієнтів
 * Реалізує Single Responsibility Principle - відповідає тільки за пошук клієнтів
 */
export class SearchClientsUseCase {
  constructor(private clientRepository: ClientRepository) {}

  /**
   * Виконує пошук клієнтів з бізнес-логікою
   */
  async execute(params: ClientSearchParams): Promise<ClientSearchResult> {
    // Валідація параметрів пошуку
    const validatedParams = this.validateAndNormalizeParams(params);

    // Виконання пошуку
    return await this.clientRepository.search(validatedParams);
  }

  /**
   * Валідує та нормалізує параметри пошуку
   */
  private validateAndNormalizeParams(params: ClientSearchParams): ClientSearchParams {
    const normalized: ClientSearchParams = {
      keyword: params.keyword?.trim(),
      page: Math.max(0, params.page || 0),
      size: Math.min(100, Math.max(1, params.size || 10)),
    };

    // Видаляємо порожній keyword
    if (!normalized.keyword) {
      delete normalized.keyword;
    }

    return normalized;
  }

  /**
   * Пошук клієнтів по номеру телефону
   */
  async searchByPhone(phone: string): Promise<ClientSearchResult> {
    // Очищуємо номер від зайвих символів
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    return await this.execute({
      keyword: cleanPhone,
      page: 0,
      size: 10,
    });
  }

  /**
   * Пошук клієнтів по імені
   */
  async searchByName(name: string): Promise<ClientSearchResult> {
    const cleanName = name.trim();

    if (cleanName.length < 2) {
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 0,
        number: 0,
        first: true,
        last: true,
        empty: true,
      };
    }

    return await this.execute({
      keyword: cleanName,
      page: 0,
      size: 10,
    });
  }
}
