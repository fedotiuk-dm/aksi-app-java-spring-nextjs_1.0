/**
 * Базові схеми wizard - відповідальність за внутрішню структуру wizard
 */

import { z } from 'zod';

import { WizardMode, ValidationStatus } from '../types/wizard-modes.types';

/**
 * Базова схема валідації кроку
 */
export const wizardStepStateSchema = z.object({
  isValid: z.boolean(),
  isComplete: z.boolean(),
  validationStatus: z.nativeEnum(ValidationStatus),
  errors: z.array(z.string()),
  lastValidated: z.date().nullable(),
});

/**
 * Схема метаданих wizard
 */
export const wizardMetadataSchema = z.object({
  startedAt: z.string(),
  lastUpdated: z.string().optional(),
  userAgent: z.string().optional(),
  sessionId: z.string().optional(),
  version: z.string().optional(),
});

/**
 * Схема контексту wizard
 */
export const wizardContextSchema = z.object({
  mode: z.nativeEnum(WizardMode),
  orderId: z.string().optional(),
  customerId: z.string().optional(),
  metadata: wizardMetadataSchema,
});

/**
 * Схема стану збереження
 */
export const saveStateSchema = z.object({
  isDraft: z.boolean(),
  autoSaveEnabled: z.boolean(),
  lastSaved: z.date().nullable(),
  hasUnsavedChanges: z.boolean(),
});
