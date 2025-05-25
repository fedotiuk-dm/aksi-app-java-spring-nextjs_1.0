/**
 * @fileoverview Сервіс створення клієнтів
 * @module domain/wizard/services/client/client-creation
 */

import { clientRepository } from './client.repository';
import { OperationResultFactory } from '../interfaces';

import type { IClientCreationService } from './client.interfaces';
import type { OperationResult, ValidationOperationResult } from '../interfaces';
import type {
  ClientDomain,
  CreateClientDomainRequest,
  UpdateClientDomainRequest,
} from './client-domain.types';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    CREATION_FAILED: 'Помилка створення клієнта',
    UPDATE_FAILED: 'Помилка оновлення клієнта',
    VALIDATION_FAILED: 'Помилка валідації даних клієнта',
    CLIENT_EXISTS: 'Клієнт з таким телефоном вже існує',
    PHONE_REQUIRED: "Номер телефону є обов'язковим",
    NAME_REQUIRED: "Ім'я та прізвище є обов'язковими",
    INVALID_EMAIL: 'Некоректний формат email',
    UNKNOWN: 'Невідома помилка',
  },
  VALIDATION: {
    PHONE_PATTERN: /^\+380\d{9}$/,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
  },
} as const;

/**
 * Сервіс створення клієнтів
 * Відповідальність: створення та оновлення клієнтів з валідацією
 */
export class ClientCreationService implements IClientCreationService {
  public readonly name = 'ClientCreationService';
  public readonly version = '1.0.0';

  /**
   * Створення нового клієнта
   */
  async createClient(request: CreateClientDomainRequest): Promise<OperationResult<ClientDomain>> {
    try {
      // Валідація даних
      const validationResult = this.validateClientRequest(request);
      if (!validationResult.isValid) {
        const errorMessages = (validationResult.validationErrors || []).map((e) => e.message);
        return OperationResultFactory.error(
          `${CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED}: ${errorMessages.join(', ')}`
        );
      }

      // Перевірка на існування клієнта
      const existsResult = await this.checkClientExists(request.phone, request.email);
      if (!existsResult.success) {
        return OperationResultFactory.error(
          existsResult.error || CONSTANTS.ERROR_MESSAGES.CREATION_FAILED
        );
      }

      if (existsResult.data) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.CLIENT_EXISTS);
      }

      // Створення клієнта через репозиторій
      const result = await clientRepository.create(request);

      if (!result.success || !result.data) {
        return OperationResultFactory.error(
          result.error || CONSTANTS.ERROR_MESSAGES.CREATION_FAILED
        );
      }

