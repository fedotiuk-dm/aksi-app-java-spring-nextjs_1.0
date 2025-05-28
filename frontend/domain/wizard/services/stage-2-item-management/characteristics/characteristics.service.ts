import { z } from 'zod';

import {
  updateOrderItemBody,
  addOrderItemBody,
  getOrderItem200Response,
  safeValidate as orderSafeValidate,
} from '@/shared/api/generated/order/zod';
import {
  getMaterials200Response,
  getMaterialsQueryParams,
  getColors200Response,
  getFillerTypes200Response,
  getWearDegrees200Response,
  safeValidate,
  validateOrThrow,
} from '@/shared/api/generated/pricing/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс для характеристик предметів з orval + zod інтеграцією
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація характеристик предметів через orval Zod схеми
 * - Бізнес-правила для матеріалів, кольорів, наповнювачів
 * - Валідація сумісності характеристик з категоріями
 * - Композиція та валідація повної інформації
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 */

// Використовуємо orval схеми напряму
export type MaterialsResponse = z.infer<typeof getMaterials200Response>;
export type ColorsResponse = z.infer<typeof getColors200Response>;
export type FillerTypesResponse = z.infer<typeof getFillerTypes200Response>;
export type WearDegreesResponse = z.infer<typeof getWearDegrees200Response>;
export type MaterialsQueryParams = z.infer<typeof getMaterialsQueryParams>;

// Локальний тип для оновлення характеристик (не експортуємо OrderItemResponse)
type ItemForCharacteristicsUpdate = {
  material?: string;
  color?: string;
  fillerType?: string;
  fillerCompressed?: boolean;
  wearDegree?: string;
};

// Локальні композитні схеми для характеристик
const itemCharacteristicsSchema = z.object({
  material: z.string().min(1, "Матеріал обов'язковий"),
  color: z.string().min(1, "Колір обов'язковий"),
  fillerType: z.string().optional(),
  fillerCompressed: z.boolean().optional(),
  wearDegree: z.string().optional(),
});

const materialSelectionSchema = z.object({
  material: z.string().min(1, "Матеріал обов'язковий"),
  categoryCode: z.string().optional(),
});

const colorInputSchema = z.object({
  color: z.string().min(1, "Колір обов'язковий"),
  isCustomColor: z.boolean().optional(),
});

const fillerCharacteristicsSchema = z.object({
  fillerType: z.string().min(1, "Тип наповнювача обов'язковий"),
  fillerCompressed: z.boolean().optional(),
});

// Енуми для характеристик
const wearLevelEnum = z.enum(['10%', '30%', '50%', '75%']);
const commonMaterialEnum = z.enum([
  'cotton',
  'wool',
  'silk',
  'synthetic',
  'leather',
  'nubuck',
  'suede',
]);
const commonColorEnum = z.enum([
  'black',
  'white',
  'red',
  'blue',
  'green',
  'yellow',
  'brown',
  'gray',
]);

// Експортуємо типи
export type ItemCharacteristics = z.infer<typeof itemCharacteristicsSchema>;
export type MaterialSelection = z.infer<typeof materialSelectionSchema>;
export type ColorInput = z.infer<typeof colorInputSchema>;
export type FillerCharacteristics = z.infer<typeof fillerCharacteristicsSchema>;
export type WearLevel = z.infer<typeof wearLevelEnum>;
export type CommonMaterial = z.infer<typeof commonMaterialEnum>;
export type CommonColor = z.infer<typeof commonColorEnum>;

export interface CharacteristicsValidationResult {
  isValid: boolean;
  errors: string[];
  validatedData?: ItemCharacteristics;
}

export class CharacteristicsService extends BaseWizardService {
  protected readonly serviceName = 'CharacteristicsService';

