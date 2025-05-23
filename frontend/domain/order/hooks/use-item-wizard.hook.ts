/**
 * Хук для управління Item Wizard підвізардом
 * Інтегрує Item Wizard стан з React та бізнес-логікою
 */

import React, { useCallback, useMemo } from 'react';

import { useWizard, WizardStep } from '@/domain/wizard';

import { OrderItemService } from '../services/order-item.service';
import { useItemWizardStore, type ItemWizardData } from '../store';

import type {
  OrderItem,
  OrderItemCharacteristics,
  MaterialType,
  DefectType,
  StainType,
} from '../types';

// ItemWizardData тепер імпортується з store

/**
 * Стан валідації для кожного підкроку
 */
interface ItemWizardValidation {
  basicInfo: {
    isValid: boolean;
    errors: Record<string, string>;
  };
  properties: {
    isValid: boolean;
    errors: Record<string, string>;
  };
  defectsStains: {
    isValid: boolean;
    errors: Record<string, string>;
  };
  priceCalculator: {
    isValid: boolean;
    errors: Record<string, string>;
  };
  photoDocumentation: {
    isValid: boolean;
    errors: Record<string, string>;
  };
}

/**
 * Конфігурація Item Wizard хука
 */
interface UseItemWizardConfig {
  orderId?: string;
  editingItemId?: string;
  autoSave?: boolean;
}

/**
 * Результат операції Item Wizard
 */
export interface ItemWizardOperationResult {
  success: boolean;
  item?: OrderItem;
  error?: string;
}

/**
 * Хук для управління Item Wizard підвізардом
 */
