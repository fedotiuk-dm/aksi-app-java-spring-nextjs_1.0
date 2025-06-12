/**
 * @fileoverview Схеми для домену "Створення клієнта"
 *
 * Експортує готові Orval схеми та локальні UI форми для створення нового клієнта
 */

import { z } from 'zod';

// Експорт готових Zod схем з Orval
export {
  // Form Data schemas
  stage1GetClientFormData200Response as ClientFormDataSchema,
  stage1UpdateClientDataBody as ClientUpdateDataSchema,

  // Form State schemas
  stage1GetClientFormState200Response as ClientFormStateSchema,

  // Client Creation schemas
  stage1CreateClient200Response as CreatedClientSchema,
  stage1InitializeNewClient200Response as InitializeClientSessionSchema,
} from '@/shared/api/generated/wizard/zod/aksiApi';

// Локальні UI схеми для форм
export const clientCreationUIFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "Ім'я повинно містити мінімум 2 символи")
    .max(50, "Ім'я не може бути довше 50 символів"),
  lastName: z
    .string()
    .min(2, 'Прізвище повинно містити мінімум 2 символи')
    .max(50, 'Прізвище не може бути довше 50 символів'),
  phone: z
    .string()
    .min(10, 'Телефон повинен містити мінімум 10 символів')
    .max(15, 'Телефон не може бути довше 15 символів')
    .regex(/^\+?[0-9]{10,15}$/, 'Неправильний формат телефону'),
  email: z.string().email('Введіть коректний email').optional().or(z.literal('')),
  address: z
    .string()
    .max(200, 'Адреса не може бути довше 200 символів')
    .optional()
    .or(z.literal('')),
  communicationChannels: z
    .array(z.enum(['PHONE', 'SMS', 'VIBER']))
    .min(1, "Оберіть хоча б один спосіб зв'язку"),
  informationSource: z.enum(['INSTAGRAM', 'GOOGLE', 'RECOMMENDATION', 'OTHER']),
  sourceDetails: z
    .string()
    .max(100, 'Деталі джерела не можуть бути довше 100 символів')
    .optional()
    .or(z.literal('')),
});

export type ClientCreationUIFormData = z.infer<typeof clientCreationUIFormSchema>;
