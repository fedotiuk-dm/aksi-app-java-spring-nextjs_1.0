/**
 * @fileoverview Сервіс створення клієнтів для першого етапу Order Wizard
 * @module domain/wizard/services/stage-1/client-management/services
 */

import { clientSearchService } from './client-search.service';
import {
  createClient as createClientAdapter,
  updateClient as updateClientAdapter,
} from '../../../../adapters/client';
import {
  type ClientData,
  type CreateClientRequest,
  type ClientSearchResult,
  ContactMethod,
  InformationSource,
  ClientTransformUtils,
} from '../types/client-domain.types';

import type { OperationResult } from '../../../shared/types/base.types';

/**
 * Сервіс створення та редагування клієнтів
 * Відповідальність: створення нових клієнтів, оновлення існуючих
 */
export class ClientCreationService {
  private readonly UNKNOWN_ERROR = 'Невідома помилка';

  /**
   * Створення нового клієнта
   */
  async createClient(data: CreateClientRequest): Promise<OperationResult<ClientSearchResult>> {
    try {
      // Бізнес-валідація (структурна валідація вже пройшла на рівні типів)
      const businessValidation = await this.validateBusinessRules(data);
      if (!businessValidation.success) {
        return businessValidation as OperationResult<ClientSearchResult>;
      }

      // Підготовка даних для API - перетворюємо в формат wizard ClientSearchResult
      const apiData: Partial<ClientSearchResult> = {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone,
        email: data.email,
        address: data.address,
        // Перетворюємо наші типи в wizard формат
        communicationChannels: data.contactMethods
          ? ClientTransformUtils.contactMethodsToChannels(data.contactMethods)
          : ['PHONE'],
        source: data.informationSource
          ? ClientTransformUtils.informationSourceToWizardSource(data.informationSource)
          : 'OTHER',
        sourceDetails: data.informationSourceOther,
      };

      // Виклик адаптера для створення
      const apiClient = await createClientAdapter(apiData);

      // Трансформація результату до нашого розширеного типу
      const transformedClient: ClientSearchResult = {
        ...apiClient,
        // Додаємо наші доменні поля
        contactMethods: data.contactMethods || [ContactMethod.PHONE],
        informationSource: data.informationSource || InformationSource.OTHER,
        informationSourceOther: data.informationSourceOther,
      };

      return {
        success: true,
        data: transformedClient,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка створення клієнта: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Оновлення існуючого клієнта
   */
  async updateClient(
    id: string,
    data: Partial<ClientData>
  ): Promise<OperationResult<ClientSearchResult>> {
    try {
      // Валідація вхідних даних
      const validationResult = this.validateUpdateInput(id, data);
      if (!validationResult.success) {
        return validationResult as OperationResult<ClientSearchResult>;
      }

      // Бізнес-валідація для оновлення
      const businessValidation = await this.validateUpdateBusinessRules(id, data);
      if (!businessValidation.success) {
        return businessValidation as OperationResult<ClientSearchResult>;
      }

      // Підготовка даних для API
      const apiData = this.prepareApiDataForUpdate(data);

      // Виклик адаптера для оновлення
      const apiClient = await updateClientAdapter(id, apiData);

      // Трансформація результату
      const transformedClient = this.transformApiClientToExtended(apiClient, data);

      return {
        success: true,
        data: transformedClient,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка оновлення клієнта: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Бізнес-валідація для створення клієнта
   */
  private async validateBusinessRules(data: CreateClientRequest): Promise<OperationResult<void>> {
    // Перевірка унікальності телефону
    const phoneCheck = await clientSearchService.checkClientExistsByPhone(data.phone);
    if (!phoneCheck.success) {
      return {
        success: false,
        error: `Помилка перевірки телефону: ${phoneCheck.error}`,
      };
    }

    if (phoneCheck.data) {
      return {
        success: false,
        error: 'Клієнт з таким номером телефону вже існує',
      };
    }

    // Перевірка унікальності email (якщо вказаний)
    if (data.email && data.email.trim() !== '') {
      const emailCheck = await clientSearchService.checkClientExistsByEmail(data.email);
      if (!emailCheck.success) {
        return {
          success: false,
          error: `Помилка перевірки email: ${emailCheck.error}`,
        };
      }

      if (emailCheck.data) {
        return {
          success: false,
          error: 'Клієнт з таким email вже існує',
        };
      }
    }

    return { success: true };
  }

  /**
   * Бізнес-валідація для оновлення клієнта
   */
  private async validateUpdateBusinessRules(
    id: string,
    data: Partial<ClientData>
  ): Promise<OperationResult<void>> {
    // Перевірка унікальності телефону
    if (data.phone) {
      const phoneValidation = await this.validatePhoneUniqueness(id, data.phone);
      if (!phoneValidation.success) {
        return phoneValidation;
      }
    }

    // Перевірка унікальності email
    if (data.email && data.email.trim() !== '') {
      const emailValidation = await this.validateEmailUniqueness(id, data.email);
      if (!emailValidation.success) {
        return emailValidation;
      }
    }

    return { success: true };
  }

  /**
   * Перевірка унікальності телефону для оновлення
   */
  private async validatePhoneUniqueness(
    currentClientId: string,
    phone: string
  ): Promise<OperationResult<void>> {
    const phoneCheck = await clientSearchService.checkClientExistsByPhone(phone);
    if (!phoneCheck.success) {
      return {
        success: false,
        error: `Помилка перевірки телефону: ${phoneCheck.error}`,
      };
    }

    if (!phoneCheck.data) {
      return { success: true };
    }

    // Знаходимо клієнта з таким телефоном
    const existingClient = await clientSearchService.searchClients(phone, 0, 1);
    if (!existingClient.success || !existingClient.data?.clients?.length) {
      return { success: true };
    }

    const foundClient = existingClient.data.clients[0];
    if (foundClient.id !== currentClientId) {
      return {
        success: false,
        error: 'Інший клієнт з таким номером телефону вже існує',
      };
    }

    return { success: true };
  }

  /**
   * Перевірка унікальності email для оновлення
   */
  private async validateEmailUniqueness(
    currentClientId: string,
    email: string
  ): Promise<OperationResult<void>> {
    const emailCheck = await clientSearchService.checkClientExistsByEmail(email);
    if (!emailCheck.success) {
      return {
        success: false,
        error: `Помилка перевірки email: ${emailCheck.error}`,
      };
    }

    if (!emailCheck.data) {
      return { success: true };
    }

    // Знаходимо клієнта з таким email
    const existingClient = await clientSearchService.searchClients(email, 0, 1);
    if (!existingClient.success || !existingClient.data?.clients?.length) {
      return { success: true };
    }

    const foundClient = existingClient.data.clients[0];
    if (foundClient.id !== currentClientId) {
      return {
        success: false,
        error: 'Інший клієнт з таким email вже існує',
      };
    }

    return { success: true };
  }

  /**
   * Валідація вхідних даних для оновлення
   */
  private validateUpdateInput(id: string, data: Partial<ClientData>): OperationResult<void> {
    // Тільки бізнес-валідація, структурна валідація вже пройшла на рівні типів
    if (!id || id.trim() === '') {
      return { success: false, error: 'ID клієнта не може бути порожнім' };
    }

    if (Object.keys(data).length === 0) {
      return { success: false, error: 'Немає даних для оновлення' };
    }

    return { success: true };
  }

  /**
   * Підготовка даних для API
   */
  private prepareApiDataForUpdate(data: Partial<ClientData>): Partial<ClientSearchResult> {
    return {
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.firstName &&
        data.lastName && {
          fullName: `${data.firstName} ${data.lastName}`.trim(),
        }),
      ...(data.phone && { phone: data.phone }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.contactMethods && {
        communicationChannels: ClientTransformUtils.contactMethodsToChannels(data.contactMethods),
      }),
      ...(data.informationSource && {
        source: ClientTransformUtils.informationSourceToWizardSource(data.informationSource),
      }),
      ...(data.informationSourceOther !== undefined && {
        sourceDetails: data.informationSourceOther,
      }),
    };
  }

  /**
   * Трансформація API клієнта в розширений тип
   */
  private transformApiClientToExtended(
    apiClient: ClientSearchResult,
    originalData: Partial<ClientData>
  ): ClientSearchResult {
    return {
      ...apiClient,
      contactMethods:
        originalData.contactMethods ||
        (apiClient.communicationChannels
          ? ClientTransformUtils.channelsToContactMethods(apiClient.communicationChannels)
          : [ContactMethod.PHONE]),
      informationSource:
        originalData.informationSource ||
        (apiClient.source
          ? ClientTransformUtils.wizardSourceToInformationSource(apiClient.source)
          : InformationSource.OTHER),
      informationSourceOther: originalData.informationSourceOther ?? apiClient.sourceDetails,
    };
  }
}

// Експорт екземпляра сервісу (Singleton)
export const clientCreationService = new ClientCreationService();
