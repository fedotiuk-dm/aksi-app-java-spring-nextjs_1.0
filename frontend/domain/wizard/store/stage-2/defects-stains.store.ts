/**
 * @fileoverview Defects & Stains Slice Store - Zustand store для забруднень та дефектів
 * @module domain/wizard/store/stage-2
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Типи плям
 */
export enum StainType {
  GREASE = 'GREASE',
  BLOOD = 'BLOOD',
  PROTEIN = 'PROTEIN',
  WINE = 'WINE',
  COFFEE = 'COFFEE',
  GRASS = 'GRASS',
  INK = 'INK',
  COSMETICS = 'COSMETICS',
  OTHER = 'OTHER',
}

/**
 * Типи дефектів та ризиків
 */
export enum DefectType {
  WEAR_MARKS = 'WEAR_MARKS',
  TORN = 'TORN',
  MISSING_HARDWARE = 'MISSING_HARDWARE',
  DAMAGED_HARDWARE = 'DAMAGED_HARDWARE',
  COLOR_CHANGE_RISK = 'COLOR_CHANGE_RISK',
  DEFORMATION_RISK = 'DEFORMATION_RISK',
  NO_GUARANTEE = 'NO_GUARANTEE',
}

/**
 * Інтерфейс плями
 */
interface StainData {
  type: StainType;
  customDescription?: string;
  location: string;
  severity: 'LIGHT' | 'MEDIUM' | 'HEAVY';
  notes?: string;
}

/**
 * Інтерфейс дефекту
 */
interface DefectData {
  type: DefectType;
  customDescription?: string;
  location?: string;
  severity: 'MINOR' | 'MODERATE' | 'SEVERE';
  notes?: string;
  guaranteeRestrictions?: string[];
}

/**
 * Стан забруднень та дефектів (Підетап 2.3)
 */
interface DefectsStainsState {
  // Stains
  detectedStains: StainData[];
  availableStainTypes: Array<{
    type: StainType;
    name: string;
    description: string;
  }>;
  hasStains: boolean;
  stainsNote: string;

  // Defects
  detectedDefects: DefectData[];
  availableDefectTypes: Array<{
    type: DefectType;
    name: string;
    description: string;
    requiresExplanation: boolean;
  }>;
  hasDefects: boolean;
  defectsNote: string;

  // No guarantee
  hasNoGuarantee: boolean;
  noGuaranteeReason: string;
  noGuaranteeExplanation: string;

  // Risk assessment
  colorChangeRisk: boolean;
  deformationRisk: boolean;
  riskAssessmentNote: string;

  // General notes
  inspectionNotes: string;
  clientAcknowledgment: boolean;

  // Validation
  defectsStainsValidationErrors: Record<string, string[]>;
  isDefectsStainsStepValid: boolean;

  // Loading states
  isStainTypesLoading: boolean;
  isDefectTypesLoading: boolean;
  stainTypesLoadingError: string | null;
}

/**
 * Дії для забруднень та дефектів
 */
interface DefectsStainsActions {
  // Stains management
  setDetectedStains: (stains: StainData[]) => void;
  addStain: (stain: StainData) => void;
  updateStain: (index: number, stain: Partial<StainData>) => void;
  removeStain: (index: number) => void;
  setAvailableStainTypes: (
    types: Array<{ type: StainType; name: string; description: string }>
  ) => void;
  setHasStains: (hasStains: boolean) => void;
  setStainsNote: (note: string) => void;
  loadAvailableStainTypes: () => Promise<void>;

  // Defects management
  setDetectedDefects: (defects: DefectData[]) => void;
  addDefect: (defect: DefectData) => void;
  updateDefect: (index: number, defect: Partial<DefectData>) => void;
  removeDefect: (index: number) => void;
  setAvailableDefectTypes: (
    types: Array<{
      type: DefectType;
      name: string;
      description: string;
      requiresExplanation: boolean;
    }>
  ) => void;
  setHasDefects: (hasDefects: boolean) => void;
  setDefectsNote: (note: string) => void;
  loadAvailableDefectTypes: () => Promise<void>;

  // No guarantee
  setHasNoGuarantee: (hasNoGuarantee: boolean) => void;
  setNoGuaranteeReason: (reason: string) => void;
  setNoGuaranteeExplanation: (explanation: string) => void;

  // Risk assessment
  setColorChangeRisk: (risk: boolean) => void;
  setDeformationRisk: (risk: boolean) => void;
  setRiskAssessmentNote: (note: string) => void;

