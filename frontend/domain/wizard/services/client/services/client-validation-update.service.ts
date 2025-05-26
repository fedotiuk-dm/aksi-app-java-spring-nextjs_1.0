/**
 * @fileoverview Сервіс валідації для оновлення клієнтів
 * @module domain/wizard/services/client/services/client-validation-update
 */

import { CLIENT_VALIDATION_CONSTANTS } from './client-validation-constants.service';

import type { ValidationOperationResult, ValidationError } from '../../interfaces';
import type { UpdateClientDomainRequest } from '../types';

/**
 * Інтерфейс сервісу валідації для оновлення клієнтів
 */
export interface IClientValidationUpdateService {
  validateUpdateData(
    request: UpdateClientDomainRequest
  ): Promise<ValidationOperationResult<UpdateClientDomainRequest>>;
}

/**
 * Сервіс валідації для оновлення клієнтів
 * Відповідальність: валідація даних при оновленні існуючих клієнтів
 */
export class ClientValidationUpdateService implements IClientValidationUpdateService {
  public readonly name = 'ClientValidationUpdateService';
  public readonly version = '1.0.0';

  /**
   * Валідація даних клієнта для оновлення
   */
  async validateUpdateData(
    request: UpdateClientDomainRequest
  ): Promise<ValidationOperationResult<UpdateClientDomainRequest>> {
    return Promise.resolve(this.validateUpdateRequest(request));
  }

  /**
   * Валідація запиту оновлення клієнта
   */
  private validateUpdateRequest(
    request: UpdateClientDomainRequest
  ): ValidationOperationResult<UpdateClientDomainRequest> {
    const validationErrors: ValidationError[] = [];

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
      error: isValid ? undefined : CLIENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED,
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
    validationErrors: ValidationError[]
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
        request.firstName.length < CLIENT_VALIDATION_CONSTANTS.VALIDATION.MIN_NAME_LENGTH ||
        request.firstName.length > CLIENT_VALIDATION_CONSTANTS.VALIDATION.MAX_NAME_LENGTH
      ) {
        validationErrors.push({
          field: 'firstName',
          message: `Ім'я повинно містити від ${CLIENT_VALIDATION_CONSTANTS.VALIDATION.MIN_NAME_LENGTH} до ${CLIENT_VALIDATION_CONSTANTS.VALIDATION.MAX_NAME_LENGTH} символів`,
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
  }

  /**
   * Валідація телефону для оновлення
   */
  private validateUpdatePhone(
    request: UpdateClientDomainRequest,
    validationErrors: ValidationError[]
  ): void {
    if (request.phone !== undefined) {
      if (!request.phone?.trim()) {
        validationErrors.push({
          field: 'phone',
          message: 'Номер телефону не може бути порожнім',
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
  }

  /**
   * Валідація email для оновлення
   */
  private validateUpdateEmail(
    request: UpdateClientDomainRequest,
    validationErrors: ValidationError[]
  ): void {
    if (
      request.email !== undefined &&
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
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientValidationUpdateService = new ClientValidationUpdateService();
