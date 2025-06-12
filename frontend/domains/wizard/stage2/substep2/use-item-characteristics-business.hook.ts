/**
 * @fileoverview Бізнес-логіка хук для домену "Характеристики предмета (Substep2)"
 *
 * Відповідальність: координація між API та UI стором
 * Принцип: Single Responsibility Principle
 */

import { useCallback, useMemo, useEffect } from 'react';

import { useItemCharacteristicsStore } from './item-characteristics.store';
import { useItemCharacteristicsAPI } from './use-item-characteristics-api.hook';

/**
 * Хук для бізнес-логіки характеристик предмета
 * Координує взаємодію між API та UI станом
 */
export const useItemCharacteristicsBusiness = () => {
  const {
    // Стан
    sessionId,
    selectedMaterialId,
    selectedColorId,
    customColor,
    selectedFillerId,
    isFillerDamaged,
    wearPercentage,
    isSubstepCompleted,
    error,

    // Дії з стором
    setSessionId,
    setSelectedMaterial,
    setSelectedColor,
    setCustomColor,
    setSelectedFiller,
    setFillerDamaged,
    setWearPercentage,
    setSubstepCompleted,
    setError,
    resetCharacteristics,
  } = useItemCharacteristicsStore();

  // API операції
  const api = useItemCharacteristicsAPI(sessionId);

  // Автоматичне оновлення статусу завершення при зміні стану
  useEffect(() => {
    const isComplete = !!(
      selectedMaterialId &&
      selectedColorId &&
      wearPercentage !== null &&
      wearPercentage >= 0
    );

    setSubstepCompleted(isComplete);
  }, [selectedMaterialId, selectedColorId, wearPercentage, setSubstepCompleted]);

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

  const selectMaterial = useCallback(
    async (materialId: string) => {
      try {
        const result = await api.operations.selectMaterial(materialId);
        setSelectedMaterial(materialId);
        setError(null);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка вибору матеріалу';
        setError(errorMessage);
        throw error;
      }
    },
    [api.operations, setSelectedMaterial, setError]
  );

  const selectColor = useCallback(
    async (colorId: string, customColorValue?: string) => {
      try {
        const result = await api.operations.selectColor(colorId, customColorValue);
        setSelectedColor(colorId);

        if (customColorValue) {
          setCustomColor(customColorValue);
        }

        setError(null);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка вибору кольору';
        setError(errorMessage);
        throw error;
      }
    },
    [api.operations, setSelectedColor, setCustomColor, setError]
  );

  const selectFiller = useCallback(
    async (fillerId: string, isDamaged?: boolean) => {
      try {
        const result = await api.operations.selectFiller(fillerId, isDamaged);
        setSelectedFiller(fillerId);

        if (isDamaged !== undefined) {
          setFillerDamaged(isDamaged);
        }

        setError(null);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка вибору наповнювача';
        setError(errorMessage);
        throw error;
      }
    },
    [api.operations, setSelectedFiller, setFillerDamaged, setError]
  );

  const updateWearPercentage = useCallback(
    async (percentage: number) => {
      try {
        // Валідація діапазону
        if (percentage < 0 || percentage > 100) {
          throw new Error('Ступінь зносу повинен бути від 0 до 100%');
        }

        const result = await api.operations.setWearPercentage(percentage);
        setWearPercentage(percentage);
        setError(null);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Помилка встановлення ступеня зносу';
        setError(errorMessage);
        throw error;
      }
    },
    [api.operations, setWearPercentage, setError]
  );

  const completeSubstep = useCallback(async () => {
    try {
      if (!isSubstepCompleted) {
        throw new Error("Підетап не може бути завершений - заповніть всі обов'язкові поля");
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

  const resetSubstep = useCallback(async () => {
    try {
      const result = await api.operations.resetSubstep();
      resetCharacteristics();
      setError(null);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка скидання підетапу';
      setError(errorMessage);
      throw error;
    }
  }, [api.operations, resetCharacteristics, setError]);

  // UI операції (прості, без API) з useCallback
  const clearMaterial = useCallback(() => {
    setSelectedMaterial(null);
  }, [setSelectedMaterial]);

  const clearColor = useCallback(() => {
    setSelectedColor(null);
    setCustomColor('');
  }, [setSelectedColor, setCustomColor]);

  const clearFiller = useCallback(() => {
    setSelectedFiller(null);
    setFillerDamaged(false);
  }, [setSelectedFiller, setFillerDamaged]);

  const clearWear = useCallback(() => {
    setWearPercentage(null);
  }, [setWearPercentage]);

  const clearAllCharacteristics = useCallback(() => {
    resetCharacteristics();
  }, [resetCharacteristics]);

  const setExternalSessionId = useCallback(
    (newSessionId: string) => {
      setSessionId(newSessionId);
    },
    [setSessionId]
  );

  const updateCustomColor = useCallback(
    (color: string) => {
      setCustomColor(color);
    },
    [setCustomColor]
  );

  const toggleFillerDamage = useCallback(() => {
    setFillerDamaged(!isFillerDamaged);
  }, [isFillerDamaged, setFillerDamaged]);

  // Мемоізовані групи даних
  const data = useMemo(
    () => ({
      ...api.data,
      // Додаткові обчислювані дані
      hasRequiredCharacteristics: !!(selectedMaterialId && selectedColorId),
      hasOptionalCharacteristics: !!(selectedFillerId || wearPercentage !== null),
      completionPercentage: (() => {
        let completed = 0;
        const total = 3; // матеріал, колір, ступінь зносу

        if (selectedMaterialId) completed++;
        if (selectedColorId) completed++;
        if (wearPercentage !== null) completed++;

        return Math.round((completed / total) * 100);
      })(),
      availableWearOptions: [10, 30, 50, 75],
    }),
    [api.data, selectedMaterialId, selectedColorId, selectedFillerId, wearPercentage]
  );

  const loading = useMemo(() => api.loading, [api.loading]);

  const ui = useMemo(
    () => ({
      sessionId,
      selectedMaterialId,
      selectedColorId,
      customColor,
      selectedFillerId,
      isFillerDamaged,
      wearPercentage,
      isSubstepCompleted,
      error,
    }),
    [
      sessionId,
      selectedMaterialId,
      selectedColorId,
      customColor,
      selectedFillerId,
      isFillerDamaged,
      wearPercentage,
      isSubstepCompleted,
      error,
    ]
  );

  return {
    // Основні бізнес-операції
    initializeSubstep,
    selectMaterial,
    selectColor,
    selectFiller,
    updateWearPercentage,
    completeSubstep,
    resetSubstep,

    // UI операції
    clearMaterial,
    clearColor,
    clearFiller,
    clearWear,
    clearAllCharacteristics,
    setExternalSessionId,
    updateCustomColor,
    toggleFillerDamage,

    // API дані
    data,

    // Стани завантаження
    loading,

    // UI стан
    ui,
  };
};

export type UseItemCharacteristicsBusinessReturn = ReturnType<
  typeof useItemCharacteristicsBusiness
>;
