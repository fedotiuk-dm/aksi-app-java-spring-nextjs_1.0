/**
 * @fileoverview Хук для управління підвізардом додавання предметів (підетапи 2.1-2.5)
 *
 * Інкапсулює логіку:
 * - Навігація між підетапами
 * - Валідація кожного підетапу
 * - Збереження даних підетапів
 * - Створення/оновлення предмета через API
 */

import { useState, useCallback, useMemo } from 'react';

import {
  useAddOrderItem,
  useUpdateOrderItem,
  type OrderItemDTO,
} from '@/shared/api/generated/full';

import type { BasicItemInfoData } from '../../../features/order-wizard/ui/components/stage2/substeps';

// Типи для всіх підетапів
export interface ItemCharacteristicsData {
  material: string;
  color: string;
  filler?: string;
  wearDegree: number; // 10, 30, 50, 75
}

export interface StainsAndDefectsData {
  stains: string[]; // Масив типів плям
  defects: string[]; // Масив дефектів
  notes?: string;
}

export interface PriceCalculatorData {
  basePrice: number;
  modifiers: Array<{
    id: string;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    applied: boolean;
  }>;
  finalPrice: number;
}

export interface PhotoDocumentationData {
  photos: Array<{
    id: string;
    url: string;
    fileName: string;
    size: number;
  }>;
}

// Загальний тип для всіх даних підвізарда
export interface ItemWizardData {
  basicInfo: BasicItemInfoData;
  characteristics: ItemCharacteristicsData;
  stainsAndDefects: StainsAndDefectsData;
  priceCalculator: PriceCalculatorData;
  photoDocumentation: PhotoDocumentationData;
}

// Можливі підетапи
export type ItemWizardSubstep = 1 | 2 | 3 | 4 | 5;

// Типи помилок валідації для кожного підетапу
export interface ItemWizardErrors {
  basicInfo: Record<string, string>;
  characteristics: Record<string, string>;
  stainsAndDefects: Record<string, string>;
  priceCalculator: Record<string, string>;
  photoDocumentation: Record<string, string>;
  general: Record<string, string>;
}

export interface Stage2ItemWizardOperations {
  // Навігація
  currentSubstep: ItemWizardSubstep;
  canGoNext: boolean;
  canGoPrevious: boolean;
  goToNextSubstep: () => void;
  goToPreviousSubstep: () => void;
  goToSubstep: (substep: ItemWizardSubstep) => void;

  // Дані
  wizardData: ItemWizardData;
  updateBasicInfo: (data: Partial<BasicItemInfoData>) => void;
  updateCharacteristics: (data: Partial<ItemCharacteristicsData>) => void;
  updateStainsAndDefects: (data: Partial<StainsAndDefectsData>) => void;
  updatePriceCalculator: (data: Partial<PriceCalculatorData>) => void;
  updatePhotoDocumentation: (data: Partial<PhotoDocumentationData>) => void;

  // Валідація
  errors: ItemWizardErrors;
  validateCurrentSubstep: () => boolean;
  isSubstepValid: (substep: ItemWizardSubstep) => boolean;

  // Збереження
  saveItem: () => Promise<boolean>;
  isSaving: boolean;
  error: string | null;

  // Скидання
  resetWizard: () => void;
}

