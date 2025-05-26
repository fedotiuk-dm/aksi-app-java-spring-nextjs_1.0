/**
 * @fileoverview Маппер для налаштувань клієнтів
 * @module domain/wizard/adapters/client/mappers
 */

import { ClientPreferenceDTO } from '@/lib/api';

import { WizardClientPreference } from '../types';

/**
 * Перетворює ClientPreferenceDTO у WizardClientPreference
 */
export function mapClientPreferenceDTOToDomain(
  apiPreference: ClientPreferenceDTO
): WizardClientPreference {
  return {
    id: apiPreference.id || '',
    type: apiPreference.key || '',
    value: apiPreference.value || '',
    description: '', // Поле відсутнє в DTO, встановлюємо порожній рядок за замовчуванням
  };
}
