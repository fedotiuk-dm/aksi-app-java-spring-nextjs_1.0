/**
 * @fileoverview Навігаційний хук для домену "Створення клієнта"
 *
 * Відповідальність: тільки логіка навігації між кроками
 * Принцип: Single Responsibility Principle
 */

import { useCallback } from 'react';

import { useClientCreationStore } from './client-creation.store';

/**
 * Хук для навігації між кроками створення клієнта
 * Інкапсулює всю логіку переходів між формами
 */
export const useClientCreationNavigation = () => {
  const { currentStep, setCurrentStep } = useClientCreationStore();

  // Навігація вперед
  const goToNextStep = useCallback(() => {
    if (currentStep === 'basic') {
      setCurrentStep('communication');
    } else if (currentStep === 'communication') {
      setCurrentStep('source');
    }
    // 'source' - це останній крок, далі йде збереження
  }, [currentStep, setCurrentStep]);

  // Навігація назад
  const goToPreviousStep = useCallback(() => {
    if (currentStep === 'source') {
      setCurrentStep('communication');
    } else if (currentStep === 'communication') {
      setCurrentStep('basic');
    }
    // 'basic' - це перший крок, назад не йдемо
  }, [currentStep, setCurrentStep]);

  // Перехід до конкретного кроку
  const goToStep = useCallback(
    (step: 'basic' | 'communication' | 'source') => {
      setCurrentStep(step);
    },
    [setCurrentStep]
  );

  // Перевірки можливості навігації
  const canGoNext = useCallback(() => {
    return currentStep !== 'source';
  }, [currentStep]);

  const canGoPrevious = useCallback(() => {
    return currentStep !== 'basic';
  }, [currentStep]);

  // Інформація про поточний стан
  const isFirstStep = currentStep === 'basic';
  const isLastStep = currentStep === 'source';
  const stepIndex = currentStep === 'basic' ? 0 : currentStep === 'communication' ? 1 : 2;
  const totalSteps = 3;

  return {
    // Поточний стан
    currentStep,
    isFirstStep,
    isLastStep,
    stepIndex,
    totalSteps,

    // Навігаційні дії
    goToNextStep,
    goToPreviousStep,
    goToStep,

    // Перевірки
    canGoNext: canGoNext(),
    canGoPrevious: canGoPrevious(),
  };
};

export type UseClientCreationNavigationReturn = ReturnType<typeof useClientCreationNavigation>;
