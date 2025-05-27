/**
 * @fileoverview Типи для дефектів та ризиків
 * @module domain/wizard/services/stage-3-item-management/defects-and-risks/types/defects-risks.types
 */

/**
 * Тип плями
 */
export interface StainType {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly active: boolean;
  readonly sortOrder?: number;
}

/**
 * Тип дефекту
 */
export interface DefectType {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly active: boolean;
  readonly sortOrder?: number;
}

/**
 * Тип ризику
 */
export interface RiskType {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly active: boolean;
  readonly sortOrder?: number;
}

/**
 * Розташування дефекту
 */
export interface DefectLocation {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly active: boolean;
  readonly sortOrder?: number;
}

/**
 * Пляма предмета
 */
export interface ItemStain {
  readonly id?: string;
  readonly stainTypeId: string;
  readonly description?: string;
  readonly customStainDescription?: string; // Для типу "Інше"
}

/**
 * Дефект предмета
 */
export interface ItemDefect {
  readonly id?: string;
  readonly defectTypeId: string;
  readonly locationId?: string;
  readonly description?: string;
}

/**
 * Ризик предмета
 */
export interface ItemRisk {
  readonly id?: string;
  readonly riskTypeId: string;
  readonly description?: string;
}

/**
 * Дефекти та ризики предмета
 */
export interface ItemDefectsAndRisks {
  readonly stains: ItemStain[];
  readonly defects: ItemDefect[];
  readonly risks: ItemRisk[];
  readonly notes?: string; // Примітки щодо дефектів
  readonly noGuarantees?: boolean; // Без гарантій
  readonly noGuaranteesReason?: string; // Причина відсутності гарантій
}

/**
 * Результат операції з дефектами та ризиками
 */
export interface DefectsRisksOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Конфігурація модуля дефектів та ризиків
 */
export interface DefectsRisksConfig {
  enableCaching: boolean;
  cacheTimeout: number;
  autoValidation: boolean;
  enableCustomStains: boolean;
}

/**
 * Стан завантаження
 */
export interface DefectsRisksLoadingState {
  stainTypes: boolean;
  defectTypes: boolean;
  riskTypes: boolean;
  defectLocations: boolean;
}

/**
 * Результат валідації дефектів та ризиків
 */
export interface DefectsRisksValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fieldErrors: Record<string, string[]>;
}

/**
 * Фільтри для пошуку дефектів та ризиків
 */
export interface DefectsRisksFilters {
  categoryId?: string;
  materialId?: string;
  searchTerm?: string;
  active?: boolean;
}

/**
 * Дані для оновлення дефектів та ризиків
 */
export interface UpdateDefectsRisksData {
  stains?: ItemStain[];
  defects?: ItemDefect[];
  risks?: ItemRisk[];
  notes?: string;
  noGuarantees?: boolean;
  noGuaranteesReason?: string;
}
