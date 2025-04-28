import { z } from 'zod';

/**
 * Типи модифікаторів (відповідають типам з бекенду)
 */
export enum PriceModifierType {
  // Загальні модифікатори
  KIDS_ITEMS = 'KIDS_ITEMS',                    // Дитячі речі (до 30 розміру)
  MANUAL_CLEANING = 'MANUAL_CLEANING',          // Ручна чистка
  VERY_DIRTY = 'VERY_DIRTY',                    // Дуже забруднені речі
  URGENT_CLEANING = 'URGENT_CLEANING',          // Термінова чистка

  // Модифікатори для текстилю
  FUR_COLLARS = 'FUR_COLLARS',                  // Чистка виробів з хутряними комірами та манжетами
  WATERPROOF_COATING_TEXTILE = 'WATERPROOF_COATING_TEXTILE', // Нанесення водовідштовхуючого покриття
  SILK_SATIN_CHIFFON = 'SILK_SATIN_CHIFFON',    // Чистка виробів із натурального шовку, атласу, шифону
  COMBINED_LEATHER_TEXTILE = 'COMBINED_LEATHER_TEXTILE', // Чистка комбінованих виробів (шкіра+текстиль)
  LARGE_SOFT_TOYS = 'LARGE_SOFT_TOYS',          // Ручна чистка великих м'яких іграшок
  SEW_BUTTONS_TEXTILE = 'SEW_BUTTONS_TEXTILE',  // Пришивання гудзиків (текстиль)
  BLACK_LIGHT_COLORS = 'BLACK_LIGHT_COLORS',    // Чистка виробів чорного та світлих тонів
  WEDDING_DRESS = 'WEDDING_DRESS',              // Чистка весільної сукні зі шлейфом

  // Модифікатори для шкіри
  LEATHER_IRONING = 'LEATHER_IRONING',          // Прасування шкіряних виробів
  WATERPROOF_COATING_LEATHER = 'WATERPROOF_COATING_LEATHER', // Нанесення водовідштовхуючого покриття
  DYEING_AFTER_OUR_CLEANING = 'DYEING_AFTER_OUR_CLEANING', // Фарбування (після нашої чистки)
  DYEING_AFTER_OTHER_CLEANING = 'DYEING_AFTER_OTHER_CLEANING', // Фарбування (після чистки деінде)
  LEATHER_WITH_INSERTS = 'LEATHER_WITH_INSERTS', // Чистка шкіряних виробів із вставками
  PEARL_COATING = 'PEARL_COATING',              // Нанесення перламутрового покриття
  SHEEPSKIN_ARTIFICIAL_FUR = 'SHEEPSKIN_ARTIFICIAL_FUR', // Чистка натуральних дублянок на штучному хутрі
  SEW_BUTTONS_LEATHER = 'SEW_BUTTONS_LEATHER',  // Пришивання гудзиків (шкіра)
  MANUAL_LEATHER_CLEANING = 'MANUAL_LEATHER_CLEANING', // Ручна чистка виробів зі шкіри
}

/**
 * Категорії модифікаторів
 */
export enum ModifierCategoryType {
  GENERAL = 'GENERAL',  // Загальні модифікатори (для всіх категорій)
  TEXTILE = 'TEXTILE',  // Модифікатори для текстильних виробів
  LEATHER = 'LEATHER',  // Модифікатори для шкіряних виробів
}

/**
 * Інтерфейс для представлення модифікатора ціни
 */
export interface PriceModifier {
  id: string;
  name: string;
  type: string;
  description?: string;
  category: string;
  isPercentage: boolean;
  value: number;
  minValue?: number;
  maxValue?: number;
  isDiscount: boolean;
  selectedValue?: number;
}

/**
 * Інтерфейс для представлення вибраного модифікатора
 */
export interface AppliedModifier {
  modifierId: string;
  selectedValue: number;
}

/**
 * Інтерфейс для результату розрахунку ціни
 */
export interface PriceCalculationResult {
  basePrice: number;
  modifiersImpact: Array<{
    modifierId: string;
    name: string;
    value: number;
    impact: number;
  }>;
  totalPrice: number;
}

/**
 * Схема для валідації форми калькулятора ціни
 */
export const itemPricingSchema = z.object({
  basePrice: z.number().min(0, 'Базова ціна повинна бути додатнім числом'),
  appliedModifiers: z.array(
    z.object({
      modifierId: z.string(),
      selectedValue: z.number(),
    })
  ),
});

/**
 * Тип для значень форми калькулятора ціни
 */
export type ItemPricingFormValues = z.infer<typeof itemPricingSchema>;

/**
 * Отримання локалізованої назви типу модифікатора
 */
