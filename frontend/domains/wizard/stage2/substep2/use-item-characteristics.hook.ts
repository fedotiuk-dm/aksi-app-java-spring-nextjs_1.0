/**
 * @fileoverview Композиційний хук для домену "Характеристики предмета (Substep2)"
 *
 * Об'єднує всі розділені хуки в єдиний інтерфейс
 * за принципом "Golden Rule" архітектури та SOLID принципами
 */

import { useMemo } from 'react';

import { useItemCharacteristicsBusiness } from './use-item-characteristics-business.hook';
import { useItemCharacteristicsForms } from './use-item-characteristics-forms.hook';

/**
 * Головний композиційний хук домену "Характеристики предмета"
 *
 * Принципи:
 * - Single Responsibility: кожен підхук має одну відповідальність
 * - Open/Closed: легко розширювати без модифікації існуючого коду
 * - Dependency Inversion: залежність від абстракцій (хуків), а не конкретних реалізацій
 */
export const useItemCharacteristics = () => {
  // 1. Бізнес-логіка (API + стор координація)
  const business = useItemCharacteristicsBusiness();

  // 2. Форми та валідація
  const forms = useItemCharacteristicsForms();

  // 3. Мемоізовані групи для оптимізації
  const data = useMemo(() => business.data, [business.data]);
  const loading = useMemo(() => business.loading, [business.loading]);
  const ui = useMemo(() => business.ui, [business.ui]);

  const actions = useMemo(
    () => ({
      // Основні бізнес-операції
      initializeSubstep: business.initializeSubstep,
      selectMaterial: business.selectMaterial,
      selectColor: business.selectColor,
      selectFiller: business.selectFiller,
      updateWearPercentage: business.updateWearPercentage,
      completeSubstep: business.completeSubstep,
      resetSubstep: business.resetSubstep,

      // UI операції
      clearMaterial: business.clearMaterial,
      clearColor: business.clearColor,
      clearFiller: business.clearFiller,
      clearWear: business.clearWear,
      clearAllCharacteristics: business.clearAllCharacteristics,
      setExternalSessionId: business.setExternalSessionId,
      updateCustomColor: business.updateCustomColor,
      toggleFillerDamage: business.toggleFillerDamage,
    }),
    [
      business.initializeSubstep,
      business.selectMaterial,
      business.selectColor,
      business.selectFiller,
      business.updateWearPercentage,
      business.completeSubstep,
      business.resetSubstep,
      business.clearMaterial,
      business.clearColor,
      business.clearFiller,
      business.clearWear,
      business.clearAllCharacteristics,
      business.setExternalSessionId,
      business.updateCustomColor,
      business.toggleFillerDamage,
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

export type UseItemCharacteristicsReturn = ReturnType<typeof useItemCharacteristics>;
