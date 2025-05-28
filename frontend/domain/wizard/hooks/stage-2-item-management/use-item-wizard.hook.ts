/**
 * @fileoverview Хук підвізарду предметів - координатор процесу додавання/редагування
 * @module domain/wizard/hooks/stage-2
 */

import { useMemo, useCallback, useState, useEffect } from 'react';

import { useItemWizardNavigation } from './use-item-wizard-navigation.hook';
import { usePricingCalculator } from './use-pricing-calculator.hook';
import { useWizardStore } from '../../store';
import { ItemWizardStep } from '../../types';

import type { WizardOrderItem } from '../../adapters/order';

/**
 * Стан форми підвізарду
 */
interface ItemWizardFormState {
  // Крок 2.1: Основна інформація
  categoryId: string;
  itemName: string;
  quantity: number;
  unit: string;

  // Крок 2.2: Характеристики
  material: string;
  color: string;
  filling?: string;
  wearLevel?: number;

  // Крок 2.3: Дефекти та плями
  stains: string[];
  defects: string[];
  riskFactors: string[];
  defectNotes?: string;

  // Крок 2.4: Ціна та модифікатори
  basePrice: number;
  appliedModifiers: string[];
  finalPrice: number;

  // Крок 2.5: Фото
  photos: string[];
}

/**
 * Початковий стан форми
 */
const initialFormState: ItemWizardFormState = {
  categoryId: '',
  itemName: '',
  quantity: 1,
  unit: 'шт',
  material: '',
  color: '',
  stains: [],
  defects: [],
  riskFactors: [],
  appliedModifiers: [],
  basePrice: 0,
  finalPrice: 0,
  photos: [],
};

/**
 * Режими роботи підвізарду
 */
type WizardMode = 'add' | 'edit';

/**
 * Хук для підвізарду предметів
 * 🧙‍♂️ Координатор: Navigation + PricingCalculator + Form State
 */
