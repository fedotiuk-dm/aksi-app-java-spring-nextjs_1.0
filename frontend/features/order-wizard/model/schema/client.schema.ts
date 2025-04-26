import { z } from 'zod';
// Використовуємо значення типів напряму у z.enum() без імпорту самих типів

// Схема для адреси клієнта
export const clientAddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  additionalInfo: z.string().optional(),
});

// Схема для джерела інформації клієнта
export const clientSourceInfoSchema = z
  .object({
    source: z.enum(['INSTAGRAM', 'GOOGLE', 'RECOMMENDATION', 'OTHER'] as const),
    details: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      // Якщо джерело "OTHER", деталі обов'язкові
      return (
        data.source !== 'OTHER' ||
        (data.details && data.details.trim().length > 0)
      );
    },
    {
      message: "Якщо джерело 'Інше', потрібно вказати деталі",
      path: ['details'],
    }
  );

// Схема для клієнта - використовується для валідації форми створення/редагування клієнта
export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(1, "Ім'я обов'язкове"),
  lastName: z.string().min(1, "Прізвище обов'язкове"),
  phone: z.string().min(10, 'Введіть коректний номер телефону'),
  email: z.string().email('Введіть коректний email').optional().nullable(),
  address: clientAddressSchema.optional().nullable(),
  communicationChannels: z
    .array(z.enum(['PHONE', 'SMS', 'VIBER'] as const))
    .default([]),
  source: clientSourceInfoSchema.optional().nullable(),
});

// Схема для пошуку клієнта
export const clientSearchSchema = z.object({
  query: z.string().min(2, 'Введіть мінімум 2 символи для пошуку').optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
});
