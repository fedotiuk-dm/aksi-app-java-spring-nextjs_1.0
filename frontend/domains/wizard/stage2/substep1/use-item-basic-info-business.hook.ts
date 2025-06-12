/**
 * @fileoverview Бізнес-логіка хук для домену "Основна інформація про предмет (Substep1)"
 *
 * Відповідальність: координація між API та UI стором
 * Принцип: Single Responsibility Principle
 */

import { useCallback, useMemo, useEffect } from 'react';

import { useItemBasicInfoStore } from './item-basic-info.store';
import { useItemBasicInfoAPI } from './use-item-basic-info-api.hook';

/**
 * Хук для бізнес-логіки основної інформації про предмет
 * Координує взаємодію між API та UI станом
 */
export const useItemBasicInfoBusiness = () => {
  const {
    // Стан
    sessionId,
    currentStep,
    selectedCategoryId,
    selectedItemId,
    quantity,
    unit,
    stepProgress,
    isStepComplete,
    error,

    // Дії з стором
    setSessionId,
    setCurrentStep,
    setSelectedCategory,
    setSelectedItem,
    setQuantity,
    setUnit,
    setStepProgress,
    setStepComplete,
    setError,
    nextStep,
    previousStep,
    resetStep,
  } = useItemBasicInfoStore();

  // API операції
  const api = useItemBasicInfoAPI(sessionId);

  // Автоматичне оновлення прогресу при зміні стану
  useEffect(() => {
    let progress = 0;

    if (selectedCategoryId) progress += 33;
    if (selectedItemId) progress += 33;
    if (quantity > 0 && unit) progress += 34;

    setStepProgress(progress);
    setStepComplete(progress === 100);
  }, [selectedCategoryId, selectedItemId, quantity, unit, setStepProgress, setStepComplete]);

  // Координаційні бізнес-операції з useCallback
  const selectCategory = useCallback(
    async (categoryId: string) => {
      try {
        const result = await api.operations.selectCategory(categoryId);
        setSelectedCategory(categoryId);

        // Автоматично переходимо до наступного кроку
        if (currentStep === 'category') {
          nextStep();
        }

        setError(null);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка вибору категорії';
        setError(errorMessage);
        throw error;
      }
    },
    [api.operations, setSelectedCategory, currentStep, nextStep, setError]
  );

  const selectItem = useCallback(
    async (itemId: string) => {
      try {
        const result = await api.operations.selectItem(itemId);
        setSelectedItem(itemId);

        // Автоматично переходимо до наступного кроку
        if (currentStep === 'item') {
          nextStep();
        }

        setError(null);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка вибору предмета';
        setError(errorMessage);
        throw error;
      }
    },
    [api.operations, setSelectedItem, currentStep, nextStep, setError]
  );

  const updateQuantity = useCallback(
    async (newQuantity: number, newUnit: string) => {
      try {
        const result = await api.operations.setQuantity(newQuantity, newUnit);
        setQuantity(newQuantity);
        setUnit(newUnit);
        setError(null);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Помилка встановлення кількості';
        setError(errorMessage);
        throw error;
      }
    },
    [api.operations, setQuantity, setUnit, setError]
  );

  const completeStep = useCallback(async () => {
    try {
      if (!isStepComplete) {
        throw new Error("Крок не може бути завершений - заповніть всі обов'язкові поля");
      }

      const result = await api.operations.completeStep();
      setStepComplete(true);
      setError(null);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка завершення кроку';
      setError(errorMessage);
      throw error;
    }
  }, [api.operations, isStepComplete, setStepComplete, setError]);

  const resetCurrentStep = useCallback(async () => {
    try {
      const result = await api.operations.resetStep();
      resetStep();
      setError(null);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка скидання кроку';
      setError(errorMessage);
      throw error;
    }
  }, [api.operations, resetStep, setError]);

  // UI операції (прості, без API) з useCallback
  const goToNextStep = useCallback(() => {
    nextStep();
  }, [nextStep]);

  const goToPreviousStep = useCallback(() => {
    previousStep();
  }, [previousStep]);

  const changeCurrentStep = useCallback(
    (step: 'category' | 'item' | 'quantity') => {
      setCurrentStep(step);
    },
    [setCurrentStep]
  );

  const clearSelection = useCallback(() => {
    setSelectedCategory(null);
    setSelectedItem(null);
    setQuantity(0);
    setUnit('');
    setCurrentStep('category');
  }, [setSelectedCategory, setSelectedItem, setQuantity, setUnit, setCurrentStep]);

  const setExternalSessionId = useCallback(
    (newSessionId: string) => {
      setSessionId(newSessionId);
    },
    [setSessionId]
  );

  // Мемоізовані групи даних
  const data = useMemo(
    () => ({
      ...api.data,
      // Додаткові обчислювані дані
      canProceedToNext:
        currentStep === 'category'
          ? !!selectedCategoryId
          : currentStep === 'item'
            ? !!selectedItemId
            : !!(quantity > 0 && unit),
      canGoBack: currentStep !== 'category',
      availableUnits: currentStep === 'quantity' ? ['шт', 'кг', 'м', 'м²'] : [],
    }),
    [api.data, currentStep, selectedCategoryId, selectedItemId, quantity, unit]
  );

  const loading = useMemo(() => api.loading, [api.loading]);

  const ui = useMemo(
    () => ({
      sessionId,
      currentStep,
      selectedCategoryId,
      selectedItemId,
      quantity,
      unit,
      stepProgress,
      isStepComplete,
      error,
    }),
    [
      sessionId,
      currentStep,
      selectedCategoryId,
      selectedItemId,
      quantity,
      unit,
      stepProgress,
      isStepComplete,
      error,
    ]
  );

  return {
    // Основні бізнес-операції
    selectCategory,
    selectItem,
    updateQuantity,
    completeStep,
    resetCurrentStep,

    // UI операції
    goToNextStep,
    goToPreviousStep,
    changeCurrentStep,
    clearSelection,
    setExternalSessionId,

    // API дані
    data,

    // Стани завантаження
    loading,

    // UI стан
    ui,
  };
};

export type UseItemBasicInfoBusinessReturn = ReturnType<typeof useItemBasicInfoBusiness>;