export const useItemWizard = (config: UseItemWizardConfig = {}) => {
  const { orderId, editingItemId, autoSave: _autoSave = false } = config;
  const wizard = useWizard();

  // Використовуємо Zustand store замість локального стану
  const {
    itemData,
    isEditing,
    editingItemId: storeEditingItemId,
    updateBasicInfo: storeUpdateBasicInfo,
    updateProperties: storeUpdateProperties,
    updateDefectsStains: storeUpdateDefectsStains,
    updatePriceModifiers: storeUpdatePriceModifiers,
    updatePhotos: storeUpdatePhotos,
    resetItemData,
    startEditing,
    stopEditing,
  } = useItemWizardStore();

  // === COMPUTED VALUES ===

  /**
   * Перевірка чи редагуємо існуючий предмет
   */
  const isEditingComputed = useMemo(
    () => Boolean(editingItemId || storeEditingItemId),
    [editingItemId, storeEditingItemId]
  );

  /**
   * Перевірка чи Item Wizard активний
   */
  const isActive = useMemo(() => wizard.isItemWizardActive, [wizard.isItemWizardActive]);

  /**
   * Поточний підкрок Item Wizard
   */
  const currentSubStep = useMemo(() => {
    if (!isActive) return null;
    return wizard.currentStep;
  }, [isActive, wizard.currentStep]);

  /**
   * Валідація поточного стану предмета
   */
  const validation: ItemWizardValidation = useMemo(() => {
    return {
      basicInfo: validateBasicInfo(itemData),
      properties: validateProperties(itemData),
      defectsStains: validateDefectsStains(itemData),
      priceCalculator: validatePriceCalculator(itemData),
      photoDocumentation: validatePhotoDocumentation(itemData),
    };
  }, [itemData]);

  /**
   * Перевірка чи можна перейти до наступного підкроку
   */
  const canProceed = useMemo(() => {
    switch (currentSubStep) {
      case WizardStep.ITEM_BASIC_INFO:
        return validation.basicInfo.isValid;
      case WizardStep.ITEM_PROPERTIES:
        return validation.properties.isValid;
      case WizardStep.DEFECTS_STAINS:
        return validation.defectsStains.isValid;
      case WizardStep.PRICE_CALCULATOR:
        return validation.priceCalculator.isValid;
      case WizardStep.PHOTO_DOCUMENTATION:
        return validation.photoDocumentation.isValid;
      default:
        return false;
    }
  }, [currentSubStep, validation]);

  /**
   * Загальна готовність предмета до збереження
   */
  const isReadyToSave = useMemo(() => {
    return (
      validation.basicInfo.isValid &&
      validation.properties.isValid &&
      validation.defectsStains.isValid &&
      validation.priceCalculator.isValid &&
      validation.photoDocumentation.isValid
    );
  }, [validation]);

  // === ПУБЛІЧНІ МЕТОДИ ===

  /**
   * Оновлення основної інформації (підкрок 2.1)
   */
  const updateBasicInfo = useCallback(
    (
      updates: Partial<
        Pick<
          ItemWizardData,
          'name' | 'category' | 'quantity' | 'unitOfMeasure' | 'unitPrice' | 'description'
        >
      >
    ) => {
      storeUpdateBasicInfo(updates);
    },
    [storeUpdateBasicInfo]
  );

  /**
   * Оновлення характеристик (підкрок 2.2)
   */
  const updateProperties = useCallback(
    (
      updates: Partial<
        Pick<
          ItemWizardData,
          'material' | 'color' | 'fillerType' | 'fillerCompressed' | 'wearDegree'
        >
      >
    ) => {
      storeUpdateProperties(updates);
    },
    [storeUpdateProperties]
  );

  /**
   * Оновлення дефектів та плям (підкрок 2.3)
   */
  const updateDefectsStains = useCallback(
    (
      updates: Partial<
        Pick<
          ItemWizardData,
          'defects' | 'stains' | 'defectsNotes' | 'noWarranty' | 'noWarrantyReason'
        >
      >
    ) => {
      storeUpdateDefectsStains(updates);
    },
    [storeUpdateDefectsStains]
  );

  /**
   * Оновлення модифікаторів ціни (підкрок 2.4)
   */
  const updatePriceModifiers = useCallback(
    (
      updates: Partial<
        Pick<
          ItemWizardData,
          'childSized' | 'manualCleaning' | 'heavilySoiled' | 'heavilySoiledPercentage'
        >
      >
    ) => {
      storeUpdatePriceModifiers(updates);
    },
    [storeUpdatePriceModifiers]
  );

  /**
   * Оновлення фото (підкрок 2.5)
   */
  const updatePhotos = useCallback(
    (updates: Partial<Pick<ItemWizardData, 'photos' | 'hasPhotos'>>) => {
      storeUpdatePhotos(updates);
    },
    [storeUpdatePhotos]
  );

  /**
   * Розрахунок ціни предмета в реальному часі
   */
  const calculatePrice = useCallback(async () => {
    try {
      const itemForCalculation: Partial<OrderItem> = {
        name: itemData.name,
        category: itemData.category,
        quantity: itemData.quantity,
        unitPrice: itemData.unitPrice,
        material: itemData.material,
        // Додати інші поля для розрахунку
      };

      const result = await OrderItemService.calculateItemPrice(itemForCalculation);
      if (result.success && result.calculation) {
        return result.calculation;
      }
      return null;
    } catch (error) {
      console.error('Error calculating price:', error);
      return null;
    }
  }, [itemData]);

  /**
   * Збереження предмета
   */
  const saveItem = useCallback(async (): Promise<ItemWizardOperationResult> => {
    if (!orderId) {
      return { success: false, error: "Order ID обов'язкове для збереження предмета" };
    }

    if (!isReadyToSave) {
      return { success: false, error: 'Предмет не готовий до збереження - є помилки валідації' };
    }

    try {
      // Конвертуємо ItemWizardData в OrderItem
      const orderItem: Partial<OrderItem> = {
        id: editingItemId,
        orderId,
        name: itemData.name,
        category: itemData.category,
        quantity: itemData.quantity,
        unitOfMeasure: itemData.unitOfMeasure,
        unitPrice: itemData.unitPrice,
        description: itemData.description,
        material: itemData.material,
        color: itemData.color,
        // TODO: додати інші поля
      };

      let result;
      if (isEditing) {
        if (!editingItemId) {
          return { success: false, error: 'Відсутній ID предмета для редагування' };
        }
        result = await OrderItemService.updateOrderItem(orderId, editingItemId, orderItem);
      } else {
        result = await OrderItemService.addOrderItem(orderId, orderItem);
      }

      if (result.success) {
        // Очищуємо стан після успішного збереження
        resetItemData();
        return { success: true, item: result.item };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка збереження';
      return { success: false, error: errorMessage };
    }
  }, [orderId, editingItemId, isEditingComputed, isReadyToSave, itemData, resetItemData]);

  /**
   * Скасування та очищення стану
   */
  const cancelWizard = useCallback(() => {
    resetItemData();
  }, [resetItemData]);

  /**
   * Завантаження існуючого предмета для редагування
   */
  const loadItemForEditing = useCallback(
    async (itemId: string) => {
      if (!orderId) return;

      try {
        const result = await OrderItemService.getOrderItem(orderId, itemId);
        if (result.success && result.item) {
          // Конвертуємо OrderItem в ItemWizardData
          const item = result.item;
          startEditing(itemId, {
            name: item.name,
            category: item.category || '',
            quantity: item.quantity,
            unitOfMeasure: item.unitOfMeasure || 'шт',
            unitPrice: item.unitPrice || 0,
            description: item.description || '',
            material: item.material as MaterialType,
            color: item.color || '',
            // TODO: додати інші поля
            fillerType: undefined,
            fillerCompressed: false,
            wearDegree: undefined,
            defects: [],
            stains: [],
            defectsNotes: '',
            noWarranty: false,
            noWarrantyReason: '',
            childSized: false,
            manualCleaning: false,
            heavilySoiled: false,
            heavilySoiledPercentage: 0,
            photos: [],
            hasPhotos: false,
          });
        }
      } catch (error) {
        console.error('Error loading item for editing:', error);
      }
    },
    [orderId]
  );

  return {
    // === ДАНІ ===
    itemData,
    validation,
    currentSubStep,

    // === СТАН ===
    isActive,
    isEditing: isEditingComputed,
    canProceed,
    isReadyToSave,

    // === МЕТОДИ ОНОВЛЕННЯ ===
    updateBasicInfo,
    updateProperties,
    updateDefectsStains,
    updatePriceModifiers,
    updatePhotos,

    // === УТИЛІТИ ===
    calculatePrice,
    saveItem,
    cancelWizard,
    loadItemForEditing,

    // === WIZARD НАВІГАЦІЯ ===
    wizard,
  };
};

// === ВАЛІДАЦІЯ ПІДКРОКІВ ===

/**
 * Валідація основної інформації (2.1)
 */
function validateBasicInfo(data: ItemWizardData) {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = "Назва предмета обов'язкова";
  }

  if (!data.category.trim()) {
    errors.category = "Категорія послуги обов'язкова";
  }

  if (data.quantity <= 0) {
    errors.quantity = 'Кількість повинна бути більше 0';
  }

  if (data.unitPrice < 0) {
    errors.unitPrice = "Ціна не може бути від'ємною";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Валідація характеристик (2.2)
 */
function validateProperties(data: ItemWizardData) {
  const errors: Record<string, string> = {};

  // Матеріал обов'язковий для більшості категорій
  if (
    !data.material &&
    data.category &&
    !['прання', 'прасування'].includes(data.category.toLowerCase())
  ) {
    errors.material = "Матеріал обов'язковий для цієї категорії";
  }

  if (!data.color?.trim()) {
    errors.color = "Колір обов'язковий";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Валідація дефектів та плям (2.3)
 */
function validateDefectsStains(data: ItemWizardData) {
  const errors: Record<string, string> = {};

  // Якщо вказано "без гарантій", треба вказати причину
  if (data.noWarranty && !data.noWarrantyReason?.trim()) {
    errors.noWarrantyReason = 'Вкажіть причину відмови від гарантій';
  }

  if (data.defectsNotes && data.defectsNotes.length > 1000) {
    errors.defectsNotes = 'Примітки занадто довгі (максимум 1000 символів)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Валідація калькулятора ціни (2.4)
 */
function validatePriceCalculator(data: ItemWizardData) {
  const errors: Record<string, string> = {};

  if (data.heavilySoiled && (data.heavilySoiledPercentage || 0) < 20) {
    errors.heavilySoiledPercentage = 'Мінімальна надбавка за забруднення 20%';
  }

  if (data.heavilySoiledPercentage && data.heavilySoiledPercentage > 100) {
    errors.heavilySoiledPercentage = 'Максимальна надбавка за забруднення 100%';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Валідація фотодокументації (2.5)
 */
function validatePhotoDocumentation(data: ItemWizardData) {
  const errors: Record<string, string> = {};

  if (data.photos && data.photos.length > 5) {
    errors.photos = 'Максимум 5 фотографій на предмет';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
