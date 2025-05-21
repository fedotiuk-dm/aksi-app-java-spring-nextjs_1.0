import { z } from 'zod';

import { longText } from '@features/order-wizard/shared';

/**
 * Схема для дефектів та забруднень предмета замовлення
 */
export const defectsStainsSchema = z.object({
  defects: longText.optional(),
  stains: longText.optional(),
  otherStains: longText.optional(),
  defectsAndRisks: longText.optional(),
  noGuaranteeReason: longText.optional(),
  defectsNotes: longText.optional(),
  specialInstructions: longText.optional()
});

/**
 * Схема форми для дефектів та забруднень
 */
export const defectsStainsFormSchema = defectsStainsSchema;

/**
 * Типи даних на основі схем
 */
export type DefectsStains = z.infer<typeof defectsStainsSchema>;
export type DefectsStainsForm = z.infer<typeof defectsStainsFormSchema>;
