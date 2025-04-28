import { z } from 'zod';

/**
 * Базові типи плям
 */
export enum StainType {
  GREASE = 'GREASE', // Жир
  BLOOD = 'BLOOD', // Кров
  PROTEIN = 'PROTEIN', // Білок
  WINE = 'WINE', // Вино
  COFFEE = 'COFFEE', // Кава
  GRASS = 'GRASS', // Трава
  INK = 'INK', // Чорнило
  COSMETICS = 'COSMETICS', // Косметика
  OTHER = 'OTHER', // Інше
}

/**
 * Типи дефектів та ризиків
 */
export enum DefectType {
  WORN = 'WORN', // Потертості
  TORN = 'TORN', // Порване
  MISSING_HARDWARE = 'MISSING_HARDWARE', // Відсутність фурнітури
  DAMAGED_HARDWARE = 'DAMAGED_HARDWARE', // Пошкодження фурнітури
  COLOR_CHANGE_RISK = 'COLOR_CHANGE_RISK', // Ризики зміни кольору
  DEFORMATION_RISK = 'DEFORMATION_RISK', // Ризики деформації
  NO_GUARANTEE = 'NO_GUARANTEE', // Без гарантій
}

/**
 * Інтерфейс для представлення плями
 */
export interface Stain {
  type: StainType;
  description?: string; // Опис для 'OTHER'
}

/**
 * Інтерфейс для представлення дефекту
 */
export interface Defect {
  type: DefectType;
  description?: string; // Пояснення для 'NO_GUARANTEE' або додаткові деталі
}

/**
 * Схема для перевірки даних про плями
 */
const stainSchema = z.object({
  type: z.nativeEnum(StainType),
  description: z.string().optional(),
});

/**
 * Схема для перевірки даних про дефекти
 */
const defectSchema = z.object({
  type: z.nativeEnum(DefectType),
  description: z.string().optional(),
});

/**
 * Схема для валідації форми з переліком плям та дефектів
 */
export const itemDefectsSchema = z.object({
  // Масив плям
  stains: z.array(stainSchema).default([]).superRefine((stains, ctx) => {
    // Перевірка наявності опису для плям типу 'OTHER'
    stains.forEach((stain, index) => {
      if (stain.type === StainType.OTHER && (!stain.description || stain.description.trim() === '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Для плями типу "Інше" необхідно вказати опис',
          path: [`stains.${index}.description`],
        });
      }
    });
  }),

  // Масив дефектів
  defects: z.array(defectSchema).default([]).superRefine((defects, ctx) => {
    // Перевірка наявності пояснення для дефектів типу 'NO_GUARANTEE'
    defects.forEach((defect, index) => {
      if (defect.type === DefectType.NO_GUARANTEE && (!defect.description || defect.description.trim() === '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Для дефекту "Без гарантій" необхідно вказати пояснення',
          path: [`defects.${index}.description`],
        });
      }
    });
  }),

  // Загальні примітки щодо дефектів
  notes: z.string().optional(),
});

/**
 * Тип для форми з переліком плям та дефектів
 */
export type ItemDefectsFormValues = z.infer<typeof itemDefectsSchema>;

/**
 * Функція для отримання локалізованої назви типу плями
 */
export function getStainTypeLabel(stainType: StainType): string {
  const stainLabels: Record<StainType, string> = {
    [StainType.GREASE]: 'Жир',
    [StainType.BLOOD]: 'Кров',
    [StainType.PROTEIN]: 'Білок',
    [StainType.WINE]: 'Вино',
    [StainType.COFFEE]: 'Кава',
    [StainType.GRASS]: 'Трава',
    [StainType.INK]: 'Чорнило',
    [StainType.COSMETICS]: 'Косметика',
    [StainType.OTHER]: 'Інше',
  };
  
  return stainLabels[stainType] || stainType;
}

/**
 * Функція для отримання локалізованої назви типу дефекту
 */
export function getDefectTypeLabel(defectType: DefectType): string {
  const defectLabels: Record<DefectType, string> = {
    [DefectType.WORN]: 'Потертості',
    [DefectType.TORN]: 'Порване',
    [DefectType.MISSING_HARDWARE]: 'Відсутність фурнітури',
    [DefectType.DAMAGED_HARDWARE]: 'Пошкодження фурнітури',
    [DefectType.COLOR_CHANGE_RISK]: 'Ризики зміни кольору',
    [DefectType.DEFORMATION_RISK]: 'Ризики деформації',
    [DefectType.NO_GUARANTEE]: 'Без гарантій',
  };
  
  return defectLabels[defectType] || defectType;
}
