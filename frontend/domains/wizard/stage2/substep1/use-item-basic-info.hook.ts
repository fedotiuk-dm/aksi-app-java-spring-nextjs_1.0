/**
 * @fileoverview Композиційний хук для домену "Основна інформація про предмет (Substep1)"
 *
 * Об'єднує всі розділені хуки в єдиний інтерфейс
 * за принципом "Golden Rule" архітектури та SOLID принципами
 */

import { useMemo } from 'react';

import { useItemBasicInfoBusiness } from './use-item-basic-info-business.hook';
import { useItemBasicInfoForms } from './use-item-basic-info-forms.hook';

/**
 * Головний композиційний хук домену "Основна інформація про предмет"
 *
 * Принципи:
 * - Single Responsibility: кожен підхук має одну відповідальність
 * - Open/Closed: легко розширювати без модифікації існуючого коду
 * - Dependency Inversion: залежність від абстракцій (хуків), а не конкретних реалізацій
 */
export const useItemBasicInfo = () => {
  // 1. Бізнес-логіка (API + стор координація)
  const business = useItemBasicInfoBusiness();

  // 2. Форми та валідація
  const forms = useItemBasicInfoForms();

  // 3. Мемоізовані групи для оптимізації
  const data = useMemo(() => business.data, [business.data]);
  const loading = useMemo(() => business.loading, [business.loading]);
  const ui = useMemo(() => business.ui, [business.ui]);

  const actions = useMemo(
    () => ({
      // Основні бізнес-операції
      selectCategory: business.selectCategory,
      selectItem: business.selectItem,
      updateQuantity: business.updateQuantity,
      completeStep: business.completeStep,
      resetCurrentStep: business.resetCurrentStep,

      // UI операції
      goToNextStep: business.goToNextStep,
      goToPreviousStep: business.goToPreviousStep,
      changeCurrentStep: business.changeCurrentStep,
      clearSelection: business.clearSelection,
      setExternalSessionId: business.setExternalSessionId,
    }),
    [
      business.selectCategory,
      business.selectItem,
      business.updateQuantity,
      business.completeStep,
      business.resetCurrentStep,
      business.goToNextStep,
      business.goToPreviousStep,
      business.changeCurrentStep,
      business.clearSelection,
      business.setExternalSessionId,
    ]
  );

  return {
    // Групи даних
    data,
    loading,
    ui,
    actions,
    forms,
  };
};

export type UseItemBasicInfoReturn = ReturnType<typeof useItemBasicInfo>;
