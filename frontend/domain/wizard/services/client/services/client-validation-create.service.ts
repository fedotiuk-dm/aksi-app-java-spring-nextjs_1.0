/**
 * @fileoverview Сервіс валідації для створення клієнтів
 * @module domain/wizard/services/client/services/client-validation-create
 */

import { CLIENT_VALIDATION_CONSTANTS } from './client-validation-constants.service';

import type { ValidationOperationResult, ValidationError } from '../../interfaces';
import type { CreateClientDomainRequest } from '../types';

/**
 * Інтерфейс сервісу валідації для створення клієнтів
 */
export interface IClientValidationCreateService {
  validateClientData(
    request: CreateClientDomainRequest
  ): Promise<ValidationOperationResult<CreateClientDomainRequest>>;
}

/**
 * Сервіс валідації для створення клієнтів
 * Відповідальність: валідація даних при створенні нових клієнтів
 */
export class ClientValidationCreateService implements IClientValidationCreateService {
  public readonly name = 'ClientValidationCreateService';
  public readonly version = '1.0.0';

  /**
   * Валідація даних клієнта для створення
   */
  async validateClientData(
    request: CreateClientDomainRequest
  ): Promise<ValidationOperationResult<CreateClientDomainRequest>> {
    return Promise.resolve(this.validateClientRequest(request));
  }

  /**
   * Валідація запиту створення клієнта
   */
  private validateClientRequest(
    request: CreateClientDomainRequest
  ): ValidationOperationResult<CreateClientDomainRequest> {
    const validationErrors: ValidationError[] = [];

    // Валідація імені та прізвища
    this.validateCreateName(request, validationErrors);

    // Валідація телефону
    this.validateCreatePhone(request, validationErrors);

    // Валідація email
    this.validateCreateEmail(request, validationErrors);

    // Валідація способів зв'язку
    this.validateContactMethods(request, validationErrors);

    const isValid = validationErrors.length === 0;

    return {
      success: isValid,
      data: isValid ? request : undefined,
      error: isValid ? undefined : CLIENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED,
      validationErrors,
      isValid,
      timestamp: new Date(),
    };
  }

  /**
   * Валідація імені та прізвища для створення
   */
  private validateCreateName(
    request: CreateClientDomainRequest,
    validationErrors: ValidationError[]
  ): void {
    if (!request.firstName?.trim()) {
      validationErrors.push({
        field: 'firstName',
        message: CLIENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.NAME_REQUIRED,
        code: 'REQUIRED',
      });
    } else if (
      request.firstName.length < CLIENT_VALIDATION_CONSTANTS.VALIDATION.MIN_NAME_LENGTH ||
      request.firstName.length > CLIENT_VALIDATION_CONSTANTS.VALIDATION.MAX_NAME_LENGTH
    ) {
      validationErrors.push({
        field: 'firstName',
        message: `Ім'я повинно містити від ${CLIENT_VALIDATION_CONSTANTS.VALIDATION.MIN_NAME_LENGTH} до ${CLIENT_VALIDATION_CONSTANTS.VALIDATION.MAX_NAME_LENGTH} символів`,
        code: 'LENGTH',
      });
    }

    if (!request.lastName?.trim()) {
      validationErrors.push({
        field: 'lastName',
        message: CLIENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.NAME_REQUIRED,
        code: 'REQUIRED',
      });
    } else if (
      request.lastName.length < CLIENT_VALIDATION_CONSTANTS.VALIDATION.MIN_NAME_LENGTH ||
      request.lastName.length > CLIENT_VALIDATION_CONSTANTS.VALIDATION.MAX_NAME_LENGTH
    ) {
      validationErrors.push({
        field: 'lastName',
        message: `Прізвище повинно містити від ${CLIENT_VALIDATION_CONSTANTS.VALIDATION.MIN_NAME_LENGTH} до ${CLIENT_VALIDATION_CONSTANTS.VALIDATION.MAX_NAME_LENGTH} символів`,
        code: 'LENGTH',
      });
    }
  }

  /**
   * Валідація телефону для створення
   */
  private validateCreatePhone(
    request: CreateClientDomainRequest,
    validationErrors: ValidationError[]
  ): void {
    if (!request.phone?.trim()) {
      validationErrors.push({
        field: 'phone',
        message: CLIENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.PHONE_REQUIRED,
        code: 'REQUIRED',
      });
    } else if (!CLIENT_VALIDATION_CONSTANTS.VALIDATION.PHONE_PATTERN.test(request.phone)) {
      validationErrors.push({
        field: 'phone',
        message: 'Некоректний формат номера телефону (очікується +380XXXXXXXXX)',
        code: 'FORMAT',
      });
    }
  }

  /**
   * Валідація email для створення
   */
  private validateCreateEmail(
    request: CreateClientDomainRequest,
    validationErrors: ValidationError[]
  ): void {
    if (
      request.email &&
      !CLIENT_VALIDATION_CONSTANTS.VALIDATION.EMAIL_PATTERN.test(request.email)
    ) {
      validationErrors.push({
        field: 'email',
        message: CLIENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.INVALID_EMAIL,
        code: 'FORMAT',
      });
    }
  }

  /**
   * Валідація способів зв'язку
   */
  private validateContactMethods(
    request: CreateClientDomainRequest,
    validationErrors: ValidationError[]
  ): void {
    if (!request.contactMethods || request.contactMethods.length === 0) {
      validationErrors.push({
        field: 'contactMethods',
        message: "Необхідно вказати хоча б один спосіб зв'язку",
        code: 'REQUIRED',
      });
    }
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientValidationCreateService = new ClientValidationCreateService();
