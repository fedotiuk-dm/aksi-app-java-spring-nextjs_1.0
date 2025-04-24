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
  
  // ID елемента прайс-листа (обов'язковий)
  priceListItemId: z.string().min(1, { message: 'Потрібно вибрати найменування виробу' }),
  
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
 * Схема для характеристик предмета (підетап 2.2)
 */
export const itemPropertiesSchema = z.object({
  // Матеріал (обов'язковий, залежить від категорії)
  materialType: z.string().min(1, { message: 'Потрібно вибрати матеріал' }),
  
  // Колір (обов'язковий)
  color: z.string().min(1, { message: 'Потрібно вказати колір' }),
  
  // Кастомний колір (необов'язковий)
  customColor: z.string().optional(),
  
  // Наповнювач (необов'язковий, тільки для деяких категорій)
  filling: z.string().optional(),
  
  // Чи збитий наповнювач
  isFillingFlattened: z.boolean().default(false).optional(),
  
  // Ступінь зносу (у відсотках: 10, 30, 50, 75)
  wearDegree: z.number().min(0).max(100).default(10),
  
  // Зберігаємо старі поля для сумісності
  material: z.string().optional(),
  filler: z.string().optional(),
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
