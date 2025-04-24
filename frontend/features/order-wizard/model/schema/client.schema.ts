/**
 * Zod схеми для валідації форм клієнта
 */
import { z } from 'zod';

/**
 * Схема для контактних методів клієнта (для UI)
 */
export const contactMethodsSchema = z.object({
  phone: z.boolean().default(true),
  sms: z.boolean().default(false),
  viber: z.boolean().default(false),
});

/**
 * Схема для джерела інформації
 */
export const informationSourceSchema = z.enum([
  'instagram', 
  'google', 
  'recommendation', 
  'other'
]);

/**
 * Базова схема для форми створення клієнта
 */
const baseCreateClientFormSchema = z.object({
  firstName: z.string()
    .min(2, { message: "Ім'я повинно містити мінімум 2 символи" })
    .max(50, { message: "Ім'я занадто довге" }),
  
  lastName: z.string()
    .min(2, { message: "Прізвище повинно містити мінімум 2 символи" })
    .max(50, { message: "Прізвище занадто довге" }),
  
  phone: z.string()
    .min(5, { message: "Номер телефону повинен містити мінімум 5 символів" }),
  
  email: z.string()
    .email({ message: "Невірний формат email" })
    .or(z.literal(""))
    .optional(),
  
  address: z.string()
    .max(200, { message: 'Адреса занадто довга' })
    .optional()
    .or(z.literal('')),
  
  contactMethods: contactMethodsSchema.optional(),
  
  informationSource: informationSourceSchema.optional(),
  
  otherSourceInfo: z.string()
    .max(200, { message: 'Додаткова інформація занадто довга' })
    .optional()
    .or(z.literal('')),
});

/**
 * Схема для форми створення клієнта з додатковими валідаціями
 */
export const createClientFormSchema = baseCreateClientFormSchema.refine(
  (data) => {
    // Якщо джерело інформації 'other', потрібно вказати додаткову інформацію
    if (data.informationSource === 'other') {
      return !!data.otherSourceInfo && data.otherSourceInfo.trim().length > 0;
    }
    return true;
  },
  {
    message: 'Вкажіть джерело інформації',
    path: ['otherSourceInfo']
  }
);

/**
 * Схема для пошуку клієнтів
 */
export const searchClientSchema = z.object({
  searchQuery: z.string()
    .min(3, { message: 'Пошуковий запит повинен містити мінімум 3 символи' })
    .max(100, { message: 'Пошуковий запит занадто довгий' })
});

// Типи, виведені зі схем
export type CreateClientFormValues = z.infer<typeof createClientFormSchema>;
export type SearchClientFormValues = z.infer<typeof searchClientSchema>;
