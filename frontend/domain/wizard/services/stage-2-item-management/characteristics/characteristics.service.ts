import {
  getMaterials,
  getColors,
  getWearDegrees,
  getFillerTypes,
  type WizardMaterial,
  type WizardColor,
  type WizardWearDegree,
  type WizardFillerType,
} from '@/domain/wizard/adapters/pricing';
import {
  itemCharacteristicsSchema,
  materialSelectionSchema,
  colorInputSchema,
  unitTypeEnum,
  wearLevelEnum,
  fillerTypeEnum,
  type ItemCharacteristics,
  type MaterialSelection,
  type ColorInput,
  type UnitType,
  type WearLevel,
  type FillerType,
} from '@/domain/wizard/schemas';

import { BaseWizardService } from '../../base.service';

/**
 * Розширений мінімалістський сервіс для характеристик предмета
 * Розмір: ~140 рядків (в межах ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція pricing адаптерів для матеріалів + кольорів
 * - Валідація через ВСІ централізовані Zod схеми підетапу 2.2
 * - Мінімальна фільтрація за категоріями
 * - Робота з енумами (матеріали, кольори, наповнювачі, знос)
 *
 * НЕ дублює:
 * - API виклики (роль pricing адаптерів)
 * - Мапінг даних (роль адаптерів)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Схеми валідації (роль централізованих schemas)
 */

export class CharacteristicsService extends BaseWizardService {
  protected readonly serviceName = 'CharacteristicsService';

  /**
   * Композиція: отримання матеріалів (з можливістю фільтрації за категорією)
   */
  async getMaterialsByCategory(categoryCode?: string): Promise<WizardMaterial[]> {
    const result = await getMaterials(categoryCode);
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: отримання всіх матеріалів без фільтрації
   */
  async getAllMaterials(): Promise<WizardMaterial[]> {
    const result = await getMaterials();
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: отримання доступних кольорів
   */
  async getAvailableColors(): Promise<WizardColor[]> {
    const result = await getColors();
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: отримання ступенів зносу з адаптера
   */
  async getWearDegreesFromApi(): Promise<WizardWearDegree[]> {
    const result = await getWearDegrees();
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: отримання типів наповнювачів з адаптера
   */
  async getFillerTypesFromApi(): Promise<WizardFillerType[]> {
    const result = await getFillerTypes();
    return result.success ? result.data || [] : [];
  }

  /**
   * Отримання типів наповнювачів через enum (для UI)
   */
  getFillerTypesEnum(): FillerType[] {
    return fillerTypeEnum.options;
  }

  /**
   * Отримання рівнів зносу через enum (для UI)
   */
  getWearLevelsEnum(): WearLevel[] {
    return wearLevelEnum.options;
  }

  /**
   * Валідація типу наповнювача
   */
  validateFillerType(type: string): boolean {
    return fillerTypeEnum.safeParse(type).success;
  }

  /**
   * Валідація рівня зносу
   */
  validateWearLevel(level: string): boolean {
    return wearLevelEnum.safeParse(level).success;
  }

  /**
   * Валідація повних характеристик предмета
   */
  validateCharacteristics(data: unknown) {
    return itemCharacteristicsSchema.safeParse(data);
  }

  /**
   * Валідація вибору матеріалу
   */
  validateMaterialSelection(data: unknown) {
    return materialSelectionSchema.safeParse(data);
  }

  /**
   * Валідація введення кольору
   */
  validateColorInput(data: unknown) {
    return colorInputSchema.safeParse(data);
  }

  /**
   * Перевірка чи підтримує категорія наповнювач
   */
  categorySupportsFillers(categoryCode: string): boolean {
    const fillerCategories = ['outerwear', 'bedding', 'pillows', 'jackets'];
    return fillerCategories.includes(categoryCode.toLowerCase());
  }

  /**
   * Перевірка чи підтримує категорія рівні зносу
   */
  categorySupportWearLevels(categoryCode: string): boolean {
    const wearCategories = ['leather', 'shoes', 'accessories'];
    return wearCategories.includes(categoryCode.toLowerCase());
  }

  /**
   * Перевірка сумісності матеріалу з категорією
   */
  isMaterialCompatible(categoryCode: string, material: string): boolean {
    // Основна логіка сумісності буде в адаптерах або бізнес-правилах
    // Тут тільки базова валідація
    return material.length > 0;
  }

  /**
   * Створення характеристик з валідацією
   */
  createCharacteristicsWithValidation(
    material: string,
    color: string,
    filling?: FillerType,
    customFilling?: string,
    isFillingDamaged?: boolean,
    wearLevel?: WearLevel
  ) {
    const data: ItemCharacteristics = {
      material,
      color,
      filling,
      customFilling,
      isFillingDamaged,
      wearLevel,
    };

    const validation = this.validateCharacteristics(data);
    if (!validation.success) {
      throw new Error(`Валідація характеристик: ${validation.error.errors[0]?.message}`);
    }

    return validation.data;
  }

  /**
   * Створення матеріального вибору з валідацією
   */
  createMaterialSelectionWithValidation(material: string, categoryCode?: string) {
    const data: MaterialSelection = {
      material,
      categoryCode,
    };

    const validation = this.validateMaterialSelection(data);
    if (!validation.success) {
      throw new Error(`Валідація матеріалу: ${validation.error.errors[0]?.message}`);
    }

    return validation.data;
  }

  /**
   * Створення введення кольору з валідацією
   */
  createColorInputWithValidation(color: string, isCustomColor?: boolean) {
    const data: ColorInput = {
      color,
      isCustomColor,
    };

    const validation = this.validateColorInput(data);
    if (!validation.success) {
      throw new Error(`Валідація кольору: ${validation.error.errors[0]?.message}`);
    }

    return validation.data;
  }
}
