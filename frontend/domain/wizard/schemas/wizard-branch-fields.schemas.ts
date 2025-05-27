/**
 * @fileoverview Схеми валідації для полів філій в Order Wizard
 * @module domain/wizard/schemas/wizard-branch-fields
 */

import { z } from 'zod';

// ============= БАЗОВІ СХЕМИ =============

/**
 * Схема для ID філії
 */
export const wizardBranchIdSchema = z
  .string()
  .min(1, 'ID філії не може бути порожнім')
  .uuid('ID філії повинен бути валідним UUID');

/**
 * Схема для коду філії
 */
export const wizardBranchCodeSchema = z
  .string()
  .min(1, 'Код філії не може бути порожнім')
  .max(10, 'Код філії не може перевищувати 10 символів')
  .regex(/^[A-Z0-9]+$/, 'Код філії може містити тільки великі літери та цифри');

/**
 * Схема для назви філії
 */
export const wizardBranchNameSchema = z
  .string()
  .min(2, 'Назва філії повинна містити мінімум 2 символи')
  .max(100, 'Назва філії не може перевищувати 100 символів')
  .trim();

/**
 * Схема для адреси філії
 */
export const wizardBranchAddressSchema = z
  .string()
  .min(5, 'Адреса філії повинна містити мінімум 5 символів')
  .max(200, 'Адреса філії не може перевищувати 200 символів')
  .trim();

/**
 * Схема для телефону філії
 */
export const wizardBranchPhoneSchema = z
  .string()
  .regex(/^\+?[0-9\s\-\(\)]{10,15}$/, 'Некоректний формат телефону')
  .optional();

// ============= КОМПЛЕКСНІ СХЕМИ =============

/**
 * Схема для філії в wizard
 */
export const wizardBranchSchema = z.object({
  id: wizardBranchIdSchema,
  name: wizardBranchNameSchema,
  address: wizardBranchAddressSchema,
  phone: wizardBranchPhoneSchema,
  code: wizardBranchCodeSchema,
  active: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * Схема для створення філії
 */
export const wizardBranchCreateDataSchema = z.object({
  name: wizardBranchNameSchema,
  address: wizardBranchAddressSchema,
  phone: wizardBranchPhoneSchema,
  code: wizardBranchCodeSchema,
  active: z.boolean().default(true),
});

/**
 * Схема для оновлення філії
 */
export const wizardBranchUpdateDataSchema = z.object({
  name: wizardBranchNameSchema.optional(),
  address: wizardBranchAddressSchema.optional(),
  phone: wizardBranchPhoneSchema,
  code: wizardBranchCodeSchema.optional(),
  active: z.boolean().optional(),
});

/**
 * Схема для фільтрів філій
 */
export const wizardBranchFiltersSchema = z.object({
  searchTerm: z.string().trim().optional(),
  active: z.boolean().optional(),
  code: wizardBranchCodeSchema.optional(),
  city: z.string().trim().min(2).max(50).optional(),
});

/**
 * Схема для результату операції з філією
 */
export const wizardBranchOperationResultSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
});

/**
 * Схема для результату валідації філії
 */
export const wizardBranchValidationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string()),
  warnings: z.array(z.string()),
  fieldErrors: z.record(z.array(z.string())),
});

// ============= ЕКСПОРТОВАНІ ТИПИ =============

export type WizardBranch = z.infer<typeof wizardBranchSchema>;
export type WizardBranchCreateData = z.infer<typeof wizardBranchCreateDataSchema>;
export type WizardBranchUpdateData = z.infer<typeof wizardBranchUpdateDataSchema>;
export type WizardBranchFilters = z.infer<typeof wizardBranchFiltersSchema>;
export type WizardBranchOperationResult<T = unknown> = z.infer<
  typeof wizardBranchOperationResultSchema
> & { data?: T };
export type WizardBranchValidationResult = z.infer<typeof wizardBranchValidationResultSchema>;
