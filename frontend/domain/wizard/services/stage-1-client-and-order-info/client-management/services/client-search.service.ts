/**
 * @fileoverview Сервіс пошуку клієнтів для першого етапу Order Wizard
 * @module domain/wizard/services/stage-1/client-management/services
 */

import { z } from 'zod';

import { searchClientsWithPagination, getClientById } from '../../../../adapters/client';
import {
  clientSearchQuerySchema,
  InformationSource,
  ContactMethod,
  ClientTransformUtils,
  type ClientSearchQuery,
  type ClientSearchPaginatedResult,
  type ClientSearchResult,
} from '../types/client-domain.types';

import type { OperationResult } from '../../../shared/types/base.types';

/**
 * Сервіс пошуку клієнтів
 * Відповідальність: пошук клієнтів за різними критеріями
 */
export class ClientSearchService {
  private readonly UNKNOWN_ERROR = 'Невідома помилка';

  /**
   * Пошук клієнтів за ключовим словом з пагінацією
   */
  async searchClients(
    query: string,
    page: number = 0,
    size: number = 20
  ): Promise<OperationResult<ClientSearchPaginatedResult>> {
    try {
      // Валідація параметрів пошуку
      const validationResult = clientSearchQuerySchema.safeParse({ query, page, size });
      if (!validationResult.success) {
        return {
          success: false,
          error: `Помилка валідації параметрів пошуку: ${validationResult.error.issues.map((i) => i.message).join(', ')}`,
        };
      }

      // Виклик адаптера для пошуку клієнтів
      const searchResult = await searchClientsWithPagination(query, page, size);

      // Трансформація результату до нашого розширеного типу
      const transformedResult: ClientSearchPaginatedResult = {
        clients: searchResult.clients.map((client) => this.transformWizardClientToExtended(client)),
        totalElements: searchResult.totalElements,
        totalPages: searchResult.totalPages,
        pageNumber: searchResult.pageNumber,
        pageSize: searchResult.pageSize,
        hasPrevious: searchResult.hasPrevious,
        hasNext: searchResult.hasNext,
      };

      return {
        success: true,
        data: transformedResult,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка пошуку клієнтів: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Отримання клієнта за ID
   */
  async getClientById(id: string): Promise<OperationResult<ClientSearchResult>> {
    try {
      // Валідація ID
      if (!id || id.trim() === '') {
        return {
          success: false,
          error: 'ID клієнта не може бути порожнім',
        };
      }

      // Виклик адаптера для отримання клієнта
      const client = await getClientById(id);

      // Трансформація результату до нашого розширеного типу
      const transformedClient = this.transformWizardClientToExtended(client);

      return {
        success: true,
        data: transformedClient,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка отримання клієнта: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Перевірка існування клієнта за телефоном
   */
  async checkClientExistsByPhone(phone: string): Promise<OperationResult<boolean>> {
    try {
      if (!phone || phone.trim() === '') {
        return {
          success: false,
          error: 'Телефон не може бути порожнім',
        };
      }

      const searchResult = await this.searchClients(phone, 0, 1);

      if (!searchResult.success) {
        return {
          success: false,
          error: searchResult.error,
        };
      }

      const exists = searchResult.data?.clients.some((client) => client.phone === phone) || false;

      return {
        success: true,
        data: exists,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка перевірки існування клієнта: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Перевірка існування клієнта за email
   */
  async checkClientExistsByEmail(email: string): Promise<OperationResult<boolean>> {
    try {
      if (!email || email.trim() === '') {
        return {
          success: false,
          error: 'Email не може бути порожнім',
        };
      }

      const searchResult = await this.searchClients(email, 0, 1);

      if (!searchResult.success) {
        return {
          success: false,
          error: searchResult.error,
        };
      }

      const exists = searchResult.data?.clients.some((client) => client.email === email) || false;

      return {
        success: true,
        data: exists,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка перевірки існування клієнта: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Приватний метод для трансформації wizard клієнта в наш розширений тип
   */
  private transformWizardClientToExtended(
    wizardClient: import('../../../../types/wizard-step-states.types').ClientSearchResult
  ): ClientSearchResult {
    return {
      ...wizardClient,
      // Додаємо наші доменні поля з трансформацією
      contactMethods: wizardClient.communicationChannels
        ? ClientTransformUtils.channelsToContactMethods(wizardClient.communicationChannels)
        : [ContactMethod.PHONE],
      informationSource: wizardClient.source
        ? ClientTransformUtils.wizardSourceToInformationSource(wizardClient.source)
        : InformationSource.OTHER,
      informationSourceOther: wizardClient.sourceDetails,
    };
  }
}

// Експорт екземпляра сервісу (Singleton)
export const clientSearchService = new ClientSearchService();