export function getModifierTypeDisplayName(type: string): string {
  const displayNames: Record<string, string> = {
    // Загальні модифікатори
    [PriceModifierType.KIDS_ITEMS]: 'Дитячі речі (до 30 розміру)',
    [PriceModifierType.MANUAL_CLEANING]: 'Ручна чистка',
    [PriceModifierType.VERY_DIRTY]: 'Дуже забруднені речі',
    [PriceModifierType.URGENT_CLEANING]: 'Термінова чистка',

    // Модифікатори для текстилю
    [PriceModifierType.FUR_COLLARS]: 'Чистка виробів з хутряними комірами та манжетами',
    [PriceModifierType.WATERPROOF_COATING_TEXTILE]: 'Нанесення водовідштовхуючого покриття',
    [PriceModifierType.SILK_SATIN_CHIFFON]: 'Чистка виробів із натурального шовку, атласу, шифону',
    [PriceModifierType.COMBINED_LEATHER_TEXTILE]: 'Чистка комбінованих виробів (шкіра+текстиль)',
    [PriceModifierType.LARGE_SOFT_TOYS]: 'Ручна чистка великих м\'яких іграшок',
    [PriceModifierType.SEW_BUTTONS_TEXTILE]: 'Пришивання гудзиків',
    [PriceModifierType.BLACK_LIGHT_COLORS]: 'Чистка виробів чорного та світлих тонів',
    [PriceModifierType.WEDDING_DRESS]: 'Чистка весільної сукні зі шлейфом',

    // Модифікатори для шкіри
    [PriceModifierType.LEATHER_IRONING]: 'Прасування шкіряних виробів',
    [PriceModifierType.WATERPROOF_COATING_LEATHER]: 'Нанесення водовідштовхуючого покриття',
    [PriceModifierType.DYEING_AFTER_OUR_CLEANING]: 'Фарбування (після нашої чистки)',
    [PriceModifierType.DYEING_AFTER_OTHER_CLEANING]: 'Фарбування (після чистки деінде)',
    [PriceModifierType.LEATHER_WITH_INSERTS]: 'Чистка шкіряних виробів із вставками',
    [PriceModifierType.PEARL_COATING]: 'Нанесення перламутрового покриття',
    [PriceModifierType.SHEEPSKIN_ARTIFICIAL_FUR]: 'Чистка натуральних дублянок на штучному хутрі',
    [PriceModifierType.SEW_BUTTONS_LEATHER]: 'Пришивання гудзиків',
    [PriceModifierType.MANUAL_LEATHER_CLEANING]: 'Ручна чистка виробів зі шкіри',
  };

  return displayNames[type] || type;
}

/**
 * Перевірка, чи модифікатор застосовний до конкретної категорії
 */
export function isModifierApplicableToCategory(modifierCategory: string, itemCategory?: string): boolean {
  if (modifierCategory === ModifierCategoryType.GENERAL) {
    return true; // Загальні модифікатори доступні для всіх категорій
  }

  if (!itemCategory) {
    return false; // Якщо категорія предмета не визначена, повертаємо false
  }

  // Для текстильних модифікаторів - перевіряємо, чи категорія предмета містить "текстиль"
  if (modifierCategory === ModifierCategoryType.TEXTILE) {
    return itemCategory.toLowerCase().includes('textile');
  }

  // Для шкіряних модифікаторів - перевіряємо, чи категорія предмета містить "шкіра"
  if (modifierCategory === ModifierCategoryType.LEATHER) {
    return itemCategory.toLowerCase().includes('leather');
  }

  return false;
}

/**
 * Функція розрахунку загальної ціни на основі базової ціни та модифікаторів
 * Ця функція використовується лише для попереднього відображення та при помилці API
 */
export function calculateTotalPrice(
  basePrice: number,
  appliedModifiers: AppliedModifier[],
  availableModifiers: PriceModifier[]
): PriceCalculationResult {
  let currentPrice = basePrice;
  const modifiersImpact: Array<{
    modifierId: string;
    name: string;
    value: number;
    impact: number;
  }> = [];

  // Проходимо по всіх застосованих модифікаторах
  appliedModifiers.forEach((applied) => {
    const modifier = availableModifiers.find((m) => m.id === applied.modifierId);
    if (!modifier) return;

    const value = applied.selectedValue;
    let impact = 0;

    // Розрахунок впливу на ціну залежно від типу модифікатора
    if (modifier.isPercentage) {
      // Відсотковий модифікатор
      impact = modifier.isDiscount 
        ? -(basePrice * value / 100) 
        : (basePrice * value / 100);
    } else {
      // Фіксований модифікатор
      impact = modifier.isDiscount ? -value : value;
    }

    // Зберігаємо вплив модифікатора на ціну
    modifiersImpact.push({
      modifierId: modifier.id,
      name: modifier.name,
      value,
      impact,
    });

    // Оновлюємо поточну ціну
    currentPrice += impact;
  });

  return {
    basePrice,
    modifiersImpact,
    totalPrice: Math.max(0, currentPrice), // Ціна не може бути від'ємною
  };
}
