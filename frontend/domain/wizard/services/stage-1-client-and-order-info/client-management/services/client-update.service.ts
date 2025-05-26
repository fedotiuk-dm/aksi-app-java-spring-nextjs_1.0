/**
 * @fileoverview Простий сервіс для оновлення даних клієнта
 * @module domain/wizard/services/stage-1/client-management/services
 */

import { updateClient, getClientById } from '@/domain/wizard/adapters/client/api/client.api';

import { ClientTransformUtils, InformationSource } from '../types/client-domain.types';

import type { OperationResult } from '../interfaces/client-management.interfaces';
import type { ClientData, ClientSearchResult } from '../types/client-domain.types';
import type {
  WizardClientUpdateData,
  WizardCommunicationChannel,
  WizardClientSource,
} from '@/domain/wizard/adapters/client/types';

/**
 * Оновлення існуючого клієнта
 */
export async function updateExistingClient(
  id: string,
  clientData: Partial<ClientData>
): Promise<OperationResult<ClientSearchResult>> {
  try {
    // Отримуємо поточні дані клієнта
    const clientResponse = await getClientById(id);

    if (!clientResponse.success || !clientResponse.data) {
      return {
        success: false,
        error: clientResponse.error || 'Клієнта не знайдено',
      };
    }

    // Підготовка даних для API
    const updateData: WizardClientUpdateData = {
      firstName: clientData.firstName,
      lastName: clientData.lastName,
      phone: clientData.phone,
      email: clientData.email || undefined,
      address: clientData.address || undefined,
      communicationChannels: clientData.contactMethods
        ? (ClientTransformUtils.contactMethodsToChannels(
            clientData.contactMethods
          ) as WizardCommunicationChannel[])
        : undefined,
      source: clientData.informationSource
        ? (ClientTransformUtils.informationSourceToWizardSource(
            clientData.informationSource || InformationSource.OTHER
          ) as WizardClientSource)
        : undefined,
      sourceDetails: clientData.informationSourceOther,
    };

    // Виклик адаптера для оновлення клієнта
    const result = await updateClient(id, updateData);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || 'Помилка при оновленні клієнта',
      };
    }

    // result.data вже є WizardClient, просто приводимо до ClientSearchResult
    const client = result.data as unknown as ClientSearchResult;

    return {
      success: true,
      data: client as ClientSearchResult,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Невідома помилка',
    };
  }
}
