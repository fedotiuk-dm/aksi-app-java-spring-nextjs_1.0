/**
 * @fileoverview Хук для управління формами Substep4 Price Calculation
 *
 * Відповідальність: React Hook Form + Zod валідація
 * Принцип: Single Responsibility Principle
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

import {
  basePriceCalculationSchema,
  modifierSelectionSchema,
  priceCalculationFormSchema,
  discountApplicationSchema,
  urgencyModifierSchema,
  priceBreakdownSchema,
  quickModifierSelectionSchema,
  priceValidationSchema,
  type BasePriceCalculationFormData,
  type ModifierSelectionFormData,
  type PriceCalculationFormData,
  type DiscountApplicationFormData,
  type UrgencyModifierFormData,
  type PriceBreakdownFormData,
  type QuickModifierSelectionFormData,
  type PriceValidationFormData,
} from './price-calculation.schemas';

/**
 * Інтерфейс для форм Substep4
 */
export interface UsePriceCalculationFormsReturn {
  // Форми
  forms: {
    basePriceCalculation: UseFormReturn<BasePriceCalculationFormData>;
    modifierSelection: UseFormReturn<ModifierSelectionFormData>;
    priceCalculationForm: UseFormReturn<PriceCalculationFormData>;
    discountApplication: UseFormReturn<DiscountApplicationFormData>;
    urgencyModifier: UseFormReturn<UrgencyModifierFormData>;
    priceBreakdown: UseFormReturn<PriceBreakdownFormData>;
    quickModifierSelection: UseFormReturn<QuickModifierSelectionFormData>;
    priceValidation: UseFormReturn<PriceValidationFormData>;
  };

  // Стани форм
  formStates: {
    isAnyFormDirty: boolean;
    isAnyFormSubmitting: boolean;
    hasAnyFormErrors: boolean;
    allFormErrors: Record<string, any>;
  };

  // Утиліти
  resetAllForms: () => void;
  validateAllForms: () => Promise<boolean>;
  getFormData: () => {
    basePriceCalculation: BasePriceCalculationFormData;
    modifierSelection: ModifierSelectionFormData;
    priceCalculationForm: PriceCalculationFormData;
    discountApplication: DiscountApplicationFormData;
    urgencyModifier: UrgencyModifierFormData;
    priceBreakdown: PriceBreakdownFormData;
    quickModifierSelection: QuickModifierSelectionFormData;
    priceValidation: PriceValidationFormData;
  };
}

/**
 * Хук для управління формами Substep4 Price Calculation
 */
