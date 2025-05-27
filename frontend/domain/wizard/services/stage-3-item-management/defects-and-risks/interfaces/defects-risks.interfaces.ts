/**
 * @fileoverview Інтерфейси для дефектів та ризиків
 * @module domain/wizard/services/stage-3-item-management/defects-and-risks/interfaces/defects-risks.interfaces
 */

import {
  DefectsRisksConfig,
  DefectsRisksFilters,
  DefectsRisksLoadingState,
  DefectsRisksOperationResult,
  DefectsRisksValidationResult,
  DefectLocation,
  DefectType,
  ItemDefect,
  ItemDefectsAndRisks,
  ItemRisk,
  ItemStain,
  RiskType,
  StainType,
  UpdateDefectsRisksData
} from '../types';

/**
 * Інтерфейс для завантаження дефектів та ризиків
 */
export interface IDefectsRisksLoader {
  /**
   * Отримати типи плям
   * @param filters Фільтри
   * @returns Обіцянка з результатом операції, що містить типи плям
   */
  getStainTypes(filters?: DefectsRisksFilters): Promise<DefectsRisksOperationResult<StainType[]>>;

  /**
   * Отримати типи дефектів
   * @param filters Фільтри
   * @returns Обіцянка з результатом операції, що містить типи дефектів
   */
  getDefectTypes(filters?: DefectsRisksFilters): Promise<DefectsRisksOperationResult<DefectType[]>>;

  /**
   * Отримати типи ризиків
   * @param filters Фільтри
   * @returns Обіцянка з результатом операції, що містить типи ризиків
   */
  getRiskTypes(filters?: DefectsRisksFilters): Promise<DefectsRisksOperationResult<RiskType[]>>;

  /**
   * Отримати розташування дефектів
   * @param filters Фільтри
   * @returns Обіцянка з результатом операції, що містить розташування дефектів
   */
  getDefectLocations(filters?: DefectsRisksFilters): Promise<DefectsRisksOperationResult<DefectLocation[]>>;

  /**
   * Стан завантаження
   */
  getLoadingState(): DefectsRisksLoadingState;

  /**
   * Очистити кеш
   */
  clearCache(): void;
}

/**
 * Інтерфейс для валідації дефектів та ризиків
 */
export interface IDefectsRisksValidator {
  /**
   * Валідувати пляму
   * @param stain Пляма для валідації
   * @returns Результат валідації
   */
  validateStain(stain: ItemStain): DefectsRisksValidationResult;

  /**
   * Валідувати дефект
   * @param defect Дефект для валідації
   * @returns Результат валідації
   */
  validateDefect(defect: ItemDefect): DefectsRisksValidationResult;

  /**
   * Валідувати ризик
   * @param risk Ризик для валідації
   * @returns Результат валідації
   */
  validateRisk(risk: ItemRisk): DefectsRisksValidationResult;

  /**
   * Валідувати всі дефекти та ризики
   * @param defectsAndRisks Дефекти та ризики для валідації
   * @returns Результат валідації
   */
  validateAll(defectsAndRisks: ItemDefectsAndRisks): DefectsRisksValidationResult;
}

/**
 * Інтерфейс для операцій з дефектами та ризиками
 */
export interface IDefectsRisksOperations {
  /**
   * Отримати дефекти та ризики для предмета
   * @param itemId ID предмета
   * @returns Обіцянка з результатом операції, що містить дефекти та ризики
   */
  getDefectsAndRisks(itemId: string): Promise<DefectsRisksOperationResult<ItemDefectsAndRisks>>;

  /**
   * Оновити дефекти та ризики для предмета
   * @param itemId ID предмета
   * @param data Дані для оновлення
   * @returns Обіцянка з результатом операції
   */
  updateDefectsAndRisks(
    itemId: string,
    data: UpdateDefectsRisksData
  ): Promise<DefectsRisksOperationResult<ItemDefectsAndRisks>>;

  /**
   * Додати пляму до предмета
   * @param itemId ID предмета
   * @param stain Пляма для додавання
   * @returns Обіцянка з результатом операції
   */
  addStain(itemId: string, stain: ItemStain): Promise<DefectsRisksOperationResult<ItemStain>>;

  /**
   * Додати дефект до предмета
   * @param itemId ID предмета
   * @param defect Дефект для додавання
   * @returns Обіцянка з результатом операції
   */
  addDefect(itemId: string, defect: ItemDefect): Promise<DefectsRisksOperationResult<ItemDefect>>;

  /**
   * Додати ризик до предмета
   * @param itemId ID предмета
   * @param risk Ризик для додавання
   * @returns Обіцянка з результатом операції
   */
  addRisk(itemId: string, risk: ItemRisk): Promise<DefectsRisksOperationResult<ItemRisk>>;

  /**
   * Видалити пляму з предмета
   * @param itemId ID предмета
   * @param stainId ID плями
   * @returns Обіцянка з результатом операції
   */
  removeStain(itemId: string, stainId: string): Promise<DefectsRisksOperationResult<void>>;

  /**
   * Видалити дефект з предмета
   * @param itemId ID предмета
   * @param defectId ID дефекту
   * @returns Обіцянка з результатом операції
   */
  removeDefect(itemId: string, defectId: string): Promise<DefectsRisksOperationResult<void>>;

  /**
   * Видалити ризик з предмета
   * @param itemId ID предмета
   * @param riskId ID ризику
   * @returns Обіцянка з результатом операції
   */
  removeRisk(itemId: string, riskId: string): Promise<DefectsRisksOperationResult<void>>;

  /**
   * Оновити примітки щодо дефектів
   * @param itemId ID предмета
   * @param notes Примітки
   * @returns Обіцянка з результатом операції
   */
  updateNotes(itemId: string, notes: string): Promise<DefectsRisksOperationResult<void>>;

  /**
   * Встановити статус "без гарантій"
   * @param itemId ID предмета
   * @param noGuarantees Без гарантій
   * @param reason Причина
   * @returns Обіцянка з результатом операції
   */
  setNoGuarantees(
    itemId: string, 
    noGuarantees: boolean, 
    reason?: string
  ): Promise<DefectsRisksOperationResult<void>>;
}

/**
 * Інтерфейс для менеджера дефектів та ризиків
 */
export interface IDefectsRisksManager {
  /**
   * Отримати завантажувач дефектів та ризиків
   */
  getLoader(): IDefectsRisksLoader;

  /**
   * Отримати валідатор дефектів та ризиків
   */
  getValidator(): IDefectsRisksValidator;

  /**
   * Отримати операції з дефектами та ризиками
   */
  getOperations(): IDefectsRisksOperations;

  /**
   * Отримати конфігурацію
   */
  getConfig(): DefectsRisksConfig;

  /**
   * Оновити конфігурацію
   * @param config Часткова конфігурація для оновлення
   */
  updateConfig(config: Partial<DefectsRisksConfig>): void;
}
