import { z } from 'zod';

import {
  updateOrderItemBody,
  addOrderItemBody,
  safeValidate as orderSafeValidate,
} from '@/shared/api/generated/order/zod';
import {
  getStainTypesQueryParams,
  getStainTypes200Response,
  getDefectTypesQueryParams,
  getDefectTypes200Response,
  getRecommendedModifiersForStainsQueryParams,
  getRecommendedModifiersForStains200Response,
  getRecommendedModifiersForDefectsQueryParams,
  getRecommendedModifiersForDefects200Response,
  getRiskWarningsForItemQueryParams,
  getRiskWarningsForItem200Response,
  safeValidate,
  validateOrThrow,
} from '@/shared/api/generated/pricing/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс для дефектів та плям з orval + zod інтеграцією
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація плям та дефектів через orval Zod схеми
 * - Бізнес-правила для рекомендацій модифікаторів та ризиків
 * - Валідація параметрів запитів та відповідей API
 * - Композиція даних для UI компонентів
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 */

// Використовуємо orval схеми напряму
export type StainTypesResponse = z.infer<typeof getStainTypes200Response>;
export type DefectTypesResponse = z.infer<typeof getDefectTypes200Response>;
export type StainTypesQueryParams = z.infer<typeof getStainTypesQueryParams>;
export type DefectTypesQueryParams = z.infer<typeof getDefectTypesQueryParams>;
export type RecommendedModifiersForStainsParams = z.infer<
  typeof getRecommendedModifiersForStainsQueryParams
>;
export type RecommendedModifiersForDefectsParams = z.infer<
  typeof getRecommendedModifiersForDefectsQueryParams
>;
export type ModifierRecommendation = z.infer<typeof getRecommendedModifiersForStains200Response>[0];
export type RiskWarningsParams = z.infer<typeof getRiskWarningsForItemQueryParams>;
export type RiskWarningsResponse = z.infer<typeof getRiskWarningsForItem200Response>;

// Локальні композитні схеми
const defectsStainsSelectionSchema = z.object({
  stains: z.array(z.string()).optional(),
  defects: z.array(z.string()).optional(),
  defectsNotes: z.string().optional(),
});

const stainSelectionSchema = z.object({
  stains: z.array(z.string()).min(1, 'Оберіть принаймні одну пляму'),
});

const defectSelectionSchema = z.object({
  defects: z.array(z.string()).min(1, 'Оберіть принаймні один дефект'),
  requiresNoWarranty: z.boolean().optional(),
  defectsNotes: z.string().optional(),
});

// Енуми
const riskLevelEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
const priorityEnum = z.enum(['HIGH', 'MEDIUM', 'LOW']);

// Експортуємо типи
export type DefectsStainsSelection = z.infer<typeof defectsStainsSelectionSchema>;
export type StainSelection = z.infer<typeof stainSelectionSchema>;
export type DefectSelection = z.infer<typeof defectSelectionSchema>;
export type RiskLevel = z.infer<typeof riskLevelEnum>;
export type Priority = z.infer<typeof priorityEnum>;

export interface DefectsStainsValidationResult {
  isValid: boolean;
  errors: string[];
  validatedData?: DefectsStainsSelection;
}

export class DefectsStainsService extends BaseWizardService {
  protected readonly serviceName = 'DefectsStainsService';

