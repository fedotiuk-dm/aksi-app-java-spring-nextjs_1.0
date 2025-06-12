/**
 * @fileoverview Zustand стор для UI стану домену "Дефекти та плями (Substep3)"
 *
 * Відповідальність: тільки UI стан, НЕ API дані
 * Принцип: Single Responsibility Principle
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

/**
 * Інтерфейс UI стану для дефектів та плям
 */
interface DefectsStainsUIState {
  // Основний стан
  sessionId: string | null;
  selectedStains: string[];
  customStain: string;
  selectedDefects: string[];
  customDefect: string;
  notes: string;
  hasNoGuarantee: boolean;
  noGuaranteeReason: string;

  // Ризики
  hasColorChangeRisk: boolean;
  hasDeformationRisk: boolean;
  hasDamageRisk: boolean;
  riskNotes: string;

  // UI стан
  isSubstepCompleted: boolean;
  error: string | null;

  // Режими відображення
  showAdvancedOptions: boolean;
  showRiskAssessment: boolean;
  showCustomStainInput: boolean;
  showCustomDefectInput: boolean;
}

/**
 * Інтерфейс дій для UI стану
 */
interface DefectsStainsUIActions {
  // Основні дії
  setSessionId: (sessionId: string | null) => void;
  setSelectedStains: (stains: string[]) => void;
  addStain: (stain: string) => void;
  removeStain: (stain: string) => void;
  setCustomStain: (stain: string) => void;

  setSelectedDefects: (defects: string[]) => void;
  addDefect: (defect: string) => void;
  removeDefect: (defect: string) => void;
  setCustomDefect: (defect: string) => void;

  setNotes: (notes: string) => void;
  setHasNoGuarantee: (hasNoGuarantee: boolean) => void;
  setNoGuaranteeReason: (reason: string) => void;

  // Ризики
  setColorChangeRisk: (hasRisk: boolean) => void;
  setDeformationRisk: (hasRisk: boolean) => void;
  setDamageRisk: (hasRisk: boolean) => void;
  setRiskNotes: (notes: string) => void;

  // Стан підетапу
  setSubstepCompleted: (completed: boolean) => void;
  setError: (error: string | null) => void;

  // UI режими
  setShowAdvancedOptions: (show: boolean) => void;
  setShowRiskAssessment: (show: boolean) => void;
  setShowCustomStainInput: (show: boolean) => void;
  setShowCustomDefectInput: (show: boolean) => void;

  // Утиліти
  resetDefectsStains: () => void;
  clearStains: () => void;
  clearDefects: () => void;
  clearRisks: () => void;
}

/**
 * Початковий стан
 */
const initialState: DefectsStainsUIState = {
  // Основний стан
  sessionId: null,
  selectedStains: [],
  customStain: '',
  selectedDefects: [],
  customDefect: '',
  notes: '',
  hasNoGuarantee: false,
  noGuaranteeReason: '',

  // Ризики
  hasColorChangeRisk: false,
  hasDeformationRisk: false,
  hasDamageRisk: false,
  riskNotes: '',

  // UI стан
  isSubstepCompleted: false,
  error: null,

  // Режими відображення
  showAdvancedOptions: false,
  showRiskAssessment: false,
  showCustomStainInput: false,
  showCustomDefectInput: false,
};

/**
 * Zustand стор з subscribeWithSelector middleware
 */
export const useDefectsStainsStore = create<DefectsStainsUIState & DefectsStainsUIActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Основні дії
    setSessionId: (sessionId) => set({ sessionId }),

    setSelectedStains: (stains) => set({ selectedStains: stains }),
    addStain: (stain) => {
      const { selectedStains } = get();
      if (!selectedStains.includes(stain)) {
        set({ selectedStains: [...selectedStains, stain] });
      }
    },
    removeStain: (stain) => {
      const { selectedStains } = get();
      set({ selectedStains: selectedStains.filter((s) => s !== stain) });
    },
    setCustomStain: (stain) => set({ customStain: stain }),

    setSelectedDefects: (defects) => set({ selectedDefects: defects }),
    addDefect: (defect) => {
      const { selectedDefects } = get();
      if (!selectedDefects.includes(defect)) {
        set({ selectedDefects: [...selectedDefects, defect] });
      }
    },
    removeDefect: (defect) => {
      const { selectedDefects } = get();
      set({ selectedDefects: selectedDefects.filter((d) => d !== defect) });
    },
    setCustomDefect: (defect) => set({ customDefect: defect }),

    setNotes: (notes) => set({ notes }),
    setHasNoGuarantee: (hasNoGuarantee) => set({ hasNoGuarantee }),
    setNoGuaranteeReason: (reason) => set({ noGuaranteeReason: reason }),

    // Ризики
    setColorChangeRisk: (hasRisk) => set({ hasColorChangeRisk: hasRisk }),
    setDeformationRisk: (hasRisk) => set({ hasDeformationRisk: hasRisk }),
    setDamageRisk: (hasRisk) => set({ hasDamageRisk: hasRisk }),
    setRiskNotes: (notes) => set({ riskNotes: notes }),

    // Стан підетапу
    setSubstepCompleted: (completed) => set({ isSubstepCompleted: completed }),
    setError: (error) => set({ error }),

    // UI режими
    setShowAdvancedOptions: (show) => set({ showAdvancedOptions: show }),
    setShowRiskAssessment: (show) => set({ showRiskAssessment: show }),
    setShowCustomStainInput: (show) => set({ showCustomStainInput: show }),
    setShowCustomDefectInput: (show) => set({ showCustomDefectInput: show }),

    // Утиліти
    resetDefectsStains: () => set(initialState),
    clearStains: () =>
      set({
        selectedStains: [],
        customStain: '',
        showCustomStainInput: false,
      }),
    clearDefects: () =>
      set({
        selectedDefects: [],
        customDefect: '',
        showCustomDefectInput: false,
      }),
    clearRisks: () =>
      set({
        hasColorChangeRisk: false,
        hasDeformationRisk: false,
        hasDamageRisk: false,
        riskNotes: '',
      }),
  }))
);
