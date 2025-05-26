/**
 * @fileoverview Простий сервіс для створення клієнтів
 * @module domain/wizard/services/stage-1/client-management/services
 */

import { createClient } from '@/domain/wizard/adapters/client/api/client.api';
import {
  WizardCommunicationChannel,
  WizardClientSource,
} from '@/domain/wizard/adapters/client/types/base.types';

import {
  InformationSource,
  clientDataSchema,
  ClientTransformUtils,
  type ClientData,
  type ClientSearchResult,
} from '../types/client-domain.types';

import type { OperationResult } from '../interfaces/client-management.interfaces';
import type { WizardClientCreateData } from '@/domain/wizard/adapters/client/types/entities.types';

/**
 * Створення нового клієнта
 */
export async function createNewClient(
  clientData: ClientData
): Promise<OperationResult<ClientSearchResult>> {
  try {
    // Валідація через Zod
    const validation = clientDataSchema.safeParse(clientData);
    if (!validation.success) {
      return {
        success: false,
        error: 'Дані клієнта не пройшли валідацію',
        warnings: validation.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
      };
    }

    // Підготовка даних для API
    const apiData: Omit<WizardClientCreateData, 'structuredAddress'> = {
      firstName: clientData.firstName,
      lastName: clientData.lastName,
      phone: clientData.phone,
      email: clientData.email || undefined,
      address: clientData.address || undefined,
      communicationChannels: ClientTransformUtils.contactMethodsToChannels(
        clientData.contactMethods || []
      ) as WizardCommunicationChannel[], // Приведення типу до енуму
      source: ClientTransformUtils.informationSourceToWizardSource(
        clientData.informationSource || InformationSource.OTHER
      ) as WizardClientSource, // Приведення типу до енуму
      sourceDetails: clientData.informationSourceOther,
    };

    // Виклик API
    const result = await createClient(apiData);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || 'Помилка при створенні клієнта',
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
