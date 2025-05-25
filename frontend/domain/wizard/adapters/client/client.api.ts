/**
 * @fileoverview API функції для операцій з клієнтами
 * @module domain/wizard/adapters/client
 */

import { ClientsService } from '@/lib/api';

import {
  mapClientResponseToDomain,
  mapClientToCreateRequest,
  mapClientToUpdateRequest,
} from './client.mapper';

import type { ClientSearchResult } from '../../types';

/**
 * Отримання всіх клієнтів з пагінацією
 * УВАГА: API метод getAllClients повертає ClientResponse, а не список
 * Рекомендується використовувати searchClientsWithPagination з порожнім запитом
 */
export async function getAllClients(
  page: number = 0,
  size: number = 20
): Promise<ClientSearchResult[]> {
  try {
    // Використовуємо пошук з порожнім запитом для отримання всіх клієнтів
    const result = await searchClientsWithPagination('', page, size);
    return result.clients;
  } catch (error) {
    console.error('Помилка при отриманні всіх клієнтів:', error);
    throw new Error(`Не вдалося отримати клієнтів: ${error}`);
  }
}

/**
 * Отримання клієнта за ID
 */
export async function getClientById(id: string): Promise<ClientSearchResult> {
  try {
    const apiResponse = await ClientsService.getClientById({ id });
    return mapClientResponseToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при отриманні клієнта ${id}:`, error);
    throw new Error(`Не вдалося отримати клієнта: ${error}`);
  }
}

/**
 * Створення нового клієнта
 */
export async function createClient(
  clientData: Partial<ClientSearchResult>
): Promise<ClientSearchResult> {
  try {
    const apiRequest = mapClientToCreateRequest(clientData);
    const apiResponse = await ClientsService.createClient({
      requestBody: apiRequest,
    });
    return mapClientResponseToDomain(apiResponse);
  } catch (error) {
    console.error('Помилка при створенні клієнта:', error);
    throw new Error(`Не вдалося створити клієнта: ${error}`);
  }
}

/**
 * Оновлення клієнта
 */
export async function updateClient(
  id: string,
  clientData: Partial<ClientSearchResult>
): Promise<ClientSearchResult> {
  try {
    const apiRequest = mapClientToUpdateRequest(clientData);
    const apiResponse = await ClientsService.updateClient({
      id,
      requestBody: apiRequest,
    });
    return mapClientResponseToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при оновленні клієнта ${id}:`, error);
    throw new Error(`Не вдалося оновити клієнта: ${error}`);
  }
}

/**
 * Видалення клієнта
 */
export async function deleteClient(id: string): Promise<void> {
  try {
    await ClientsService.deleteClient({ id });
  } catch (error) {
    console.error(`Помилка при видаленні клієнта ${id}:`, error);
    throw new Error(`Не вдалося видалити клієнта: ${error}`);
  }
}

/**
 * Пошук клієнтів за ключовим словом
 * @deprecated Використовуйте searchClientsWithPagination для кращої продуктивності
 */
export async function searchClients(keyword: string): Promise<ClientSearchResult[]> {
  try {
    // Використовуємо пагінований пошук з великим розміром сторінки для сумісності
    const result = await searchClientsWithPagination(keyword, 0, 100);
    return result.clients;
  } catch (error) {
    console.error('Помилка при пошуку клієнтів:', error);
    throw new Error(`Не вдалося знайти клієнтів: ${error}`);
  }
}

/**
 * Пошук клієнтів з пагінацією (рекомендований метод)
 */
export async function searchClientsWithPagination(
  keyword: string,
  page: number = 0,
  size: number = 20
): Promise<{ clients: ClientSearchResult[]; totalElements: number; totalPages: number }> {
  try {
    const apiResponse = await ClientsService.searchClientsWithPagination({
      requestBody: {
        query: keyword,
        page,
        size,
      },
    });

    // Маппимо клієнтів з відповіді
    const clients = (apiResponse.content || []).map(mapClientResponseToDomain);

    return {
      clients,
      totalElements: apiResponse.totalElements || 0,
      totalPages: apiResponse.totalPages || 0,
    };
  } catch (error) {
    console.error('Помилка при пошуку клієнтів з пагінацією:', error);
    throw new Error(`Не вдалося знайти клієнтів: ${error}`);
  }
}
