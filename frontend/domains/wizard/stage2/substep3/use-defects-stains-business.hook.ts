/**
 * @fileoverview Бізнес-логіка хук для домену "Дефекти та плями (Substep3)"
 *
 * Відповідальність: координація між API та UI стором
 * Принцип: Single Responsibility Principle
 */

import { useCallback, useMemo, useEffect } from 'react';

import { useDefectsStainsStore } from './defects-stains.store';
import { useDefectsStainsAPI } from './use-defects-stains-api.hook';

/**
 * Хук для бізнес-логіки дефектів та плям
 * Координує взаємодію між API та UI станом
 */
export const useDefectsStainsBusiness = () => {
  const {
    // Стан
    sessionId,
    selectedStains,
    customStain,
    selectedDefects,
    customDefect,
    notes,
    hasNoGuarantee,
    noGuaranteeReason,
    hasColorChangeRisk,
    hasDeformationRisk,
    hasDamageRisk,
    riskNotes,
    isSubstepCompleted,
    error,
    showAdvancedOptions,
    showRiskAssessment,
    showCustomStainInput,
    showCustomDefectInput,

    // Дії з стором
    setSessionId,
    setSelectedStains,
    addStain,
    removeStain,
    setCustomStain,
    setSelectedDefects,
    addDefect,
    removeDefect,
    setCustomDefect,
    setNotes,
    setHasNoGuarantee,
    setNoGuaranteeReason,
    setColorChangeRisk,
    setDeformationRisk,
    setDamageRisk,
    setRiskNotes,
    setSubstepCompleted,
    setError,
    setShowAdvancedOptions,
    setShowRiskAssessment,
    setShowCustomStainInput,
    setShowCustomDefectInput,
    resetDefectsStains,
    clearStains,
    clearDefects,
    clearRisks,
  } = useDefectsStainsStore();

  // API операції
  const api = useDefectsStainsAPI(sessionId);

  // Автоматичне оновлення статусу завершення при зміні стану
  useEffect(() => {
    const isComplete = !!(selectedStains.length > 0 || selectedDefects.length > 0 || notes.trim());

    setSubstepCompleted(isComplete);
  }, [selectedStains.length, selectedDefects.length, notes, setSubstepCompleted]);

  // Координаційні бізнес-операції з useCallback
  const initializeSubstep = useCallback(async () => {
    try {
      const result = await api.operations.initializeSubstep();
      setError(null);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Помилка ініціалізації підетапу';
      setError(errorMessage);
      throw error;
    }
  }, [api.operations, setError]);

  const processStainSelection = useCallback(
    async (stains: string[], customStainValue?: string) => {
      try {
        const result = await api.operations.processStainSelection(stains, customStainValue);
        setSelectedStains(stains);

        if (customStainValue) {
          setCustomStain(customStainValue);
        }

        setError(null);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка обробки вибору плям';
        setError(errorMessage);
        throw error;
      }
    },
    [api.operations, setSelectedStains, setCustomStain, setError]
  );

  const processDefectSelection = useCallback(
    async (defects: string[], customDefectValue?: string) => {
      try {
        const result = await api.operations.processDefectSelection(defects, customDefectValue);
        setSelectedDefects(defects);

        if (customDefectValue) {
          setCustomDefect(customDefectValue);
        }

        setError(null);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Помилка обробки вибору дефектів';
        setError(errorMessage);
        throw error;
      }
    },
    [api.operations, setSelectedDefects, setCustomDefect, setError]
  );

  const processDefectNotes = useCallback(
    async (notesValue: string, hasNoGuaranteeValue?: boolean, noGuaranteeReasonValue?: string) => {
      try {
        const result = await api.operations.processDefectNotes(
          notesValue,
          hasNoGuaranteeValue,
          noGuaranteeReasonValue
        );

        setNotes(notesValue);

        if (hasNoGuaranteeValue !== undefined) {
          setHasNoGuarantee(hasNoGuaranteeValue);
        }

        if (noGuaranteeReasonValue) {
          setNoGuaranteeReason(noGuaranteeReasonValue);
        }

        setError(null);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка збереження приміток';
        setError(errorMessage);
        throw error;
      }
    },
    [api.operations, setNotes, setHasNoGuarantee, setNoGuaranteeReason, setError]
  );

  const completeSubstep = useCallback(async () => {
    try {
      if (!isSubstepCompleted) {
        throw new Error('Підетап не може бути завершений - додайте плями, дефекти або примітки');
      }

      const result = await api.operations.completeSubstep();
      setSubstepCompleted(true);
      setError(null);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка завершення підетапу';
      setError(errorMessage);
      throw error;
    }
  }, [api.operations, isSubstepCompleted, setSubstepCompleted, setError]);

  const goBack = useCallback(async () => {
    try {
      const result = await api.operations.goBack();
      setError(null);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка повернення назад';
      setError(errorMessage);
      throw error;
    }
  }, [api.operations, setError]);

  const resetSubstep = useCallback(async () => {
    try {
      const result = await api.operations.resetSubstep();
      resetDefectsStains();
      setError(null);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка скидання підетапу';
      setError(errorMessage);
      throw error;
    }
  }, [api.operations, resetDefectsStains, setError]);

  // UI операції (прості, без API) з useCallback
  const addStainToSelection = useCallback(
    (stain: string) => {
      addStain(stain);
    },
    [addStain]
  );

  const removeStainFromSelection = useCallback(
    (stain: string) => {
      removeStain(stain);
    },
    [removeStain]
  );

  const addDefectToSelection = useCallback(
    (defect: string) => {
      addDefect(defect);
    },
    [addDefect]
  );

  const removeDefectFromSelection = useCallback(
    (defect: string) => {
      removeDefect(defect);
    },
    [removeDefect]
  );

  const updateNotes = useCallback(
    (notesValue: string) => {
      setNotes(notesValue);
    },
    [setNotes]
  );

  const updateCustomStain = useCallback(
    (stain: string) => {
      setCustomStain(stain);
    },
    [setCustomStain]
  );

  const updateCustomDefect = useCallback(
    (defect: string) => {
      setCustomDefect(defect);
    },
    [setCustomDefect]
  );

  const toggleNoGuarantee = useCallback(() => {
    setHasNoGuarantee(!hasNoGuarantee);
    if (hasNoGuarantee) {
      setNoGuaranteeReason('');
    }
  }, [hasNoGuarantee, setHasNoGuarantee, setNoGuaranteeReason]);

  const updateNoGuaranteeReason = useCallback(
    (reason: string) => {
      setNoGuaranteeReason(reason);
    },
    [setNoGuaranteeReason]
  );

  const toggleAdvancedOptions = useCallback(() => {
    setShowAdvancedOptions(!showAdvancedOptions);
  }, [showAdvancedOptions, setShowAdvancedOptions]);

  const toggleRiskAssessment = useCallback(() => {
    setShowRiskAssessment(!showRiskAssessment);
  }, [showRiskAssessment, setShowRiskAssessment]);

  const toggleCustomStainInput = useCallback(() => {
    setShowCustomStainInput(!showCustomStainInput);
    if (showCustomStainInput) {
      setCustomStain('');
    }
  }, [showCustomStainInput, setShowCustomStainInput, setCustomStain]);

  const toggleCustomDefectInput = useCallback(() => {
    setShowCustomDefectInput(!showCustomDefectInput);
    if (showCustomDefectInput) {
      setCustomDefect('');
    }
  }, [showCustomDefectInput, setShowCustomDefectInput, setCustomDefect]);

  const setExternalSessionId = useCallback(
    (newSessionId: string) => {
      setSessionId(newSessionId);
    },
    [setSessionId]
  );

  const clearAllStains = useCallback(() => {
    clearStains();
  }, [clearStains]);

  const clearAllDefects = useCallback(() => {
    clearDefects();
  }, [clearDefects]);

  const clearAllRisks = useCallback(() => {
    clearRisks();
  }, [clearRisks]);

  const clearAllData = useCallback(() => {
    resetDefectsStains();
  }, [resetDefectsStains]);

  // Мемоізовані групи даних
  const data = useMemo(
    () => ({
      ...api.data,
      // Додаткові обчислювані дані
      hasStains: selectedStains.length > 0,
      hasDefects: selectedDefects.length > 0,
      hasNotes: notes.trim().length > 0,
      hasAnyData:
        selectedStains.length > 0 || selectedDefects.length > 0 || notes.trim().length > 0,
      hasRisks: hasColorChangeRisk || hasDeformationRisk || hasDamageRisk,
      completionPercentage: (() => {
        let completed = 0;
        const total = 3; // плями, дефекти, примітки

        if (selectedStains.length > 0) completed++;
        if (selectedDefects.length > 0) completed++;
        if (notes.trim().length > 0) completed++;

        return Math.round((completed / total) * 100);
      })(),
      totalStainsSelected: selectedStains.length,
      totalDefectsSelected: selectedDefects.length,
    }),
    [
      api.data,
      selectedStains.length,
      selectedDefects.length,
      notes,
      hasColorChangeRisk,
      hasDeformationRisk,
      hasDamageRisk,
    ]
  );

  const loading = useMemo(() => api.loading, [api.loading]);

  const ui = useMemo(
    () => ({
      sessionId,
      selectedStains,
      customStain,
      selectedDefects,
      customDefect,
      notes,
      hasNoGuarantee,
      noGuaranteeReason,
      hasColorChangeRisk,
      hasDeformationRisk,
      hasDamageRisk,
      riskNotes,
      isSubstepCompleted,
      error,
      showAdvancedOptions,
      showRiskAssessment,
      showCustomStainInput,
      showCustomDefectInput,
    }),
    [
      sessionId,
      selectedStains,
      customStain,
      selectedDefects,
      customDefect,
      notes,
      hasNoGuarantee,
      noGuaranteeReason,
      hasColorChangeRisk,
      hasDeformationRisk,
      hasDamageRisk,
      riskNotes,
      isSubstepCompleted,
      error,
      showAdvancedOptions,
      showRiskAssessment,
      showCustomStainInput,
      showCustomDefectInput,
    ]
  );

  return {
    // Основні бізнес-операції
    initializeSubstep,
    processStainSelection,
    processDefectSelection,
    processDefectNotes,
    completeSubstep,
    goBack,
    resetSubstep,

    // UI операції
    addStainToSelection,
    removeStainFromSelection,
    addDefectToSelection,
    removeDefectFromSelection,
    updateNotes,
    updateCustomStain,
    updateCustomDefect,
    toggleNoGuarantee,
    updateNoGuaranteeReason,
    toggleAdvancedOptions,
    toggleRiskAssessment,
    toggleCustomStainInput,
    toggleCustomDefectInput,
    setExternalSessionId,
    clearAllStains,
    clearAllDefects,
    clearAllRisks,
    clearAllData,

    // API дані
    data,

    // Стани завантаження
    loading,

    // UI стан
    ui,
  };
};

export type UseDefectsStainsBusinessReturn = ReturnType<typeof useDefectsStainsBusiness>;
