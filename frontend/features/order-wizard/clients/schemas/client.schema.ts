import { z } from 'zod';

export const clientSchema = z.object({
  firstName: z.string().min(1, "Ім'я обов'язкове"),
  lastName: z.string().min(1, "Прізвище обов'язкове"),
  phone: z
    .string()
    .min(1, "Телефон обов'язковий")
    .regex(/^\+?[0-9]{10,15}$/, 'Невірний формат телефону'),
  email: z.string().email('Невірний формат email').optional().or(z.literal('')),
  address: z.string().optional(),
  communicationChannels: z
    .array(z.enum(['PHONE', 'SMS', 'VIBER'] as const))
    .min(1, "Виберіть хоча б один спосіб зв'язку"),
  source: z.enum(['INSTAGRAM', 'GOOGLE', 'RECOMMENDATION', 'OTHER'] as const),
  sourceDetails: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
