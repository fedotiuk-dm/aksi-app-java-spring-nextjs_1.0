/**
 * Zod схеми валідації для предметів замовлення
 */
import { z } from 'zod';

// Імпортуємо тільки типи, а не значення
// для enum створюємо власний об'єкт

// Типи одиниць виміру
const UNIT_OF_MEASUREMENT = {
  PIECE: 'PIECE',
  KILOGRAM: 'KILOGRAM'
} as const;

/**
 * Базова схема для предмета замовлення
 */
export const basicItemSchema = z.object({
  // Назва предмета (обов'язкова)
  name: z.string().min(1, { message: 'Назва предмета обов\'язкова' }),
  
  // Категорія (обов'язкова)
  categoryId: z.string().min(1, { message: 'Потрібно вибрати категорію' }),
  
  // Опис (необов'язковий)
  defectNotes: z.string().optional(),
  
  // Кількість (обов'язкова, мінімум 0.1)
  quantity: z.number().min(0.1, { message: 'Кількість має бути більше 0' }),
  
  // Одиниця виміру (обов'язкова)
  unitOfMeasurement: z.enum([UNIT_OF_MEASUREMENT.PIECE, UNIT_OF_MEASUREMENT.KILOGRAM])
    .default(UNIT_OF_MEASUREMENT.PIECE),
    
  // ID предмета (при редагуванні)
  id: z.string().optional(),
  
  // Локальний ID предмета (для нових)
  localId: z.string().optional(),
});

/**
 * Схема для характеристик предмета
 */
export const itemPropertiesSchema = z.object({
  // Матеріал (необов'язковий, але якщо є, то має бути не пустим)
  material: z.string().min(1, { message: 'Матеріал не може бути пустим' }).optional(),
  
  // Колір (необов'язковий, але якщо є, то має бути не пустим)
  color: z.string().min(1, { message: 'Колір не може бути пустим' }).optional(),
  
  // Наповнювач
  filler: z.string().optional(),
  
  // Спеціальні властивості предмета
  childSized: z.boolean().optional(),
  clumpedFiller: z.boolean().optional(),
  manualCleaning: z.boolean().optional(),
  heavilySoiled: z.boolean().optional(),
  heavilySoiledPercentage: z.number().min(0).max(100).optional(),
  noWarranty: z.boolean().optional(),
  noWarrantyReason: z.string().optional(),
});

/**
 * Схема для ціноутворення предмета
 */
export const itemPricingSchema = z.object({
  // Базова ціна (обов'язкова)
  basePrice: z.number().min(0, { message: 'Ціна не може бути від\'ємною' }),
  
  // Додаткова вартість послуг (необов'язкова)
  additionalServicesCost: z.number().min(0).default(0),
  
  // Знижка (необов'язкова)
  discount: z.number().min(0).max(100).default(0),
  
  // Фінальна ціна (розраховується)
  finalPrice: z.number().min(0).optional(),
});

/**
 * Повна схема предмета
 */
export const fullItemSchema = basicItemSchema
  .merge(itemPropertiesSchema)
  .merge(itemPricingSchema);

/**
 * Типи, виведені зі схем
 */
export type BasicItemFormValues = z.infer<typeof basicItemSchema>;
export type ItemPropertiesFormValues = z.infer<typeof itemPropertiesSchema>;
export type ItemPricingFormValues = z.infer<typeof itemPricingSchema>;
export type FullItemFormValues = z.infer<typeof fullItemSchema>;
