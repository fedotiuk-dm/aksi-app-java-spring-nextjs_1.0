/**
 * @fileoverview Композиційний хук для домену "Дефекти та плями (Substep3)"
 *
 * Об'єднує всі розділені хуки в єдиний інтерфейс
 * за принципом "Golden Rule" архітектури та SOLID принципами
 */

import { useMemo } from 'react';

import { useDefectsStainsBusiness } from './use-defects-stains-business.hook';
import { useDefectsStainsForms } from './use-defects-stains-forms.hook';

/**
 * Головний композиційний хук домену "Дефекти та плями"
 *
 * Принципи:
 * - Single Responsibility: кожен підхук має одну відповідальність
 * - Open/Closed: легко розширювати без модифікації існуючого коду
 * - Dependency Inversion: залежність від абстракцій (хуків), а не конкретних реалізацій
 */
export const useDefectsStains = () => {
  // 1. Бізнес-логіка (координація API + стор)
  const business = useDefectsStainsBusiness();

  // 2. Форми та валідація
  const forms = useDefectsStainsForms();

  // 3. Мемоізований результат для оптимізації
  return useMemo(
    () => ({
      // UI стан (з business хука)
      ui: business.ui,

      // API дані (з business хука)
      data: business.data,

      // Стани завантаження (з business хука)
      loading: business.loading,

      // Основні бізнес-операції
      actions: {
        // API операції
        initializeSubstep: business.initializeSubstep,
        processStainSelection: business.processStainSelection,
        processDefectSelection: business.processDefectSelection,
        processDefectNotes: business.processDefectNotes,
        completeSubstep: business.completeSubstep,
        goBack: business.goBack,
        resetSubstep: business.resetSubstep,

        // UI операції
        addStainToSelection: business.addStainToSelection,
        removeStainFromSelection: business.removeStainFromSelection,
        addDefectToSelection: business.addDefectToSelection,
        removeDefectFromSelection: business.removeDefectFromSelection,
        updateNotes: business.updateNotes,
        updateCustomStain: business.updateCustomStain,
        updateCustomDefect: business.updateCustomDefect,
        toggleNoGuarantee: business.toggleNoGuarantee,
        updateNoGuaranteeReason: business.updateNoGuaranteeReason,
        toggleAdvancedOptions: business.toggleAdvancedOptions,
        toggleRiskAssessment: business.toggleRiskAssessment,
        toggleCustomStainInput: business.toggleCustomStainInput,
        toggleCustomDefectInput: business.toggleCustomDefectInput,
        setExternalSessionId: business.setExternalSessionId,
        clearAllStains: business.clearAllStains,
        clearAllDefects: business.clearAllDefects,
        clearAllRisks: business.clearAllRisks,
        clearAllData: business.clearAllData,
      },

      // Форми (з forms хука)
      forms: {
        stains: forms.stains,
        defects: forms.defects,
        notes: forms.notes,
        main: forms.main,
        risks: forms.risks,
      },
    }),
    [business, forms]
  );
};

export type UseDefectsStainsReturn = ReturnType<typeof useDefectsStains>;
