import { z } from 'zod';

/**
 * Типи матеріалів, які можуть бути використані для предметів
 */
export enum MaterialType {
  COTTON = 'COTTON', // Бавовна
  WOOL = 'WOOL', // Шерсть
  SILK = 'SILK', // Шовк
  SYNTHETIC = 'SYNTHETIC', // Синтетика
  SMOOTH_LEATHER = 'SMOOTH_LEATHER', // Гладка шкіра
  NUBUCK = 'NUBUCK', // Нубук
  SPLIT_LEATHER = 'SPLIT_LEATHER', // Спілок
  SUEDE = 'SUEDE', // Замша
  OTHER = 'OTHER', // Інше
}

/**
 * Типи наповнювачів для предметів
 */
export enum FillerType {
  DOWN = 'DOWN', // Пух
  SINTEPON = 'SINTEPON', // Синтепон
  OTHER = 'OTHER', // Інше
}

/**
 * Ступені зносу предмета
 */
export enum WearDegree {
  WEAR_10 = 'WEAR_10', // 10%
  WEAR_30 = 'WEAR_30', // 30%
  WEAR_50 = 'WEAR_50', // 50%
  WEAR_75 = 'WEAR_75', // 75%
}

/**
 * Базові кольори для швидкого вибору
 */
export enum BaseColor {
  WHITE = 'WHITE', // Білий
  BLACK = 'BLACK', // Чорний
  RED = 'RED', // Червоний
  GREEN = 'GREEN', // Зелений
  BLUE = 'BLUE', // Синій
  YELLOW = 'YELLOW', // Жовтий
  BROWN = 'BROWN', // Коричневий
  GRAY = 'GRAY', // Сірий
  BEIGE = 'BEIGE', // Бежевий
  PURPLE = 'PURPLE', // Фіолетовий
  CUSTOM = 'CUSTOM', // Власний колір
}

/**
 * Схема валідації для форми характеристик предмета
 */

// Створюємо базову схему з усіма полями
const basePropertiesSchema = z.object({
  // Матеріал предмета
  material: z.nativeEnum(MaterialType, {
    errorMap: () => ({ message: 'Виберіть матеріал' }),
  }),
  
  // Колір предмета (базовий або власний)
  colorType: z.nativeEnum(BaseColor, {
    errorMap: () => ({ message: 'Виберіть колір' }),
  }),
  
  // Власний колір (якщо вибрано CUSTOM)
  customColor: z.string().optional(),
  
  // Наповнювач (якщо потрібен для вибраної категорії)
  hasFiller: z.boolean().default(false), // Чи має предмет наповнювач
  fillerType: z.nativeEnum(FillerType).optional(),
  
  // Поле для введення власного типу наповнювача (якщо вибрано OTHER)
  customFiller: z.string().optional(),
  
  // Чи має наповнювач грудочки (релевантно тільки якщо hasFiller=true)
  isFillerLumpy: z.boolean().default(false),
  
  // Ступінь зносу предмета
  wearDegree: z.nativeEnum(WearDegree, {
    errorMap: () => ({ message: 'Виберіть ступінь зносу' }),
  }),
  
  // Будь-які додаткові примітки щодо характеристик предмета
  notes: z.string().optional(),
});

// Застосовуємо умовні перевірки до базової схеми
export const itemPropertiesSchema = basePropertiesSchema.superRefine((data, ctx) => {
  // Перевірка для власного кольору
  if (data.colorType === BaseColor.CUSTOM && (!data.customColor || data.customColor.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Введіть назву кольору',
      path: ['customColor'],
    });
  }

  // Перевірка наявності типу наповнювача, якщо він потрібен
  if (data.hasFiller && !data.fillerType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Виберіть тип наповнювача',
      path: ['fillerType'],
    });
  }

  // Перевірка власного типу наповнювача
  if (data.hasFiller && data.fillerType === FillerType.OTHER && 
      (!data.customFiller || data.customFiller.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Введіть тип наповнювача',
      path: ['customFiller'],
    });
  }
});

/**
 * Тип для форми характеристик предмета
 */
export type ItemPropertiesFormValues = z.infer<typeof itemPropertiesSchema>;

/**
 * Функція для отримання локалізованої назви матеріалу
 */
export function getMaterialLabel(material: MaterialType): string {
  const labels: Record<MaterialType, string> = {
    [MaterialType.COTTON]: 'Бавовна',
    [MaterialType.WOOL]: 'Шерсть',
    [MaterialType.SILK]: 'Шовк',
    [MaterialType.SYNTHETIC]: 'Синтетика',
    [MaterialType.SMOOTH_LEATHER]: 'Гладка шкіра',
    [MaterialType.NUBUCK]: 'Нубук',
    [MaterialType.SPLIT_LEATHER]: 'Спілок',
    [MaterialType.SUEDE]: 'Замша',
    [MaterialType.OTHER]: 'Інше',
  };
  
  return labels[material] || material;
}

/**
 * Функція для отримання локалізованої назви кольору
 */
export function getColorLabel(color: BaseColor): string {
  const labels: Record<BaseColor, string> = {
    [BaseColor.WHITE]: 'Білий',
    [BaseColor.BLACK]: 'Чорний',
    [BaseColor.RED]: 'Червоний',
    [BaseColor.GREEN]: 'Зелений',
    [BaseColor.BLUE]: 'Синій',
    [BaseColor.YELLOW]: 'Жовтий',
    [BaseColor.BROWN]: 'Коричневий',
    [BaseColor.GRAY]: 'Сірий',
    [BaseColor.BEIGE]: 'Бежевий',
    [BaseColor.PURPLE]: 'Фіолетовий',
    [BaseColor.CUSTOM]: 'Інший (вказати)',
  };
  
  return labels[color] || color;
}

/**
 * Функція для отримання локалізованої назви наповнювача
 */
export function getFillerLabel(filler: FillerType): string {
  const labels: Record<FillerType, string> = {
    [FillerType.DOWN]: 'Пух',
    [FillerType.SINTEPON]: 'Синтепон',
    [FillerType.OTHER]: 'Інше (вказати)',
  };
  
  return labels[filler] || filler;
}

/**
 * Функція для отримання локалізованої назви ступеня зносу
 */
export function getWearDegreeLabel(wearDegree: WearDegree): string {
  const labels: Record<WearDegree, string> = {
    [WearDegree.WEAR_10]: '10%',
    [WearDegree.WEAR_30]: '30%',
    [WearDegree.WEAR_50]: '50%',
    [WearDegree.WEAR_75]: '75%',
  };
  
  return labels[wearDegree] || wearDegree;
}
