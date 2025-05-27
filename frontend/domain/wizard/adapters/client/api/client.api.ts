/**
 * @fileoverview API функції для операцій з клієнтами
 * @module domain/wizard/adapters/client/api
 */

import { ClientsService } from '@/lib/api';

import {
  mapClientResponseToDomain,
  mapClientToCreateRequest,
  mapClientToUpdateRequest,
  mapClientArrayToDomain,
} from '../mappers';

import type {
  WizardClient,
  WizardClientCreateData,
  WizardClientUpdateData,
  WizardClientOperationResult,
  WizardClientSearchResult,
  WizardClientSearchParams,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Отримання всіх клієнтів з пагінацією
 */
export async function getAllClients(
  page: number = 0,
  size: number = 20
): Promise<WizardClientOperationResult<WizardClient[]>> {
  try {
    // Використовуємо пошук з порожнім запитом для отримання всіх клієнтів
    const result = await searchClientsWithPagination({ query: '', page, size });

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data?.clients || [],
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати клієнтів: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання клієнта за ID
 */
export async function getClientById(
  id: string
): Promise<WizardClientOperationResult<WizardClient>> {
  try {
    const apiResponse = await ClientsService.getClientById({ id });
    const client = mapClientResponseToDomain(apiResponse);

    return {
      success: true,
      data: client,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати клієнта: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Створення нового клієнта
 */
export async function createClient(
  clientData: WizardClientCreateData
): Promise<WizardClientOperationResult<WizardClient>> {
  try {
    const apiRequest = mapClientToCreateRequest(clientData);
    const apiResponse = await ClientsService.createClient({
      requestBody: apiRequest,
    });
    const client = mapClientResponseToDomain(apiResponse);

    return {
      success: true,
      data: client,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося створити клієнта: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Оновлення клієнта
 */
export async function updateClient(
  id: string,
  clientData: WizardClientUpdateData
): Promise<WizardClientOperationResult<WizardClient>> {
  try {
    const apiRequest = mapClientToUpdateRequest(clientData);
    const apiResponse = await ClientsService.updateClient({
      id,
      requestBody: apiRequest,
    });
    const client = mapClientResponseToDomain(apiResponse);

    return {
      success: true,
      data: client,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося оновити клієнта: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Видалення клієнта
 */
export async function deleteClient(id: string): Promise<WizardClientOperationResult<void>> {
  try {
    await ClientsService.deleteClient({ id });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося видалити клієнта: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Пошук клієнтів за ключовим словом (простий пошук)
 */
export async function searchClients(
  keyword: string
): Promise<WizardClientOperationResult<WizardClient[]>> {
  try {
    // Використовуємо пагінований пошук з великим розміром сторінки для сумісності
    const result = await searchClientsWithPagination({ query: keyword, page: 0, size: 100 });

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data?.clients || [],
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося знайти клієнтів: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Пошук клієнтів з пагінацією (рекомендований метод)
 */
export async function searchClientsWithPagination(
  params: WizardClientSearchParams
): Promise<WizardClientOperationResult<WizardClientSearchResult>> {
  try {
    const { query = '', page = 0, size = 20 } = params;

    const apiResponse = await ClientsService.searchClientsWithPagination({
      requestBody: {
        query,
        page,
        size,
      },
    });

    // Маппимо клієнтів з відповіді
    const clients = mapClientArrayToDomain(apiResponse.content || []);

    const searchResult: WizardClientSearchResult = {
      clients,
      totalElements: apiResponse.totalElements || 0,
      totalPages: apiResponse.totalPages || 0,
      pageNumber: apiResponse.pageNumber || 0,
      pageSize: apiResponse.pageSize || size,
      hasPrevious: apiResponse.hasPrevious || false,
      hasNext: apiResponse.hasNext || false,
    };

    return {
      success: true,
      data: searchResult,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося знайти клієнтів: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Перевірка унікальності телефону
 * @param phone Телефон для перевірки
 * @param excludeClientId ID клієнта, якого треба виключити з перевірки (для редагування)
 */
export async function checkPhoneUniqueness(
  phone: string,
  excludeClientId?: string
): Promise<WizardClientOperationResult<boolean>> {
  try {
    // Використовуємо пошук для перевірки унікальності
    const searchResult = await searchClientsWithPagination({
      query: phone,
      page: 0,
      size: 100, // Достатньо для перевірки унікальності
    });

    if (!searchResult.success || !searchResult.data) {
      return {
        success: false,
        error: 'Не вдалося перевірити унікальність телефону',
      };
    }

    // Перевіряємо, чи є клієнт з таким же телефоном
    const duplicateClient = searchResult.data.clients.find(
      (client) => client.phone === phone && client.id !== excludeClientId
    );

    return {
      success: true,
      data: !duplicateClient, // true якщо телефон унікальний (немає дублікатів)
    };
  } catch (error) {
    return {
      success: false,
      error: `Помилка при перевірці унікальності телефону: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Перевірка унікальності email
 * @param email Email для перевірки
 * @param excludeClientId ID клієнта, якого треба виключити з перевірки (для редагування)
 */
export async function checkEmailUniqueness(
  email: string,
  excludeClientId?: string
): Promise<WizardClientOperationResult<boolean>> {
  try {
    // Використовуємо пошук для перевірки унікальності
    const searchResult = await searchClientsWithPagination({
      query: email,
      page: 0,
      size: 100, // Достатньо для перевірки унікальності
    });

    if (!searchResult.success || !searchResult.data) {
      return {
        success: false,
        error: 'Не вдалося перевірити унікальність email',
      };
    }

    // Перевіряємо, чи є клієнт з таким же email
    const duplicateClient = searchResult.data.clients.find(
      (client) => client.email === email && client.id !== excludeClientId
    );

    return {
      success: true,
      data: !duplicateClient, // true якщо email унікальний (немає дублікатів)
    };
  } catch (error) {
    return {
      success: false,
      error: `Помилка при перевірці унікальності email: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