  // General notes
  setInspectionNotes: (notes: string) => void;
  setClientAcknowledgment: (acknowledged: boolean) => void;

  // Validation
  setDefectsStainsValidationErrors: (field: string, errors: string[]) => void;
  clearDefectsStainsValidationErrors: (field: string) => void;
  validateDefectsStainsStep: () => void;
  setDefectsStainsStepValid: (valid: boolean) => void;

  // Helper methods
  getStainDisplayName: (type: StainType) => string;
  getDefectDisplayName: (type: DefectType) => string;
  getSeverityDisplayName: (severity: string) => string;
  generateRiskSummary: () => string[];

  // Reset actions
  resetDefectsStains: () => void;
}

/**
 * Початковий стан забруднень та дефектів
 */
const initialDefectsStainsState: DefectsStainsState = {
  detectedStains: [],
  availableStainTypes: [],
  hasStains: false,
  stainsNote: '',
  detectedDefects: [],
  availableDefectTypes: [],
  hasDefects: false,
  defectsNote: '',
  hasNoGuarantee: false,
  noGuaranteeReason: '',
  noGuaranteeExplanation: '',
  colorChangeRisk: false,
  deformationRisk: false,
  riskAssessmentNote: '',
  inspectionNotes: '',
  clientAcknowledgment: false,
  defectsStainsValidationErrors: {},
  isDefectsStainsStepValid: true, // Цей етап не є обов'язковим
  isStainTypesLoading: false,
  isDefectTypesLoading: false,
  stainTypesLoadingError: null,
};

/**
 * Defects & Stains Slice Store
 *
 * Відповідальність:
 * - Виявлення та документування плям
 * - Фіксація дефектів та ризиків
 * - Управління гарантійними зобов'язаннями
 * - Оцінка ризиків для предмета
 * - Погодження клієнта з ризиками
 *
 * Інтеграція:
 * - API типів плям та дефектів
 * - Orval типи
 * - Формування документації ризиків
 */
