import {
  searchClients,
  searchClientsWithPagination,
  type SearchClientsParams,
  type ClientSearchRequest,
} from '@/shared/api/generated/client';
import {
  searchClientsQueryParams,
  searchClients200Response,
  searchClientsWithPagination200Response,
  searchClientsWithPaginationBody,
  safeValidate,
  validateOrThrow,
  z,
} from '@/shared/api/generated/client/zod';

// Простий тип для пошуку клієнтів
export type ClientSearchResult = z.infer<typeof searchClients200Response>;
export type ClientSearchResponse = z.infer<typeof searchClientsWithPagination200Response>;

/**
 * Простий сервіс для пошуку клієнтів
 * Пошук за прізвищем, телефоном, email, адресою
 */
export class ClientSearchService {
  /**
   * Простий пошук клієнтів за ключовим словом
   */
  async searchByKeyword(keyword: string): Promise<ClientSearchResult[]> {
    if (!keyword.trim()) {
      return [];
    }

    try {
      const params: SearchClientsParams = { keyword: keyword.trim() };
      const response = await searchClients(params);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Помилка пошуку клієнтів:', error);
      return [];
    }
  }

  /**
   * Пошук клієнтів з пагінацією
   */
  async searchWithPagination(
    query: string = '',
    page: number = 0,
    size: number = 20
  ): Promise<ClientSearchResponse> {
    try {
      const trimmedQuery = query.trim();
      const searchRequest: ClientSearchRequest = {
        query: trimmedQuery || '',
        page,
        size,
      };

      return await searchClientsWithPagination(searchRequest);
    } catch (error) {
      console.error('Помилка пошуку клієнтів з пагінацією:', error);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: size,
        hasNext: false,
        hasPrevious: false,
      };
    }
  }

  /**
   * Перевірка чи може бути клієнт вибраний
   */
  canSelectClient(client: ClientSearchResult): boolean {
    return !!(client.id && client.phone && (client.lastName || client.fullName));
  }

  /**
   * Форматування клієнта для відображення
   */
  formatClientName(client: ClientSearchResult): string {
    if (client.fullName) {
      return client.fullName;
    }

    const parts = [client.lastName, client.firstName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Невідомий клієнт';
  }

  /**
   * Форматування контактної інформації
   */
  formatContactInfo(client: ClientSearchResult): string {
    const contacts = [client.phone, client.email].filter(Boolean);
    return contacts.join(' • ');
  }

  /**
   * Форматування адреси
   */
  formatAddress(client: ClientSearchResult): string {
    return client.structuredAddress?.fullAddress || client.address || 'Адреса не вказана';
  }

  /**
   * Отримання статистики пошуку
   */
  getSearchStats(searchResponse: ClientSearchResponse) {
    return {
      totalElements: searchResponse.totalElements || 0,
      totalPages: searchResponse.totalPages || 0,
      currentPage: searchResponse.pageNumber || 0,
      pageSize: searchResponse.pageSize || 0,
      hasMore: searchResponse.hasNext || false,
      hasPrevious: searchResponse.hasPrevious || false,
    };
  }

  /**
   * Валідація даних клієнта
   */
  validateClient(client: unknown): client is ClientSearchResult {
    const validation = safeValidate(searchClients200Response, client);
    return validation.success;
  }
}