export const useItemWizard = () => {
  // 🏪 Zustand - глобальний стан
  const {
    isItemWizardActive,
    currentSubStep,
    completeItemWizard,
    addError,
    addWarning,
    markUnsavedChanges,
  } = useWizardStore();

  // 🧭 Навігація по підвізарду
  const navigation = useItemWizardNavigation();

  // 🧮 Калькулятор цін
  const pricing = usePricingCalculator();

  // 📝 Локальний стан форми
  const [formState, setFormState] = useState<ItemWizardFormState>(initialFormState);
  const [mode, setMode] = useState<WizardMode>('add');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 📝 Методи управління формою
  const updateFormField = useCallback(
    <K extends keyof ItemWizardFormState>(field: K, value: ItemWizardFormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      setHasUnsavedChanges(true);
      markUnsavedChanges();
    },
    [markUnsavedChanges]
  );

  const updateMultipleFields = useCallback(
    (updates: Partial<ItemWizardFormState>) => {
      setFormState((prev) => ({ ...prev, ...updates }));
      setHasUnsavedChanges(true);
      markUnsavedChanges();
    },
    [markUnsavedChanges]
  );

  const resetForm = useCallback(() => {
    setFormState(initialFormState);
    setHasUnsavedChanges(false);
    setEditingItemId(null);
    setMode('add');
  }, []);

  // 🧮 Автоматичний перерахунок ціни при зміні форми
  useEffect(() => {
    if (formState.categoryId && formState.itemName && formState.quantity > 0) {
      const quickPrice = pricing.calculateQuickPrice({
        categoryId: formState.categoryId,
        itemName: formState.itemName,
        quantity: formState.quantity,
        material: formState.material,
        modifiers: formState.appliedModifiers,
      });

      if (quickPrice !== formState.finalPrice) {
        setFormState((prev) => ({ ...prev, finalPrice: quickPrice }));
      }
    }
  }, [
    formState.categoryId,
    formState.itemName,
    formState.quantity,
    formState.material,
    formState.appliedModifiers,
    pricing,
    formState.finalPrice,
  ]);

  // 🧙‍♂️ Методи підвізарду
  const startAddingItem = useCallback(() => {
    resetForm();
    setMode('add');
    navigation.navigateToFirstStep();
  }, [resetForm, navigation]);

  const startEditingItem = useCallback(
    (item: WizardOrderItem) => {
      // Заповнюємо форму даними предмета
      setFormState({
        categoryId: item.categoryId || '',
        itemName: item.itemName || '',
        quantity: item.quantity || 1,
        unit: item.unit || 'шт',
        material: item.material || '',
        color: item.color || '',
        filling: item.filling,
        wearLevel: item.wearLevel,
        stains: item.stains || [],
        defects: item.defects || [],
        riskFactors: item.riskFactors || [],
        defectNotes: item.defectNotes,
        basePrice: item.basePrice || 0,
        appliedModifiers: item.modifiers || [],
        finalPrice: item.finalPrice || 0,
        photos: item.photos || [],
      });

      setEditingItemId(item.id || null);
      setMode('edit');
      setHasUnsavedChanges(false);
      navigation.navigateToFirstStep();
    },
    [navigation]
  );

  const cancelWizard = useCallback(() => {
    if (hasUnsavedChanges) {
      // Тут можна додати підтвердження
      addWarning('Незбережені зміни будуть втрачені');
    }
    resetForm();
    completeItemWizard();
  }, [hasUnsavedChanges, resetForm, completeItemWizard, addWarning]);

  const completeWizard = useCallback(() => {
    // Тут буде логіка збереження предмета
    // Буде викликано в use-item-manager при успішному збереженні
    resetForm();
    completeItemWizard();
  }, [resetForm, completeItemWizard]);

  // ✅ Валідація кроків
  const stepValidation = useMemo(() => {
    return {
      [ItemWizardStep.BASIC_INFO]: {
        isValid: !!(formState.categoryId && formState.itemName && formState.quantity > 0),
        errors: [
          !formState.categoryId && 'Оберіть категорію',
          !formState.itemName && 'Оберіть найменування',
          formState.quantity <= 0 && 'Кількість має бути більше 0',
        ].filter(Boolean) as string[],
      },
      [ItemWizardStep.PROPERTIES]: {
        isValid: !!(formState.material && formState.color),
        errors: [
          !formState.material && 'Оберіть матеріал',
          !formState.color && 'Вкажіть колір',
        ].filter(Boolean) as string[],
      },
      [ItemWizardStep.DEFECTS]: {
        isValid: true, // Опціональний крок
        errors: [],
      },
      [ItemWizardStep.PRICING]: {
        isValid: formState.finalPrice > 0,
        errors: formState.finalPrice <= 0 ? ['Ціна має бути більше 0'] : [],
      },
      [ItemWizardStep.PHOTOS]: {
        isValid: true, // Опціональний крок
        errors: [],
      },
    };
  }, [formState]);

  // 📊 Інформація про стан підвізарду
  const wizardInfo = useMemo(() => {
    const currentStepValidation = currentSubStep ? stepValidation[currentSubStep] : null;
    const canProceedFromCurrentStep = currentStepValidation?.isValid ?? false;
    const allStepsValid = Object.values(stepValidation).every((step) => step.isValid);

    return {
      isActive: isItemWizardActive,
      mode,
      editingItemId,
      hasUnsavedChanges,
      currentStepValidation,
      canProceedFromCurrentStep,
      canCompleteWizard: allStepsValid,
      completionProgress:
        (Object.values(stepValidation).filter((step) => step.isValid).length /
          Object.keys(stepValidation).length) *
        100,
    };
  }, [isItemWizardActive, mode, editingItemId, hasUnsavedChanges, currentSubStep, stepValidation]);

  // 🔄 Конвертація у WizardOrderItem для збереження
  const convertToOrderItem = useCallback((): Partial<WizardOrderItem> => {
    return {
      categoryId: formState.categoryId,
      itemName: formState.itemName,
      quantity: formState.quantity,
      unit: formState.unit,
      material: formState.material,
      color: formState.color,
      filling: formState.filling,
      wearLevel: formState.wearLevel,
      stains: formState.stains,
      defects: formState.defects,
      riskFactors: formState.riskFactors,
      defectNotes: formState.defectNotes,
      basePrice: formState.basePrice,
      modifiers: formState.appliedModifiers,
      finalPrice: formState.finalPrice,
      photos: formState.photos,
    };
  }, [formState]);

  return {
    // 📝 Стан форми
    formState,
    mode,
    editingItemId,

    // 🧭 Навігація
    navigation,

    // 🧮 Ціноутворення
    pricing,

    // 📊 Інформація про стан
    wizardInfo,
    stepValidation,

    // 🧙‍♂️ Методи управління
    startAddingItem,
    startEditingItem,
    cancelWizard,
    completeWizard,

    // 📝 Методи форми
    updateFormField,
    updateMultipleFields,
    resetForm,
    convertToOrderItem,
  };
};
