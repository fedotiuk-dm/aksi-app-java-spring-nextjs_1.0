/**
 * Хук для управління Item Wizard підвізардом
 * Інтегрує Item Wizard стан з React та бізнес-логікою
 */

import { useCallback, useMemo } from 'react';

import { useWizard, WizardStep } from '@/domain/wizard';

import { useOrderItems } from './use-order-items.hook';
import { useItemWizardStore, type ItemWizardData } from '../store';

import type { OrderItem } from '../types';

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

  // Використовуємо useOrderItems для роботи з предметами (TanStack Query мутації)
  const { addItem, updateItem } = useOrderItems({ orderId });

  // Використовуємо Zustand store замість локального стану
  const {
    itemData,
    editingItemId: storeEditingItemId,
    updateBasicInfo: storeUpdateBasicInfo,
    updateProperties: storeUpdateProperties,
    updateDefectsStains: storeUpdateDefectsStains,
    updatePriceModifiers: storeUpdatePriceModifiers,
    updatePhotos: storeUpdatePhotos,
    resetItemData,
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
      console.log('🔍 updateBasicInfo викликано з updates:', updates);
      console.log('🔍 поточний itemData перед оновленням:', itemData);
      storeUpdateBasicInfo(updates);

      // Логуємо стан після оновлення (можливо буде асинхронно)
      setTimeout(() => {
        console.log('🔍 itemData після оновлення:', itemData);
      }, 0);
    },
    [storeUpdateBasicInfo, itemData]
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
      console.log('🔍 updateProperties викликано з updates:', updates);
      console.log('🔍 поточна категорія для матеріалів:', itemData.category);
      storeUpdateProperties(updates);
    },
    [storeUpdateProperties, itemData.category]
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
      // TODO: Додати метод calculatePrice в useOrderItems або використати окремий хук
      console.log('calculatePrice не реалізовано через useOrderItems');
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
    console.log('🔍 saveItem викликано. Стан перед збереженням:', {
      orderId,
      isReadyToSave,
      itemData,
      validation,
    });

    if (!orderId) {
      console.error('❌ Order ID відсутній');
      return { success: false, error: "Order ID обов'язкове для збереження предмета" };
    }

    if (!isReadyToSave) {
      console.error('❌ Валідація не пройшла. Деталі:');
      console.error('basicInfo:', validation.basicInfo);
      console.error('properties:', validation.properties);
      console.error('defectsStains:', validation.defectsStains);
      console.error('priceCalculator:', validation.priceCalculator);
      console.error('photoDocumentation:', validation.photoDocumentation);
      console.error('itemData:', itemData);
      return { success: false, error: 'Предмет не готовий до збереження - є помилки валідації' };
    }

    try {
      console.log('✅ Валідація пройшла успішно, починаємо збереження...');

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

      console.log('🔍 Підготовлений orderItem для збереження:', orderItem);

      let result;
      if (isEditingComputed) {
        if (!editingItemId) {
          console.error('❌ Відсутній ID предмета для редагування');
          return { success: false, error: 'Відсутній ID предмета для редагування' };
        }
        console.log('📝 Редагуємо існуючий предмет з ID:', editingItemId);
        result = await updateItem(editingItemId, orderItem);
      } else {
        console.log('➕ Додаємо новий предмет до замовлення:', orderId);
        result = await addItem(orderItem);
      }

      console.log('🔍 Результат збереження через useOrderItems:', result);

      if (result.success) {
        console.log('✅ Предмет збережено успішно через useOrderItems мутацію');
        console.log('✅ Збережений предмет:', result.item);

        // Очищуємо стан після успішного збереження
        console.log('🧹 Очищуємо стан Item Wizard після збереження');
        resetItemData();
        return { success: true, item: result.item };
      } else {
        console.error('❌ Помилка збереження через useOrderItems:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка збереження';
      console.error('❌ Exception при збереженні предмета:', error);
      return { success: false, error: errorMessage };
    }
  }, [
    orderId,
    editingItemId,
    isEditingComputed,
    isReadyToSave,
    itemData,
    validation,
    addItem,
    updateItem,
    resetItemData,
  ]);

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
        // TODO: Додати метод getOrderItem в useOrderItems або використати findItemById
        console.log('loadItemForEditing не реалізовано через useOrderItems');
        // Тимчасово використовуємо findItemById якщо предмет вже в кеші
        // const item = findItemById(itemId);
        // if (item) {
        //   startEditing(itemId, {
        //     // конвертувати OrderItem в ItemWizardData
        //   });
        // }
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

  console.log('🔍 validateProperties викликано:', {
    material: data.material,
    category: data.category,
    color: data.color,
  });

  // Матеріал обов'язковий для більшості категорій
  if (
    !data.material &&
    data.category &&
    !['прання', 'прасування'].includes(data.category.toLowerCase())
  ) {
    errors.material = "Матеріал обов'язковий для цієї категорії";
    console.log("❌ validateProperties: Матеріал обов'язковий", {
      category: data.category,
      material: data.material,
    });
  }

  if (!data.color?.trim()) {
    errors.color = "Колір обов'язковий";
    console.log("❌ validateProperties: Колір обов'язковий", {
      color: data.color,
    });
  }

  const isValid = Object.keys(errors).length === 0;
  console.log('🔍 validateProperties результат:', {
    isValid,
    errors,
    data: {
      material: data.material,
      category: data.category,
      color: data.color,
    },
  });

  return {
    isValid,
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