  /**
   * Валідація характеристик предмета
   */
  validateItemCharacteristics(data: unknown): {
    isValid: boolean;
    errors: string[];
    validatedData?: ItemCharacteristics;
  } {
    const validation = safeValidate(itemCharacteristicsSchema, data);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: validation.data,
    };
  }

  /**
   * Валідація вибору матеріалу
   */
  validateMaterialSelection(data: unknown): {
    isValid: boolean;
    errors: string[];
    validatedData?: MaterialSelection;
  } {
    const validation = safeValidate(materialSelectionSchema, data);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: validation.data,
    };
  }

  /**
   * Валідація введення кольору
   */
  validateColorInput(data: unknown): {
    isValid: boolean;
    errors: string[];
    validatedData?: ColorInput;
  } {
    const validation = safeValidate(colorInputSchema, data);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: validation.data,
    };
  }

  /**
   * Валідація характеристик наповнювача
   */
  validateFillerCharacteristics(data: unknown): {
    isValid: boolean;
    errors: string[];
    validatedData?: FillerCharacteristics;
  } {
    const validation = safeValidate(fillerCharacteristicsSchema, data);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: validation.data,
    };
  }

  /**
   * Валідація параметрів для отримання матеріалів
   */
  validateMaterialsParams(categoryCode?: string): {
    isValid: boolean;
    errors: string[];
    validatedParams?: MaterialsQueryParams;
  } {
    const params = categoryCode ? { categoryCode } : {};
    const validation = safeValidate(getMaterialsQueryParams, params);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedParams: validation.data,
    };
  }

  /**
   * Отримання доступних рівнів зносу
   */
  getAvailableWearLevels(): WearLevel[] {
    return wearLevelEnum.options;
  }

  /**
   * Валідація рівня зносу
   */
  validateWearLevel(level: string): boolean {
    return wearLevelEnum.safeParse(level).success;
  }

  /**
   * Отримання загальних матеріалів
   */
  getCommonMaterials(): CommonMaterial[] {
    return commonMaterialEnum.options;
  }

  /**
   * Валідація матеріалу
   */
  validateMaterial(material: string): boolean {
    return material.length > 0;
  }

  /**
   * Отримання загальних кольорів
   */
  getCommonColors(): CommonColor[] {
    return commonColorEnum.options;
  }

  /**
   * Валідація кольору
   */
  validateColor(color: string): boolean {
    return color.length > 0;
  }

  /**
   * Перевірка чи підтримує категорія наповнювач
   */
  categorySupportsFillers(categoryCode: string): boolean {
    const fillerCategories = [
      'outerwear',
      'bedding',
      'pillows',
      'jackets',
      'coats',
      'comforters',
      'duvets',
    ];
    return fillerCategories.some((cat) => categoryCode.toLowerCase().includes(cat));
  }

  /**
   * Перевірка чи підтримує категорія рівні зносу
   */
  categorySupportWearLevels(categoryCode: string): boolean {
    const wearCategories = ['leather', 'shoes', 'accessories', 'bags', 'belts', 'suede', 'nubuck'];
    return wearCategories.some((cat) => categoryCode.toLowerCase().includes(cat));
  }

  /**
   * Перевірка сумісності матеріалу з категорією
   */
  isMaterialCompatible(categoryCode: string, material: string): boolean {
    if (!material?.trim()) {
      return false;
    }

    // Спеціальні правила сумісності
    const leatherCategories = ['leather', 'shoes', 'bags'];
    const leatherMaterials = ['leather', 'nubuck', 'suede'];

    if (leatherCategories.some((cat) => categoryCode.toLowerCase().includes(cat))) {
      return leatherMaterials.some((mat) => material.toLowerCase().includes(mat));
    }

    const textileCategories = ['clothing', 'outerwear', 'bedding'];
    const textileMaterials = ['cotton', 'wool', 'silk', 'synthetic'];

    if (textileCategories.some((cat) => categoryCode.toLowerCase().includes(cat))) {
      return textileMaterials.some((mat) => material.toLowerCase().includes(mat));
    }

    // За замовчуванням дозволяємо будь-який матеріал
    return true;
  }

  /**
   * Отримання матеріалу за замовчуванням для категорії
   */
  getDefaultMaterial(categoryCode: string): string {
    const categoryLower = categoryCode.toLowerCase();

    if (categoryLower.includes('leather') || categoryLower.includes('shoes')) {
      return 'leather';
    }

    if (categoryLower.includes('wool') || categoryLower.includes('coat')) {
      return 'wool';
    }

    if (categoryLower.includes('silk') || categoryLower.includes('dress')) {
      return 'silk';
    }

    // За замовчуванням
    return 'cotton';
  }

  /**
   * Створення повних характеристик з валідацією
   */
  createCharacteristics(
    material: string,
    color: string,
    fillerType?: string,
    fillerCompressed?: boolean,
    wearDegree?: string
  ): CharacteristicsValidationResult {
    const characteristics: ItemCharacteristics = {
      material,
      color,
      fillerType,
      fillerCompressed,
      wearDegree,
    };

    const validation = this.validateItemCharacteristics(characteristics);
    if (!validation.isValid || !validation.validatedData) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: validation.validatedData,
    };
  }

  /**
   * Оновлення характеристик існуючого предмета для API
   */
  updateItemCharacteristics(
    currentOrderItem: ItemForCharacteristicsUpdate,
    newCharacteristics: Partial<ItemForCharacteristicsUpdate>
  ): {
    isValid: boolean;
    errors: string[];
    orderItemUpdate?: z.infer<typeof updateOrderItemBody>;
  } {
    // Об'єднуємо існуючі дані з новими характеристиками
    const updatedItem = {
      ...currentOrderItem,
      material: newCharacteristics.material || currentOrderItem.material,
      color: newCharacteristics.color || currentOrderItem.color,
      fillerType: newCharacteristics.fillerType || currentOrderItem.fillerType,
      fillerCompressed: newCharacteristics.fillerCompressed ?? currentOrderItem.fillerCompressed,
      wearDegree: newCharacteristics.wearDegree || currentOrderItem.wearDegree,
    };

    // Валідація через orval схему
    const apiValidation = safeValidate(updateOrderItemBody, updatedItem);
    if (!apiValidation.success) {
      return {
        isValid: false,
        errors: apiValidation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      orderItemUpdate: apiValidation.data,
    };
  }

  /**
   * Перевірка повноти характеристик для категорії
   */
  areCharacteristicsComplete(
    characteristics: ItemCharacteristics,
    categoryCode: string
  ): {
    isComplete: boolean;
    missingFields: string[];
  } {
    const missingFields: string[] = [];

    if (!characteristics.material?.trim()) {
      missingFields.push('Матеріал');
    }

    if (!characteristics.color?.trim()) {
      missingFields.push('Колір');
    }

    // Перевіряємо обов'язкові поля для специфічних категорій
    if (this.categorySupportsFillers(categoryCode) && !characteristics.fillerType) {
      missingFields.push('Тип наповнювача');
    }

    if (this.categorySupportWearLevels(categoryCode) && !characteristics.wearDegree) {
      missingFields.push('Ступінь зносу');
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Генерація опису характеристик для відображення
   */
  generateCharacteristicsDescription(characteristics: ItemCharacteristics): string {
    const parts: string[] = [];

    if (characteristics.material) {
      parts.push(`Матеріал: ${characteristics.material}`);
    }

    if (characteristics.color) {
      parts.push(`Колір: ${characteristics.color}`);
    }

    if (characteristics.fillerType) {
      const fillerDesc = characteristics.fillerCompressed
        ? `${characteristics.fillerType} (збитий)`
        : characteristics.fillerType;
      parts.push(`Наповнювач: ${fillerDesc}`);
    }

    if (characteristics.wearDegree) {
      parts.push(`Знос: ${characteristics.wearDegree}`);
    }

    return parts.join(', ') || 'Характеристики не вказані';
  }
}
