'use client';

import React, { useEffect } from 'react';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';
import { ItemWizardSubStep, WizardStep } from '@/features/order-wizard/model/types';
import {
  BasicInfoSubstep,
  ItemPropertiesSubstep,
  DefectsStainsSubstep,
  PriceCalculatorSubstep,
  PhotoDocumentationSubstep,
} from '.';
import { StepContainer } from '@/features/order-wizard/ui/shared';
import { ItemWizardStepper } from './components';

/**
 * Компонент для 4.0 кроку майстра замовлень - "Додавання або редагування предмета"
 * Відображає різні підетапи в залежності від currentSubStep
 */
export const ItemWizardStep: React.FC = () => {
  // Використовуємо окремі селектори для запобігання небажаних перерендерів
  const currentStep = useOrderWizardStore((state) => state.currentStep);
  const currentSubStep = useOrderWizardStore((state) => state.currentSubStep);
  // Ця змінна використовується зараз лише для логування, ми закоментували перевірку
  // const currentItem = useOrderWizardStore(state => state.currentItem);
  const setCurrentSubStep = useOrderWizardStore((state) => state.setCurrentSubStep);
  // Ця змінна використовується зараз лише для логування, ми закоментували перевірку
  // const navigateToStep = useOrderWizardStore(state => state.navigateToStep);

  // Логуємо стан для відлагодження
  useEffect(() => {
    console.log('ItemWizardStep: currentStep =', currentStep);
    console.log('ItemWizardStep: currentSubStep =', currentSubStep);
  }, [currentStep, currentSubStep]);

  // Встановлюємо перший підетап за замовчуванням, якщо не вибрано жоден
  useEffect(() => {
    if (currentStep === WizardStep.ITEM_WIZARD && !currentSubStep) {
      console.log('Setting default substep to BASIC_INFO');
      setCurrentSubStep(ItemWizardSubStep.BASIC_INFO);
    }
  }, [currentStep, currentSubStep, setCurrentSubStep]);

  // Повернення до Item Manager, якщо предмет не вибрано
  // Це використовуємо для редагування, але при додаванні нового предмета ми не маємо currentItem
  // useEffect(() => {
  //   if (!currentItem) {
  //     navigateToStep(WizardStep.ITEM_MANAGER);
  //   }
  // }, [currentItem, navigateToStep]);

  // Відображення контенту відповідно до поточного підетапу
  const renderSubStepContent = () => {
    // Логуємо, який підетап зараз рендериться
    console.log('Rendering substep content for:', currentSubStep);

    // Приведення типу до ItemWizardSubStep або рядка для безпечного порівняння
    const subStep = currentSubStep as string;

    // Якщо підетап не встановлено або це не string, показуємо перший підетап за замовчуванням
    if (!subStep) {
      console.log('No substep, rendering BasicInfoSubstep');
      return <BasicInfoSubstep />;
    }

    // Перевіряємо чи підетап відповідає BASIC_INFO в будь-якому форматі (рядок або enum)
    if (subStep === ItemWizardSubStep.BASIC_INFO || subStep === 'BASIC_INFO') {
      return <BasicInfoSubstep />;
    }

    // Для інших підетапів
    switch (subStep) {
      case ItemWizardSubStep.ITEM_PROPERTIES:
      case 'ITEM_PROPERTIES':
        return <ItemPropertiesSubstep />;
      case ItemWizardSubStep.DEFECTS_STAINS:
      case 'DEFECTS_STAINS':
        return <DefectsStainsSubstep />;
      case ItemWizardSubStep.PRICE_CALCULATOR:
      case 'PRICE_CALCULATOR':
        return <PriceCalculatorSubstep />;
      case ItemWizardSubStep.PHOTO_DOCUMENTATION:
      case 'PHOTO_DOCUMENTATION':
        return <PhotoDocumentationSubstep />;
      default:
        console.log('Unknown substep, rendering BasicInfoSubstep as default');
        return <BasicInfoSubstep />;
    }
  };

  return (
    <StepContainer title="Додавання предмета" subtitle="Введіть інформацію про новий предмет">
      {/* Відображення степера з прогресом візарда */}
      <ItemWizardStepper />
      {renderSubStepContent()}
    </StepContainer>
  );
};
