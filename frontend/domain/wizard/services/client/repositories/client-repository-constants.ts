/**
 * @fileoverview Константи для репозиторію клієнтів
 * @module domain/wizard/services/client/repositories/client-repository-constants
 */

/**
 * Константи для помилок репозиторію
 */
export const CLIENT_REPOSITORY_ERROR_MESSAGES = {
  UNKNOWN: 'Невідома помилка',
  SEARCH_FAILED: 'Помилка пошуку клієнтів',
  GET_FAILED: 'Помилка отримання клієнта',
  CREATE_FAILED: 'Помилка створення клієнта',
  UPDATE_FAILED: 'Помилка оновлення клієнта',
} as const;

/**
 * Константи для пагінації
 */
export const CLIENT_REPOSITORY_PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;