export const useDefectsStainsStore = create<DefectsStainsState & DefectsStainsActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialDefectsStainsState,

      // Stains management
      setDetectedStains: (stains) => {
        set({ detectedStains: stains }, false, 'defectsStains/setDetectedStains');
        get().validateDefectsStainsStep();
      },

      addStain: (stain) => {
        set(
          (state) => ({
            detectedStains: [...state.detectedStains, stain],
            hasStains: true,
          }),
          false,
          'defectsStains/addStain'
        );
        get().validateDefectsStainsStep();
      },

      updateStain: (index, updatedStain) => {
        set(
          (state) => ({
            detectedStains: state.detectedStains.map((stain, i) =>
              i === index ? { ...stain, ...updatedStain } : stain
            ),
          }),
          false,
          'defectsStains/updateStain'
        );
        get().validateDefectsStainsStep();
      },

      removeStain: (index) => {
        set(
          (state) => {
            const newStains = state.detectedStains.filter((_, i) => i !== index);
            return {
              detectedStains: newStains,
              hasStains: newStains.length > 0,
            };
          },
          false,
          'defectsStains/removeStain'
        );
        get().validateDefectsStainsStep();
      },

      setAvailableStainTypes: (types) => {
        set({ availableStainTypes: types }, false, 'defectsStains/setAvailableStainTypes');
      },

      setHasStains: (hasStains) => {
        set({ hasStains }, false, 'defectsStains/setHasStains');

        if (!hasStains) {
          set(
            { detectedStains: [], stainsNote: '' },
            false,
            'defectsStains/setHasStains/clearStains'
          );
        }

        get().validateDefectsStainsStep();
      },

      setStainsNote: (note) => {
        set({ stainsNote: note }, false, 'defectsStains/setStainsNote');
      },

      loadAvailableStainTypes: async () => {
        set(
          { isStainTypesLoading: true, stainTypesLoadingError: null },
          false,
          'defectsStains/loadAvailableStainTypes/start'
        );

        try {
          // API виклик для завантаження типів плям
          // const stainTypes = await getAvailableStainTypes();
          // get().setAvailableStainTypes(stainTypes);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Помилка завантаження типів плям';
          set(
            { stainTypesLoadingError: errorMessage },
            false,
            'defectsStains/loadAvailableStainTypes/error'
          );
        } finally {
          set(
            { isStainTypesLoading: false },
            false,
            'defectsStains/loadAvailableStainTypes/complete'
          );
        }
      },

      // Defects management
      setDetectedDefects: (defects) => {
        set({ detectedDefects: defects }, false, 'defectsStains/setDetectedDefects');
        get().validateDefectsStainsStep();
      },

      addDefect: (defect) => {
        set(
          (state) => ({
            detectedDefects: [...state.detectedDefects, defect],
            hasDefects: true,
          }),
          false,
          'defectsStains/addDefect'
        );

        // Автоматично встановлюємо "без гарантій" для критичних дефектів
        if (defect.type === DefectType.NO_GUARANTEE) {
          get().setHasNoGuarantee(true);
        }

        get().validateDefectsStainsStep();
      },

      updateDefect: (index, updatedDefect) => {
        set(
          (state) => ({
            detectedDefects: state.detectedDefects.map((defect, i) =>
              i === index ? { ...defect, ...updatedDefect } : defect
            ),
          }),
          false,
          'defectsStains/updateDefect'
        );
        get().validateDefectsStainsStep();
      },

      removeDefect: (index) => {
        set(
          (state) => {
            const newDefects = state.detectedDefects.filter((_, i) => i !== index);
            return {
              detectedDefects: newDefects,
              hasDefects: newDefects.length > 0,
            };
          },
          false,
          'defectsStains/removeDefect'
        );
        get().validateDefectsStainsStep();
      },

      setAvailableDefectTypes: (types) => {
        set({ availableDefectTypes: types }, false, 'defectsStains/setAvailableDefectTypes');
      },

      setHasDefects: (hasDefects) => {
        set({ hasDefects }, false, 'defectsStains/setHasDefects');

        if (!hasDefects) {
          set(
            {
              detectedDefects: [],
              defectsNote: '',
              hasNoGuarantee: false,
              noGuaranteeReason: '',
              noGuaranteeExplanation: '',
            },
            false,
            'defectsStains/setHasDefects/clearDefects'
          );
        }

        get().validateDefectsStainsStep();
      },

      setDefectsNote: (note) => {
        set({ defectsNote: note }, false, 'defectsStains/setDefectsNote');
      },

      loadAvailableDefectTypes: async () => {
        set({ isDefectTypesLoading: true }, false, 'defectsStains/loadAvailableDefectTypes/start');

        try {
          // API виклик для завантаження типів дефектів
          // const defectTypes = await getAvailableDefectTypes();
          // get().setAvailableDefectTypes(defectTypes);
        } catch (error) {
          console.error('Failed to load defect types:', error);
        } finally {
          set(
            { isDefectTypesLoading: false },
            false,
            'defectsStains/loadAvailableDefectTypes/complete'
          );
        }
      },

      // No guarantee
      setHasNoGuarantee: (hasNoGuarantee) => {
        set({ hasNoGuarantee }, false, 'defectsStains/setHasNoGuarantee');

        if (!hasNoGuarantee) {
          set(
            {
              noGuaranteeReason: '',
              noGuaranteeExplanation: '',
            },
            false,
            'defectsStains/setHasNoGuarantee/clearReason'
          );
        }

        get().validateDefectsStainsStep();
      },

      setNoGuaranteeReason: (reason) => {
        set({ noGuaranteeReason: reason }, false, 'defectsStains/setNoGuaranteeReason');
        get().validateDefectsStainsStep();
      },

      setNoGuaranteeExplanation: (explanation) => {
        set(
          { noGuaranteeExplanation: explanation },
          false,
          'defectsStains/setNoGuaranteeExplanation'
        );
        get().validateDefectsStainsStep();
      },

      // Risk assessment
      setColorChangeRisk: (risk) => {
        set({ colorChangeRisk: risk }, false, 'defectsStains/setColorChangeRisk');
        get().validateDefectsStainsStep();
      },

      setDeformationRisk: (risk) => {
        set({ deformationRisk: risk }, false, 'defectsStains/setDeformationRisk');
        get().validateDefectsStainsStep();
      },

      setRiskAssessmentNote: (note) => {
        set({ riskAssessmentNote: note }, false, 'defectsStains/setRiskAssessmentNote');
      },

      // General notes
      setInspectionNotes: (notes) => {
        set({ inspectionNotes: notes }, false, 'defectsStains/setInspectionNotes');
      },

      setClientAcknowledgment: (acknowledged) => {
        set({ clientAcknowledgment: acknowledged }, false, 'defectsStains/setClientAcknowledgment');
        get().validateDefectsStainsStep();
      },

      // Validation
      setDefectsStainsValidationErrors: (field, errors) => {
        set(
          (state) => ({
            defectsStainsValidationErrors: {
              ...state.defectsStainsValidationErrors,
              [field]: errors,
            },
          }),
          false,
          'defectsStains/setDefectsStainsValidationErrors'
        );
        get().validateDefectsStainsStep();
      },

      clearDefectsStainsValidationErrors: (field) => {
        set(
          (state) => {
            const { [field]: removed, ...rest } = state.defectsStainsValidationErrors;
            return { defectsStainsValidationErrors: rest };
          },
          false,
          'defectsStains/clearDefectsStainsValidationErrors'
        );
        get().validateDefectsStainsStep();
      },

      validateDefectsStainsStep: () => {
        const state = get();
        const errors: Record<string, string[]> = {};

        // Валідація "без гарантій" - якщо встановлено, потрібне пояснення
        if (state.hasNoGuarantee && !state.noGuaranteeExplanation.trim()) {
          errors.noGuaranteeExplanation = ["Обов'язково вкажіть причину відсутності гарантій"];
        }

        // Валідація плям - якщо є плями, повинна бути хоча б одна додана
        if (state.hasStains && state.detectedStains.length === 0) {
          errors.stains = ['Додайте інформацію про плями'];
        }

        // Валідація дефектів - якщо є дефекти, повинен бути хоча б один доданий
        if (state.hasDefects && state.detectedDefects.length === 0) {
          errors.defects = ['Додайте інформацію про дефекти'];
        }

        // Валідація ризиків - якщо є ризики, клієнт повинен підтвердити
        const hasRisks = state.colorChangeRisk || state.deformationRisk || state.hasNoGuarantee;
        if (hasRisks && !state.clientAcknowledgment) {
          errors.clientAcknowledgment = ['Клієнт повинен підтвердити ознайомлення з ризиками'];
        }

        const hasErrors = Object.keys(errors).length > 0;
        const hasValidationErrors = Object.values(state.defectsStainsValidationErrors).some(
          (fieldErrors) => fieldErrors.length > 0
        );

        set(
          {
            defectsStainsValidationErrors: errors,
            isDefectsStainsStepValid: !hasErrors && !hasValidationErrors,
          },
          false,
          'defectsStains/validateDefectsStainsStep'
        );
      },

      setDefectsStainsStepValid: (valid) => {
        set({ isDefectsStainsStepValid: valid }, false, 'defectsStains/setDefectsStainsStepValid');
      },

      // Helper methods
      getStainDisplayName: (type) => {
        const stainNames: Record<StainType, string> = {
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
        return stainNames[type] || type;
      },

      getDefectDisplayName: (type) => {
        const defectNames: Record<DefectType, string> = {
          [DefectType.WEAR_MARKS]: 'Потертості',
          [DefectType.TORN]: 'Порване',
          [DefectType.MISSING_HARDWARE]: 'Відсутність фурнітури',
          [DefectType.DAMAGED_HARDWARE]: 'Пошкодження фурнітури',
          [DefectType.COLOR_CHANGE_RISK]: 'Ризик зміни кольору',
          [DefectType.DEFORMATION_RISK]: 'Ризик деформації',
          [DefectType.NO_GUARANTEE]: 'Без гарантій',
        };
        return defectNames[type] || type;
      },

      getSeverityDisplayName: (severity) => {
        const severityNames: Record<string, string> = {
          LIGHT: 'Легкий',
          MEDIUM: 'Середній',
          HEAVY: 'Сильний',
          MINOR: 'Незначний',
          MODERATE: 'Помірний',
          SEVERE: 'Серйозний',
        };
        return severityNames[severity] || severity;
      },

      generateRiskSummary: () => {
        const state = get();
        const risks: string[] = [];

        if (state.colorChangeRisk) {
          risks.push('Ризик зміни кольору');
        }

        if (state.deformationRisk) {
          risks.push('Ризик деформації');
        }

        if (state.hasNoGuarantee) {
          risks.push(`Без гарантій: ${state.noGuaranteeReason}`);
        }

        state.detectedDefects.forEach((defect) => {
          if (
            defect.type === DefectType.COLOR_CHANGE_RISK ||
            defect.type === DefectType.DEFORMATION_RISK
          ) {
            risks.push(get().getDefectDisplayName(defect.type));
          }
        });

        return risks;
      },

      // Reset actions
      resetDefectsStains: () => {
        set(initialDefectsStainsState, false, 'defectsStains/resetDefectsStains');
      },
    }),
    {
      name: 'defects-stains-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type DefectsStainsStore = ReturnType<typeof useDefectsStainsStore>;