export const usePriceCalculationForms = (): UsePriceCalculationFormsReturn => {
  // Ініціалізація форм
  const basePriceCalculationForm = useForm<BasePriceCalculationFormData>({
    resolver: zodResolver(basePriceCalculationSchema),
    defaultValues: {
      categoryCode: '',
      itemName: '',
      quantity: 1,
      color: '',
      basePrice: 0,
    },
    mode: 'onChange',
  });

  const modifierSelectionForm = useForm<ModifierSelectionFormData>({
    resolver: zodResolver(modifierSelectionSchema),
    defaultValues: {
      selectedModifierIds: [],
      rangeModifierValues: [],
      fixedModifierQuantities: [],
    },
    mode: 'onChange',
  });

  const priceCalculationFormForm = useForm<PriceCalculationFormData>({
    resolver: zodResolver(priceCalculationFormSchema),
    defaultValues: {
      categoryCode: '',
      itemName: '',
      color: '',
      quantity: 1,
      modifierCodes: [],
      modifierIds: [],
      rangeModifierValues: [],
      fixedModifierQuantities: [],
      expedited: false,
      expeditePercent: 0,
      discountPercent: 0,
    },
    mode: 'onChange',
  });

  const discountApplicationForm = useForm<DiscountApplicationFormData>({
    resolver: zodResolver(discountApplicationSchema),
    defaultValues: {
      discountType: 'NONE',
      discountPercentage: 0,
      discountDescription: '',
    },
    mode: 'onChange',
  });

  const urgencyModifierForm = useForm<UrgencyModifierFormData>({
    resolver: zodResolver(urgencyModifierSchema),
    defaultValues: {
      isUrgent: false,
      urgencyPercentage: 0,
      urgencyType: 'NORMAL',
    },
    mode: 'onChange',
  });

  const priceBreakdownForm = useForm<PriceBreakdownFormData>({
    resolver: zodResolver(priceBreakdownSchema),
    defaultValues: {
      basePrice: 0,
      modifiersTotal: 0,
      discountAmount: 0,
      urgencyAmount: 0,
      finalPrice: 0,
      calculationDetails: [],
    },
    mode: 'onChange',
  });

  const quickModifierSelectionForm = useForm<QuickModifierSelectionFormData>({
    resolver: zodResolver(quickModifierSelectionSchema),
    defaultValues: {
      quickModifiers: [],
    },
    mode: 'onChange',
  });

  const priceValidationForm = useForm<PriceValidationFormData>({
    resolver: zodResolver(priceValidationSchema),
    defaultValues: {
      isValid: false,
      validationErrors: [],
      validationWarnings: [],
    },
    mode: 'onChange',
  });

  // Обчислені стани форм
  const formStates = useMemo(() => {
    const forms = [
      basePriceCalculationForm,
      modifierSelectionForm,
      priceCalculationFormForm,
      discountApplicationForm,
      urgencyModifierForm,
      priceBreakdownForm,
      quickModifierSelectionForm,
      priceValidationForm,
    ];

    const isAnyFormDirty = forms.some((form) => form.formState.isDirty);
    const isAnyFormSubmitting = forms.some((form) => form.formState.isSubmitting);
    const hasAnyFormErrors = forms.some((form) => Object.keys(form.formState.errors).length > 0);

    const allFormErrors = forms.reduce(
      (acc, form, index) => {
        const formNames = [
          'basePriceCalculation',
          'modifierSelection',
          'priceCalculationForm',
          'discountApplication',
          'urgencyModifier',
          'priceBreakdown',
          'quickModifierSelection',
          'priceValidation',
        ];

        if (Object.keys(form.formState.errors).length > 0) {
          acc[formNames[index]] = form.formState.errors;
        }

        return acc;
      },
      {} as Record<string, any>
    );

    return {
      isAnyFormDirty,
      isAnyFormSubmitting,
      hasAnyFormErrors,
      allFormErrors,
    };
  }, [
    basePriceCalculationForm.formState,
    modifierSelectionForm.formState,
    priceCalculationFormForm.formState,
    discountApplicationForm.formState,
    urgencyModifierForm.formState,
    priceBreakdownForm.formState,
    quickModifierSelectionForm.formState,
    priceValidationForm.formState,
  ]);

  // Утиліти
  const resetAllForms = useCallback(() => {
    basePriceCalculationForm.reset();
    modifierSelectionForm.reset();
    priceCalculationFormForm.reset();
    discountApplicationForm.reset();
    urgencyModifierForm.reset();
    priceBreakdownForm.reset();
    quickModifierSelectionForm.reset();
    priceValidationForm.reset();
  }, [
    basePriceCalculationForm,
    modifierSelectionForm,
    priceCalculationFormForm,
    discountApplicationForm,
    urgencyModifierForm,
    priceBreakdownForm,
    quickModifierSelectionForm,
    priceValidationForm,
  ]);

  const validateAllForms = useCallback(async (): Promise<boolean> => {
    const validationResults = await Promise.all([
      basePriceCalculationForm.trigger(),
      modifierSelectionForm.trigger(),
      priceCalculationFormForm.trigger(),
      discountApplicationForm.trigger(),
      urgencyModifierForm.trigger(),
      priceBreakdownForm.trigger(),
      quickModifierSelectionForm.trigger(),
      priceValidationForm.trigger(),
    ]);

    return validationResults.every((result) => result);
  }, [
    basePriceCalculationForm,
    modifierSelectionForm,
    priceCalculationFormForm,
    discountApplicationForm,
    urgencyModifierForm,
    priceBreakdownForm,
    quickModifierSelectionForm,
    priceValidationForm,
  ]);

  const getFormData = useCallback(
    () => ({
      basePriceCalculation: basePriceCalculationForm.getValues(),
      modifierSelection: modifierSelectionForm.getValues(),
      priceCalculationForm: priceCalculationFormForm.getValues(),
      discountApplication: discountApplicationForm.getValues(),
      urgencyModifier: urgencyModifierForm.getValues(),
      priceBreakdown: priceBreakdownForm.getValues(),
      quickModifierSelection: quickModifierSelectionForm.getValues(),
      priceValidation: priceValidationForm.getValues(),
    }),
    [
      basePriceCalculationForm,
      modifierSelectionForm,
      priceCalculationFormForm,
      discountApplicationForm,
      urgencyModifierForm,
      priceBreakdownForm,
      quickModifierSelectionForm,
      priceValidationForm,
    ]
  );

  return {
    forms: {
      basePriceCalculation: basePriceCalculationForm,
      modifierSelection: modifierSelectionForm,
      priceCalculationForm: priceCalculationFormForm,
      discountApplication: discountApplicationForm,
      urgencyModifier: urgencyModifierForm,
      priceBreakdown: priceBreakdownForm,
      quickModifierSelection: quickModifierSelectionForm,
      priceValidation: priceValidationForm,
    },
    formStates,
    resetAllForms,
    validateAllForms,
    getFormData,
  };
};
