import { ClientEntity } from '../entities';
import { CreateClientFormData, UpdateClientFormData } from '../types';

/**
 * Адаптер для перетворення сутності клієнта в дані форми
 */
export class ClientFormAdapter {
  /**
   * Перетворення сутності клієнта в дані форми для оновлення
   */
  static toUpdateFormData(client: ClientEntity): UpdateClientFormData {
    return {
      id: client.id || '',
      firstName: client.firstName || '',
      lastName: client.lastName || '',
      phone: client.phone || '',
      email: client.email,
      address: client.address,
      structuredAddress: client.structuredAddress,
      communicationChannels: client.communicationChannels,
      source: client.source,
      sourceDetails: client.sourceDetails,
    };
  }

  /**
   * Перетворення сутності клієнта в дані форми для створення
   */
  static toCreateFormData(client: ClientEntity): CreateClientFormData {
    return {
      firstName: client.firstName || '',
      lastName: client.lastName || '',
      phone: client.phone || '',
      email: client.email,
      address: client.address,
      structuredAddress: client.structuredAddress,
      communicationChannels: client.communicationChannels,
      source: client.source,
      sourceDetails: client.sourceDetails,
    };
  }

  /**
   * Перетворення даних форми в об'єкт клієнта
   */
  static formDataToClientObject(
    formData: CreateClientFormData | UpdateClientFormData
  ): Partial<ClientEntity> {
    return {
      ...('id' in formData ? { id: formData.id } : {}),
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      structuredAddress: formData.structuredAddress,
      communicationChannels: formData.communicationChannels,
      source: formData.source,
      sourceDetails: formData.sourceDetails,
    };
  }
}
