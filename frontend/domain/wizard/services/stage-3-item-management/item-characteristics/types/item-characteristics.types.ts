/**
 * @fileoverview Типи для характеристик предметів
 * @module domain/wizard/services/stage-3-item-management/item-characteristics/types/item-characteristics.types
 */

/**
 * Матеріал предмета
 */
export interface Material {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly categoryIds: string[]; // ID категорій, для яких доступний цей матеріал
  readonly active: boolean;
  readonly sortOrder?: number;
}

/**
 * Колір предмета
 */
export interface Color {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly hexCode?: string; // Колір у форматі #RRGGBB
  readonly isBasic: boolean; // Чи є базовим кольором для швидкого вибору
  readonly sortOrder?: number;
}

/**
 * Тип наповнювача
 */
export interface FillerType {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly categoryIds: string[]; // ID категорій, для яких доступний цей наповнювач
  readonly active: boolean;
  readonly sortOrder?: number;
}

/**
 * Ступінь зносу
 */
export interface WearDegree {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly percentage: number; // Відсоток зносу (10%, 30%, 50%, 75%)
  readonly description?: string;
  readonly sortOrder?: number;
}

/**
 * Характеристики предмета
 */
export interface ItemCharacteristics {
  materialId?: string;
  colorId?: string;
  customColor?: string;
  fillerTypeId?: string;
  isFillerLumpy?: boolean; // Чи збитий наповнювач
  wearDegreeId?: string;
}

/**
 * Результат операції з характеристиками
 */
export interface CharacteristicsOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Конфігурація модуля характеристик
 */
export interface CharacteristicsConfig {
  enableCaching: boolean;
  cacheTimeout: number;
  autoValidation: boolean;
  enableCustomColors: boolean;
}

/**
 * Стан завантаження
 */
export interface CharacteristicsLoadingState {
  materials: boolean;
  colors: boolean;
  fillerTypes: boolean;
  wearDegrees: boolean;
}

/**
 * Результат валідації характеристик
 */
export interface CharacteristicsValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fieldErrors: Record<string, string[]>;
}

/**
 * Фільтри для пошуку характеристик
 */
export interface CharacteristicsFilters {
  categoryId?: string;
  materialCode?: string;
  colorCode?: string;
  fillerTypeCode?: string;
  searchTerm?: string;
  active?: boolean;
}

/**
 * Дані для оновлення характеристик
 */
export interface UpdateCharacteristicsData {
  materialId?: string;
  colorId?: string;
  customColor?: string;
  fillerTypeId?: string;
  isFillerLumpy?: boolean;
  wearDegreeId?: string;
}
