/**
 * @fileoverview Інтерфейси для сервісів характеристик предметів
 * @module domain/wizard/services/stage-3-item-management/item-characteristics/interfaces/item-characteristics.interfaces
 */

import type {
  Material,
  Color,
  FillerType,
  WearDegree,
  CharacteristicsOperationResult,
  CharacteristicsFilters,
  CharacteristicsValidationResult,
  UpdateCharacteristicsData,
  ItemCharacteristics
} from '../types/item-characteristics.types';
import type { OrderItem } from '@/domain/wizard/types';

/**
 * Інтерфейс для сервісу завантаження характеристик предметів
 */
export interface ICharacteristicsLoaderService {
  /**
   * Отримання списку матеріалів
   * @param categoryId Опційний ідентифікатор категорії для фільтрації
   */
  loadMaterials(categoryId?: string): Promise<CharacteristicsOperationResult<Material[]>>;

  /**
   * Отримання списку кольорів
   */
  loadColors(): Promise<CharacteristicsOperationResult<Color[]>>;

  /**
   * Отримання списку типів наповнювачів
   * @param categoryId Опційний ідентифікатор категорії для фільтрації
   */
  loadFillerTypes(categoryId?: string): Promise<CharacteristicsOperationResult<FillerType[]>>;

  /**
   * Отримання списку ступенів зносу
   */
  loadWearDegrees(): Promise<CharacteristicsOperationResult<WearDegree[]>>;

  /**
   * Отримання всіх характеристик для категорії
   * @param categoryId Ідентифікатор категорії
   */
  loadAllCharacteristicsForCategory(categoryId: string): Promise<CharacteristicsOperationResult<{
    materials: Material[];
    colors: Color[];
    fillerTypes: FillerType[];
    wearDegrees: WearDegree[];
  }>>;

  /**
   * Пошук характеристик за фільтрами
   * @param filters Фільтри для пошуку
   */
  searchCharacteristics(filters: CharacteristicsFilters): Promise<CharacteristicsOperationResult<{
    materials?: Material[];
    colors?: Color[];
    fillerTypes?: FillerType[];
    wearDegrees?: WearDegree[];
  }>>;
}

/**
 * Інтерфейс для сервісу валідації характеристик предметів
 */
export interface ICharacteristicsValidatorService {
  /**
   * Валідація даних характеристик
   * @param characteristics Характеристики для валідації
   * @param categoryId Ідентифікатор категорії
   */
  validateCharacteristics(
    characteristics: ItemCharacteristics,
    categoryId: string
  ): Promise<CharacteristicsValidationResult>;

  /**
   * Перевірка доступності матеріалу для категорії
   * @param materialId Ідентифікатор матеріалу
   * @param categoryId Ідентифікатор категорії
   */
  isMaterialValidForCategory(
    materialId: string,
    categoryId: string
  ): Promise<CharacteristicsOperationResult<boolean>>;

  /**
   * Перевірка доступності типу наповнювача для категорії
   * @param fillerTypeId Ідентифікатор типу наповнювача
   * @param categoryId Ідентифікатор категорії
   */
  isFillerTypeValidForCategory(
    fillerTypeId: string,
    categoryId: string
  ): Promise<CharacteristicsOperationResult<boolean>>;

  /**
   * Перевірка валідності ступеня зносу
   * @param wearDegreeId Ідентифікатор ступеня зносу
   */
  isWearDegreeValid(
    wearDegreeId: string
  ): Promise<CharacteristicsOperationResult<boolean>>;
}

/**
 * Інтерфейс для сервісу операцій з характеристиками предметів
 */
export interface ICharacteristicsOperationsService {
  /**
   * Отримання характеристик предмета
   * @param itemId Ідентифікатор предмета
   */
  getItemCharacteristics(
    itemId: string
  ): Promise<CharacteristicsOperationResult<ItemCharacteristics>>;

  /**
   * Оновлення характеристик предмета
   * @param itemId Ідентифікатор предмета
   * @param data Дані для оновлення
   */
  updateItemCharacteristics(
    itemId: string,
    data: UpdateCharacteristicsData
  ): Promise<CharacteristicsOperationResult<OrderItem>>;
}

/**
 * Інтерфейс для головного сервісу характеристик предметів
 */
export interface ICharacteristicsManagerService {
  /**
   * Налаштування модуля характеристик
   * @param config Часткова конфігурація
   */
  configure(config: Partial<import('../types/item-characteristics.types').CharacteristicsConfig>): void;

  /**
   * Отримання матеріалів для категорії
   * @param categoryId Ідентифікатор категорії
   * @param forceRefresh Примусове оновлення кешу
   */
  getMaterialsForCategory(
    categoryId: string,
    forceRefresh?: boolean
  ): Promise<CharacteristicsOperationResult<Material[]>>;

  /**
   * Отримання всіх кольорів
   * @param forceRefresh Примусове оновлення кешу
   */
  getAllColors(
    forceRefresh?: boolean
  ): Promise<CharacteristicsOperationResult<Color[]>>;

  /**
   * Отримання базових кольорів для швидкого вибору
   */
  getBasicColors(): Promise<CharacteristicsOperationResult<Color[]>>;

  /**
   * Отримання типів наповнювачів для категорії
   * @param categoryId Ідентифікатор категорії
   * @param forceRefresh Примусове оновлення кешу
   */
  getFillerTypesForCategory(
    categoryId: string,
    forceRefresh?: boolean
  ): Promise<CharacteristicsOperationResult<FillerType[]>>;

  /**
   * Отримання всіх ступенів зносу
   * @param forceRefresh Примусове оновлення кешу
   */
  getAllWearDegrees(
    forceRefresh?: boolean
  ): Promise<CharacteristicsOperationResult<WearDegree[]>>;

  /**
   * Отримання характеристик предмета
   * @param itemId Ідентифікатор предмета
   */
  getItemCharacteristics(
    itemId: string
  ): Promise<CharacteristicsOperationResult<ItemCharacteristics>>;

  /**
   * Оновлення характеристик предмета
   * @param itemId Ідентифікатор предмета
   * @param data Дані для оновлення
   * @param skipValidation Пропуск валідації
   */
  updateItemCharacteristics(
    itemId: string,
    data: UpdateCharacteristicsData,
    skipValidation?: boolean
  ): Promise<CharacteristicsOperationResult<OrderItem>>;
}