export const useStage2ItemWizard = (
  orderId: string | null,
  mode: 'create' | 'edit' = 'create',
  editingItemId?: string,
  initialData?: Partial<ItemWizardData>
): Stage2ItemWizardOperations => {
  // API мутації
  const addItemMutation = useAddOrderItem();
  const updateItemMutation = useUpdateOrderItem();

  // Поточний підетап
  const [currentSubstep, setCurrentSubstep] = useState<ItemWizardSubstep>(1);

  // Стан помилок
  const [error, setError] = useState<string | null>(null);

  // Дані всіх підетапів
  const [wizardData, setWizardData] = useState<ItemWizardData>({
    basicInfo: {
      categoryId: '',
      itemId: '',
      quantity: 1,
      unitOfMeasure: '',
      ...initialData?.basicInfo,
    },
    characteristics: {
      material: '',
      color: '',
      filler: '',
      wearDegree: 10,
      ...initialData?.characteristics,
    },
    stainsAndDefects: {
      stains: [],
      defects: [],
      notes: '',
      ...initialData?.stainsAndDefects,
    },
    priceCalculator: {
      basePrice: 0,
      modifiers: [],
      finalPrice: 0,
      ...initialData?.priceCalculator,
    },
    photoDocumentation: {
      photos: [],
      ...initialData?.photoDocumentation,
    },
  });

  // Помилки валідації
  const [errors, setErrors] = useState<ItemWizardErrors>({
    basicInfo: {},
    characteristics: {},
    stainsAndDefects: {},
    priceCalculator: {},
    photoDocumentation: {},
    general: {},
  });

  // Обробники оновлення даних
  const updateBasicInfo = useCallback((data: Partial<BasicItemInfoData>) => {
    setWizardData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...data },
    }));
    // Очищуємо помилки після зміни
    setErrors((prev) => ({ ...prev, basicInfo: {} }));
    setError(null);
  }, []);

  const updateCharacteristics = useCallback((data: Partial<ItemCharacteristicsData>) => {
    setWizardData((prev) => ({
      ...prev,
      characteristics: { ...prev.characteristics, ...data },
    }));
    setErrors((prev) => ({ ...prev, characteristics: {} }));
    setError(null);
  }, []);

  const updateStainsAndDefects = useCallback((data: Partial<StainsAndDefectsData>) => {
    setWizardData((prev) => ({
      ...prev,
      stainsAndDefects: { ...prev.stainsAndDefects, ...data },
    }));
    setErrors((prev) => ({ ...prev, stainsAndDefects: {} }));
    setError(null);
  }, []);

  const updatePriceCalculator = useCallback((data: Partial<PriceCalculatorData>) => {
    setWizardData((prev) => ({
      ...prev,
      priceCalculator: { ...prev.priceCalculator, ...data },
    }));
    setErrors((prev) => ({ ...prev, priceCalculator: {} }));
    setError(null);
  }, []);

  const updatePhotoDocumentation = useCallback((data: Partial<PhotoDocumentationData>) => {
    setWizardData((prev) => ({
      ...prev,
      photoDocumentation: { ...prev.photoDocumentation, ...data },
    }));
    setErrors((prev) => ({ ...prev, photoDocumentation: {} }));
    setError(null);
  }, []);

  // Валідація кожного підетапу
  const validateSubstep = useCallback(
    (substep: ItemWizardSubstep): boolean => {
      const stepErrors: Record<string, string> = {};

      if (substep === 1) {
        // Валідація основної інформації
        if (!wizardData.basicInfo.categoryId) {
          stepErrors.categoryId = 'Оберіть категорію послуги';
        }
        if (!wizardData.basicInfo.itemId) {
          stepErrors.itemId = 'Оберіть найменування виробу';
        }
        if (!wizardData.basicInfo.quantity || wizardData.basicInfo.quantity <= 0) {
          stepErrors.quantity = 'Введіть коректну кількість';
        }

        setErrors((prev) => ({ ...prev, basicInfo: stepErrors }));
        return Object.keys(stepErrors).length === 0;
      }

      if (substep === 2) {
        // Валідація характеристик
        if (!wizardData.characteristics.material) {
          stepErrors.material = 'Оберіть матеріал';
        }
        if (!wizardData.characteristics.color) {
          stepErrors.color = 'Введіть колір';
        }

        setErrors((prev) => ({ ...prev, characteristics: stepErrors }));
        return Object.keys(stepErrors).length === 0;
      }

      // Підетапи 3, 4, 5 поки що без валідації (опціональні)
      return true;
    },
    [wizardData]
  );

  const validateCurrentSubstep = useCallback(() => {
    return validateSubstep(currentSubstep);
  }, [currentSubstep, validateSubstep]);

  const isSubstepValid = useCallback(
    (substep: ItemWizardSubstep) => {
      return validateSubstep(substep);
    },
    [validateSubstep]
  );

  // Навігація між підетапами
  const canGoNext = useMemo(() => {
    return currentSubstep < 5 && validateSubstep(currentSubstep);
  }, [currentSubstep, validateSubstep]);

  const canGoPrevious = useMemo(() => {
    return currentSubstep > 1;
  }, [currentSubstep]);

  const goToNextSubstep = useCallback(() => {
    if (canGoNext) {
      setCurrentSubstep((prev) => Math.min(prev + 1, 5) as ItemWizardSubstep);
    }
  }, [canGoNext]);

  const goToPreviousSubstep = useCallback(() => {
    if (canGoPrevious) {
      setCurrentSubstep((prev) => Math.max(prev - 1, 1) as ItemWizardSubstep);
    }
  }, [canGoPrevious]);

  const goToSubstep = useCallback((substep: ItemWizardSubstep) => {
    setCurrentSubstep(substep);
  }, []);

  // Перетворення даних візарда в OrderItemDTO
  const transformToOrderItemDTO = useCallback((): OrderItemDTO => {
    return {
      id: mode === 'edit' ? editingItemId : undefined,
      name: '', // Заповниться автоматично на бекенді з PriceListItem
      quantity: wizardData.basicInfo.quantity,
      unitPrice: wizardData.priceCalculator.basePrice || 0, // Обов'язкове поле
      totalPrice: wizardData.priceCalculator.finalPrice,
      material: wizardData.characteristics.material,
      color: wizardData.characteristics.color,
      unitOfMeasure: wizardData.basicInfo.unitOfMeasure,
      category: '', // Заповниться автоматично з категорії
      description: '',
      defects: wizardData.stainsAndDefects.defects.join(', '), // Конвертуємо масив в рядок
      stains: wizardData.stainsAndDefects.stains.join(', '), // Конвертуємо масив в рядок
      fillerType: wizardData.characteristics.filler,
      wearDegree: wizardData.characteristics.wearDegree.toString(),
      defectsNotes: wizardData.stainsAndDefects.notes,
    };
  }, [mode, editingItemId, wizardData]);

  // Збереження предмета
  const saveItem = useCallback(async (): Promise<boolean> => {
    // Валідуємо всі обов'язкові підетапи
    if (!validateSubstep(1) || !validateSubstep(2)) {
      setErrors((prev) => ({
        ...prev,
        general: { validation: "Заповніть всі обов'язкові поля" },
      }));
      return false;
    }

    if (!orderId) {
      setError('Не знайдено ID замовлення');
      return false;
    }

    setError(null);
    setErrors((prev) => ({ ...prev, general: {} }));

    try {
      const itemData = transformToOrderItemDTO();

      if (mode === 'create') {
        console.log('Creating new item:', { orderId, data: itemData });
        await addItemMutation.mutateAsync({
          orderId,
          data: itemData,
        });
      } else if (editingItemId) {
        console.log('Updating existing item:', { orderId, itemId: editingItemId, data: itemData });
        await updateItemMutation.mutateAsync({
          orderId,
          itemId: editingItemId,
          data: itemData,
        });
      } else {
        setError('Не знайдено ID предмета для редагування');
        return false;
      }

      return true;
    } catch (apiError) {
      console.error('Error saving item:', apiError);
      setError(
        `Помилка ${mode === 'create' ? 'створення' : 'оновлення'} предмета. Спробуйте ще раз.`
      );
      return false;
    }
  }, [
    validateSubstep,
    orderId,
    transformToOrderItemDTO,
    mode,
    editingItemId,
    addItemMutation,
    updateItemMutation,
  ]);

  // Скидання візарда
  const resetWizard = useCallback(() => {
    setCurrentSubstep(1);
    setWizardData({
      basicInfo: {
        categoryId: '',
        itemId: '',
        quantity: 1,
        unitOfMeasure: '',
      },
      characteristics: {
        material: '',
        color: '',
        filler: '',
        wearDegree: 10,
      },
      stainsAndDefects: {
        stains: [],
        defects: [],
        notes: '',
      },
      priceCalculator: {
        basePrice: 0,
        modifiers: [],
        finalPrice: 0,
      },
      photoDocumentation: {
        photos: [],
      },
    });
    setErrors({
      basicInfo: {},
      characteristics: {},
      stainsAndDefects: {},
      priceCalculator: {},
      photoDocumentation: {},
      general: {},
    });
    setError(null);
  }, []);

  // Статуси завантаження
  const isSaving = addItemMutation.isPending || updateItemMutation.isPending;

  return {
    // Навігація
    currentSubstep,
    canGoNext,
    canGoPrevious,
    goToNextSubstep,
    goToPreviousSubstep,
    goToSubstep,

    // Дані
    wizardData,
    updateBasicInfo,
    updateCharacteristics,
    updateStainsAndDefects,
    updatePriceCalculator,
    updatePhotoDocumentation,

    // Валідація
    errors,
    validateCurrentSubstep,
    isSubstepValid,

    // Збереження
    saveItem,
    isSaving,
    error,

    // Скидання
    resetWizard,
  };
};
