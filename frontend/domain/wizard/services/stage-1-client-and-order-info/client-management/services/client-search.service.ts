/**
 * @fileoverview Простий сервіс для пошуку клієнтів
 * @module domain/wizard/services/stage-1/client-management/services
 */

import { searchClientsWithPagination } from '@/domain/wizard/adapters/client/api/client.api';

import type { OperationResult } from '../interfaces/client-management.interfaces';
import type { ClientSearchResult } from '../types/client-domain.types';

/**
 * Пошук клієнтів за ключовим словом
 */
export async function searchClients(
  query: string,
  page: number = 0,
  size: number = 10
): Promise<OperationResult<ClientSearchResult[]>> {
  try {
    const result = await searchClientsWithPagination({
      query,
      page,
      size,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Помилка при пошуку клієнтів',
      };
    }

    const clients =
      result.data?.clients.map((client) => client as unknown as ClientSearchResult) || [];

    return {
      success: true,
      data: clients,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Невідома помилка',
    };
  }
}