  /**
   * Валідація параметрів для отримання типів плям
   */
  validateStainTypesParams(params: { activeOnly?: boolean; riskLevel?: RiskLevel }): {
    isValid: boolean;
    errors: string[];
    validatedParams?: any;
  } {
    const validation = safeValidate(getStainTypesQueryParams, params);
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
   * Валідація параметрів для отримання типів дефектів
   */
  validateDefectTypesParams(params: { activeOnly?: boolean; riskLevel?: RiskLevel }): {
    isValid: boolean;
    errors: string[];
    validatedParams?: any;
  } {
    const validation = safeValidate(getDefectTypesQueryParams, params);
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
   * Валідація вибору плям та дефектів
   */
  validateDefectsStainsSelection(data: unknown): DefectsStainsValidationResult {
    const validation = safeValidate(defectsStainsSelectionSchema, data);
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
   * Валідація вибору плям
   */
  validateStainSelection(data: unknown): {
    isValid: boolean;
    errors: string[];
    validatedData?: StainSelection;
  } {
    const validation = safeValidate(stainSelectionSchema, data);
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
   * Валідація вибору дефектів
   */
  validateDefectSelection(data: unknown): {
    isValid: boolean;
    errors: string[];
    validatedData?: DefectSelection;
  } {
    const validation = safeValidate(defectSelectionSchema, data);
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
   * Валідація параметрів для рекомендацій модифікаторів на основі плям
   */
  validateModifiersForStainsParams(params: {
    stains: string[];
    categoryCode?: string;
    materialType?: string;
  }): {
    isValid: boolean;
    errors: string[];
    validatedParams?: RecommendedModifiersForStainsParams;
  } {
    const validation = safeValidate(getRecommendedModifiersForStainsQueryParams, params);
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
   * Валідація параметрів для рекомендацій модифікаторів на основі дефектів
   */
  validateModifiersForDefectsParams(params: {
    defects: string[];
    categoryCode?: string;
    materialType?: string;
  }): {
    isValid: boolean;
    errors: string[];
    validatedParams?: RecommendedModifiersForDefectsParams;
  } {
    const validation = safeValidate(getRecommendedModifiersForDefectsQueryParams, params);
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
   * Валідація параметрів для попереджень про ризики
   */
  validateRiskWarningsParams(params: {
    stains?: string[];
    defects?: string[];
    materialType?: string;
    categoryCode?: string;
  }): {
    isValid: boolean;
    errors: string[];
    validatedParams?: RiskWarningsParams;
  } {
    const validation = safeValidate(getRiskWarningsForItemQueryParams, params);
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
   * Перевірка чи потрібна примітка "Без гарантій"
   */
  requiresNoWarranty(defectCodes: string[]): boolean {
    const criticalDefects = [
      'wear_damage',
      'torn_damage',
      'color_change_risk',
      'deformation_risk',
      'fabric_weakness',
      'permanent_stain',
    ];
    return defectCodes.some((code) => criticalDefects.includes(code));
  }

  /**
   * Фільтрація плям за рівнем ризику
   */
  filterStainsByRiskLevel(stains: StainTypesResponse, riskLevel: RiskLevel): StainTypesResponse {
    return stains.filter((stain) => stain.riskLevel === riskLevel);
  }

  /**
   * Фільтрація дефектів за рівнем ризику
   */
  filterDefectsByRiskLevel(
    defects: DefectTypesResponse,
    riskLevel: RiskLevel
  ): DefectTypesResponse {
    return defects.filter((defect) => defect.riskLevel === riskLevel);
  }

  /**
   * Групування плям за рівнем ризику
   */
  groupStainsByRiskLevel(stains: StainTypesResponse): Record<RiskLevel, StainTypesResponse> {
    return {
      LOW: stains.filter((s) => s.riskLevel === 'LOW'),
      MEDIUM: stains.filter((s) => s.riskLevel === 'MEDIUM'),
      HIGH: stains.filter((s) => s.riskLevel === 'HIGH'),
    };
  }

  /**
   * Групування дефектів за рівнем ризику
   */
  groupDefectsByRiskLevel(defects: DefectTypesResponse): Record<RiskLevel, DefectTypesResponse> {
    return {
      LOW: defects.filter((d) => d.riskLevel === 'LOW'),
      MEDIUM: defects.filter((d) => d.riskLevel === 'MEDIUM'),
      HIGH: defects.filter((d) => d.riskLevel === 'HIGH'),
    };
  }

  /**
   * Сортування модифікаторів за пріоритетом
   */
  sortModifiersByPriority(
    modifiers: z.infer<typeof getRecommendedModifiersForStains200Response>
  ): z.infer<typeof getRecommendedModifiersForStains200Response> {
    const priorityOrder: Record<Priority, number> = {
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
    };

    return [...modifiers].sort((a, b) => {
      const aPriority = priorityOrder[a.priority || 'LOW'];
      const bPriority = priorityOrder[b.priority || 'LOW'];
      return bPriority - aPriority;
    });
  }

  /**
   * Перевірка чи є вибрані плями/дефекти високого ризику
   */
  hasHighRiskSelection(
    stainCodes: string[],
    defectCodes: string[],
    stains: StainTypesResponse,
    defects: DefectTypesResponse
  ): boolean {
    const highRiskStains = stains
      .filter((s) => s.riskLevel === 'HIGH')
      .map((s) => s.code)
      .filter(Boolean);

    const highRiskDefects = defects
      .filter((d) => d.riskLevel === 'HIGH')
      .map((d) => d.code)
      .filter(Boolean);

    return (
      stainCodes.some((code) => highRiskStains.includes(code)) ||
      defectCodes.some((code) => highRiskDefects.includes(code))
    );
  }

  /**
   * Створення об'єкта дефектів та плям для API
   */
  createDefectsStainsData(
    stains: string[],
    defects: string[],
    defectsNotes?: string
  ): DefectsStainsSelection {
    return {
      stains: stains.length > 0 ? stains : undefined,
      defects: defects.length > 0 ? defects : undefined,
      defectsNotes,
    };
  }

  /**
   * Оновлення дефектів та плям існуючого предмета для API
   */
  updateItemDefectsStains(
    currentOrderItem: z.infer<typeof updateOrderItemBody>,
    newDefectsStains: DefectsStainsSelection
  ): {
    isValid: boolean;
    errors: string[];
    orderItemUpdate?: z.infer<typeof updateOrderItemBody>;
  } {
    const updatedItem = {
      ...currentOrderItem,
      stains: newDefectsStains.stains || currentOrderItem.stains,
      defects: newDefectsStains.defects || currentOrderItem.defects,
      defectsNotes: newDefectsStains.defectsNotes || currentOrderItem.defectsNotes,
    };

    const apiValidation = orderSafeValidate(updateOrderItemBody, updatedItem);
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
   * Генерація опису дефектів та плям
   */
  generateDefectsStainsDescription(
    stains: string[],
    defects: string[],
    stainsData: StainTypesResponse,
    defectsData: DefectTypesResponse
  ): string {
    const parts: string[] = [];

    if (stains.length > 0) {
      const stainNames = stains
        .map((code) => stainsData.find((s) => s.code === code)?.name)
        .filter(Boolean);
      if (stainNames.length > 0) {
        parts.push(`Плями: ${stainNames.join(', ')}`);
      }
    }

    if (defects.length > 0) {
      const defectNames = defects
        .map((code) => defectsData.find((d) => d.code === code)?.name)
        .filter(Boolean);
      if (defectNames.length > 0) {
        parts.push(`Дефекти: ${defectNames.join(', ')}`);
      }
    }

    return parts.join('; ') || 'Плями та дефекти не вказані';
  }

  /**
   * Перевірка повноти інформації про дефекти та плями
   */
  isDefectsStainsComplete(selection: DefectsStainsSelection): {
    isComplete: boolean;
    missingFields: string[];
  } {
    const missingFields: string[] = [];

    if (!selection.stains?.length && !selection.defects?.length) {
      missingFields.push('Оберіть плями або дефекти');
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields,
    };
  }
}
