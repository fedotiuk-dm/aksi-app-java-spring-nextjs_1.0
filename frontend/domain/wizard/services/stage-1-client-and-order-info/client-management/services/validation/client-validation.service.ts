/**
 * @fileoverview Сервіс валідації даних клієнта
 * @module domain/wizard/services/stage-1/client-management/services/validation
 */

import { z } from 'zod';

import type { OperationResult } from '../../interfaces';
import type { ClientData } from '../../types';

/**
 * Сервіс валідації даних клієнта
 */
export class ClientValidationService {
  /**
   * Валідація формату електронної пошти
   */
  static validateEmail(email?: string): OperationResult<string> {
    if (!email) {
      return { success: true };
    }

    const emailSchema = z.string().email();
    const result = emailSchema.safeParse(email);

    if (!result.success) {
      return {
        success: false,
        error: 'Некоректний формат електронної пошти',
        warnings: result.error.errors.map(e => e.message)
      };
    }

    return { success: true, data: email };
  }

  /**
   * Валідація формату телефонного номера
   */
  static validatePhone(phone: string): OperationResult<string> {
    // Перевірка на наявність
    if (!phone) {
      return {
        success: false,
        error: 'Телефон обов’язковий'
      };
    }

    // Перевірка формату телефону - може бути більш складною для реального проекту
    const phoneSchema = z.string().min(10).max(13).regex(/^[+]?[0-9]+$/);
    const result = phoneSchema.safeParse(phone);

    if (!result.success) {
      return {
        success: false,
        error: 'Некоректний формат телефону',
        warnings: result.error.errors.map(e => e.message)
      };
    }

    return { success: true, data: phone };
  }

  /**
   * Валідація імені та прізвища
   */
  static validateName(name: string, fieldName: string): OperationResult<string> {
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: `${fieldName} обов’язкове`
      };
    }

    const nameSchema = z.string().min(2).max(50);
    const result = nameSchema.safeParse(name);

    if (!result.success) {
      return {
        success: false,
        error: `${fieldName} повинно містити від 2 до 50 символів`,
        warnings: result.error.errors.map(e => e.message)
      };
    }

    return { success: true, data: name };
  }

  /**
   * Валідація обов'язкових полів
   */
  private static validateRequiredFields(clientData: Partial<ClientData>): OperationResult<void> {
    // Перевірка обов'язкових полів
    if (clientData.firstName === undefined) {
      return { success: false, error: 'Ім’я обов’язкове' };
    }
    
    if (clientData.lastName === undefined) {
      return { success: false, error: 'Прізвище обов’язкове' };
    }
    
    if (clientData.phone === undefined) {
      return { success: false, error: 'Телефон обов’язковий' };
    }
    
    return { success: true };
  }

  /**
   * Комплексна валідація даних клієнта
   */
  static validateClientData(clientData: Partial<ClientData>): OperationResult<ClientData> {
    const warnings: string[] = [];
    
    // Перевірка обов'язкових полів
    const requiredFieldsResult = this.validateRequiredFields(clientData);
    if (!requiredFieldsResult.success) {
      return { 
        success: false, 
        error: requiredFieldsResult.error 
      };
    }
    
    // Перевірка імені
    // Ми знаємо, що firstName існує, тому що ми перевірили це в validateRequiredFields
    const firstName = clientData.firstName || ''; // Додавання замість non-null assertion
    const firstNameResult = this.validateName(firstName, 'Ім’я');
    if (!firstNameResult.success) {
      return { 
        success: false, 
        error: firstNameResult.error,
        warnings: firstNameResult.warnings 
      };
    }

    // Перевірка прізвища
    const lastName = clientData.lastName || ''; // Додавання замість non-null assertion
    const lastNameResult = this.validateName(lastName, 'Прізвище');
    if (!lastNameResult.success) {
      return { 
        success: false, 
        error: lastNameResult.error,
        warnings: lastNameResult.warnings 
      };
    }

    // Перевірка телефону
    const phone = clientData.phone || ''; // Додавання замість non-null assertion
    const phoneResult = this.validatePhone(phone);
    if (!phoneResult.success) {
      return { 
        success: false, 
        error: phoneResult.error,
        warnings: phoneResult.warnings 
      };
    }

    // Перевірка email якщо він є
    if (clientData.email) {
      const emailResult = this.validateEmail(clientData.email);
      if (!emailResult.success) {
        return { 
          success: false, 
          error: emailResult.error,
          warnings: emailResult.warnings 
        };
      }
    }

    // Якщо всі перевірки пройдено успішно
    return {
      success: true,
      data: clientData as ClientData,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
}