      return OperationResultFactory.success(result.data);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CREATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Оновлення клієнта
   */
  async updateClient(
    id: string,
    request: UpdateClientDomainRequest
  ): Promise<OperationResult<ClientDomain>> {
    try {
      // Валідація даних
      const validationResult = this.validateUpdateRequest(request);
      if (!validationResult.isValid) {
        const errorMessages = (validationResult.validationErrors || []).map((e) => e.message);
        return OperationResultFactory.error(
          `${CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED}: ${errorMessages.join(', ')}`
        );
      }

      // Оновлення клієнта через репозиторій
      const result = await clientRepository.update(id, request);

      if (!result.success || !result.data) {
        return OperationResultFactory.error(result.error || CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED);
      }

      return OperationResultFactory.success(result.data);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Валідація даних клієнта для створення
   */
  validateClientData(
    request: CreateClientDomainRequest
  ): Promise<ValidationOperationResult<CreateClientDomainRequest>> {
    return Promise.resolve(this.validateClientRequest(request));
  }

  /**
   * Перевірка існування клієнта
   */
  async checkClientExists(phone: string, email?: string): Promise<OperationResult<boolean>> {
    try {
      // Пошук за телефоном
      const phoneSearchResult = await clientRepository.searchClients({ phone });
      if (!phoneSearchResult.success) {
        return OperationResultFactory.error(
          phoneSearchResult.error || CONSTANTS.ERROR_MESSAGES.UNKNOWN
        );
      }

      if (phoneSearchResult.data && phoneSearchResult.data.clients.length > 0) {
        return OperationResultFactory.success(true);
      }

      // Пошук за email, якщо вказано
      if (email) {
        const emailSearchResult = await clientRepository.searchClients({ email });
        if (!emailSearchResult.success) {
          return OperationResultFactory.error(
            emailSearchResult.error || CONSTANTS.ERROR_MESSAGES.UNKNOWN
          );
        }

        if (emailSearchResult.data && emailSearchResult.data.clients.length > 0) {
          return OperationResultFactory.success(true);
        }
      }

      return OperationResultFactory.success(false);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка перевірки існування клієнта: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Валідація запиту створення клієнта
   */
  validateClientRequest(
    request: CreateClientDomainRequest
  ): ValidationOperationResult<CreateClientDomainRequest> {
    const validationErrors: Array<{ field: string; message: string; code: string }> = [];

    // Валідація імені та прізвища
    if (!request.firstName?.trim()) {
      validationErrors.push({
        field: 'firstName',
        message: CONSTANTS.ERROR_MESSAGES.NAME_REQUIRED,
        code: 'REQUIRED',
      });
    } else if (
      request.firstName.length < CONSTANTS.VALIDATION.MIN_NAME_LENGTH ||
      request.firstName.length > CONSTANTS.VALIDATION.MAX_NAME_LENGTH
    ) {
      validationErrors.push({
        field: 'firstName',
        message: `Ім'я повинно містити від ${CONSTANTS.VALIDATION.MIN_NAME_LENGTH} до ${CONSTANTS.VALIDATION.MAX_NAME_LENGTH} символів`,
        code: 'LENGTH',
      });
    }

    if (!request.lastName?.trim()) {
      validationErrors.push({
        field: 'lastName',
        message: CONSTANTS.ERROR_MESSAGES.NAME_REQUIRED,
        code: 'REQUIRED',
      });
    } else if (
      request.lastName.length < CONSTANTS.VALIDATION.MIN_NAME_LENGTH ||
      request.lastName.length > CONSTANTS.VALIDATION.MAX_NAME_LENGTH
    ) {
      validationErrors.push({
        field: 'lastName',
        message: `Прізвище повинно містити від ${CONSTANTS.VALIDATION.MIN_NAME_LENGTH} до ${CONSTANTS.VALIDATION.MAX_NAME_LENGTH} символів`,
        code: 'LENGTH',
      });
    }

    // Валідація телефону
    if (!request.phone?.trim()) {
      validationErrors.push({
        field: 'phone',
        message: CONSTANTS.ERROR_MESSAGES.PHONE_REQUIRED,
        code: 'REQUIRED',
      });
    } else if (!CONSTANTS.VALIDATION.PHONE_PATTERN.test(request.phone)) {
      validationErrors.push({
        field: 'phone',
        message: 'Некоректний формат номера телефону (очікується +380XXXXXXXXX)',
        code: 'FORMAT',
      });
    }

    // Валідація email (якщо вказано)
    if (request.email && !CONSTANTS.VALIDATION.EMAIL_PATTERN.test(request.email)) {
      validationErrors.push({
        field: 'email',
        message: CONSTANTS.ERROR_MESSAGES.INVALID_EMAIL,
        code: 'FORMAT',
      });
    }

    // Валідація способів зв'язку
    if (!request.contactMethods || request.contactMethods.length === 0) {
      validationErrors.push({
        field: 'contactMethods',
        message: "Необхідно вказати хоча б один спосіб зв'язку",
        code: 'REQUIRED',
      });
    }

    const isValid = validationErrors.length === 0;

    return {
      success: isValid,
      data: isValid ? request : undefined,
      error: isValid ? undefined : CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED,
      validationErrors,
      isValid,
      timestamp: new Date(),
    };
  }

  /**
   * Валідація запиту оновлення клієнта
   */
  validateUpdateRequest(
    request: UpdateClientDomainRequest
  ): ValidationOperationResult<UpdateClientDomainRequest> {
    const validationErrors: Array<{ field: string; message: string; code: string }> = [];

    // Валідація імені та прізвища
    this.validateUpdateName(request, validationErrors);

    // Валідація телефону
    this.validateUpdatePhone(request, validationErrors);

    // Валідація email
    this.validateUpdateEmail(request, validationErrors);

    const isValid = validationErrors.length === 0;

    return {
      success: isValid,
      data: isValid ? request : undefined,
      error: isValid ? undefined : CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED,
      validationErrors,
      isValid,
      timestamp: new Date(),
    };
  }

  /**
   * Валідація імені та прізвища для оновлення
   */
  private validateUpdateName(
    request: UpdateClientDomainRequest,
    validationErrors: Array<{ field: string; message: string; code: string }>
  ): void {
    // Валідація імені (якщо вказано)
    if (request.firstName !== undefined) {
      if (!request.firstName?.trim()) {
        validationErrors.push({
          field: 'firstName',
          message: "Ім'я не може бути порожнім",
          code: 'REQUIRED',
        });
      } else if (
        request.firstName.length < CONSTANTS.VALIDATION.MIN_NAME_LENGTH ||
        request.firstName.length > CONSTANTS.VALIDATION.MAX_NAME_LENGTH
      ) {
        validationErrors.push({
          field: 'firstName',
          message: `Ім'я повинно містити від ${CONSTANTS.VALIDATION.MIN_NAME_LENGTH} до ${CONSTANTS.VALIDATION.MAX_NAME_LENGTH} символів`,
          code: 'LENGTH',
        });
      }
    }

    // Валідація прізвища (якщо вказано)
    if (request.lastName !== undefined) {
      if (!request.lastName?.trim()) {
        validationErrors.push({
          field: 'lastName',
          message: 'Прізвище не може бути порожнім',
          code: 'REQUIRED',
        });
      } else if (
        request.lastName.length < CONSTANTS.VALIDATION.MIN_NAME_LENGTH ||
        request.lastName.length > CONSTANTS.VALIDATION.MAX_NAME_LENGTH
      ) {
        validationErrors.push({
          field: 'lastName',
          message: `Прізвище повинно містити від ${CONSTANTS.VALIDATION.MIN_NAME_LENGTH} до ${CONSTANTS.VALIDATION.MAX_NAME_LENGTH} символів`,
          code: 'LENGTH',
        });
      }
    }
  }

  /**
   * Валідація телефону для оновлення
   */
  private validateUpdatePhone(
    request: UpdateClientDomainRequest,
    validationErrors: Array<{ field: string; message: string; code: string }>
  ): void {
    if (request.phone !== undefined) {
      if (!request.phone?.trim()) {
        validationErrors.push({
          field: 'phone',
          message: 'Номер телефону не може бути порожнім',
          code: 'REQUIRED',
        });
      } else if (!CONSTANTS.VALIDATION.PHONE_PATTERN.test(request.phone)) {
        validationErrors.push({
          field: 'phone',
          message: 'Некоректний формат номера телефону (очікується +380XXXXXXXXX)',
          code: 'FORMAT',
        });
      }
    }
  }

  /**
   * Валідація email для оновлення
   */
  private validateUpdateEmail(
    request: UpdateClientDomainRequest,
    validationErrors: Array<{ field: string; message: string; code: string }>
  ): void {
    if (
      request.email !== undefined &&
      request.email &&
      !CONSTANTS.VALIDATION.EMAIL_PATTERN.test(request.email)
    ) {
      validationErrors.push({
        field: 'email',
        message: CONSTANTS.ERROR_MESSAGES.INVALID_EMAIL,
        code: 'FORMAT',
      });
    }
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientCreationService = new ClientCreationService();
