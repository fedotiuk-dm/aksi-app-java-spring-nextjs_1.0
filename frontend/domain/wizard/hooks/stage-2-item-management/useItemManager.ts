/**
 * @fileoverview Менеджер для координації всіх операцій з предметами на етапі 2
 *
 * Відповідальність:
 * - Координація підвізарда (підетапи 2.1-2.5)
 * - Управління списком доданих предметів
 * - Формування таблиці предметів для етапу 2.0
 * - Розрахунок загальної вартості та валідація
 */

import { useState, useCallback, useMemo } from 'react';

import { useItemBasicInfo } from './useItemBasicInfo';
import { useItemCharacteristics } from './useItemCharacteristics';
import { useItemDefectsStains } from './useItemDefectsStains';
import { useItemPhotos } from './useItemPhotos';
import { useItemPricing } from './useItemPricing';

import type { OrderItem, UseItemManagerReturn } from './types';

/**
 * Хук для координації всіх операцій з предметами
 *
 * Об'єднує всі підхуки підвізарда та управляє списком предметів
 *
 * @example
 * ```tsx
 * const {
 *   items,
 *   currentItem,
 *   totalItemsCount,
 *   totalItemsAmount,
 *   isValid,
 *   addItem,
 *   startEditingItem,
 *   removeItem,
 *   basicInfoHook,
 *   characteristicsHook
 * } = useItemManager();
 * ```
 */
export function useItemManager(): UseItemManagerReturn {
  const basicInfoHook = useItemBasicInfo();
  const characteristicsHook = useItemCharacteristics(basicInfoHook.basicInfo.category);
  const defectsStainsHook = useItemDefectsStains();
  const pricingHook = useItemPricing();
  const photosHook = useItemPhotos();

  const [items, setItems] = useState<OrderItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  /**
   * Поточний предмет що редагується
   */
  const currentItem = useMemo(() => {
    return editingItemId ? items.find((item) => item.id === editingItemId) || null : null;
  }, [items, editingItemId]);

  /**
   * Загальна кількість предметів
   */
  const totalItemsCount = useMemo(() => items.length, [items]);

  /**
   * Загальна вартість всіх предметів
   */
  const totalItemsAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.pricing?.finalPrice || 0), 0);
  }, [items]);

  /**
   * Чи готовий етап до переходу далі
   */
  const isValid = useMemo(() => {
    return (
      items.length > 0 &&
      items.every(
        (item) =>
          item.basicInfo.category &&
          item.basicInfo.priceListItem &&
          item.basicInfo.quantity > 0 &&
          item.pricing?.finalPrice &&
          item.pricing.finalPrice > 0
      )
    );
  }, [items]);

  /**
   * Чи відбувається редагування
   */
  const isEditing = editingItemId !== null;

  /**
   * Додати предмет на основі даних з підвізарда
   */
  const addItem = useCallback((): OrderItem => {
    const newItem: OrderItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      basicInfo: basicInfoHook.basicInfo,
      characteristics: characteristicsHook.characteristics,
      defectsStains: defectsStainsHook.defectsStains,
      pricing: pricingHook.pricing,
      photos: photosHook.photos,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setItems((prev) => [...prev, newItem]);

    // Очищуємо підвізард після додавання
    basicInfoHook.clearBasicInfo();
    characteristicsHook.clearCharacteristics();
    defectsStainsHook.clearDefectsStains();
    pricingHook.clearPricing();
    photosHook.clearPhotos();

    return newItem;
  }, [basicInfoHook, characteristicsHook, defectsStainsHook, pricingHook, photosHook]);

  /**
   * Оновити існуючий предмет
   */
  const updateItem = useCallback((itemId: string, updates: Partial<OrderItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...updates,
              updatedAt: new Date(),
            }
          : item
      )
    );
  }, []);

  /**
   * Видалити предмет
   */
  const removeItem = useCallback(
    (itemId: string) => {
      setItems((prev) => prev.filter((item) => item.id !== itemId));

      // Якщо видаляємо предмет що редагується, завершуємо редагування
      if (editingItemId === itemId) {
        setEditingItemId(null);
      }
    },
    [editingItemId]
  );

  /**
   * Почати редагування предмета
   */
  const startEditingItem = useCallback(
    (itemId: string) => {
      const itemToEdit = items.find((item) => item.id === itemId);
      if (itemToEdit) {
        // Завантажуємо дані в підвізард
        if (itemToEdit.basicInfo.category) {
          basicInfoHook.setCategory(itemToEdit.basicInfo.category);
        }
        if (itemToEdit.basicInfo.priceListItem) {
          basicInfoHook.setPriceListItem(itemToEdit.basicInfo.priceListItem);
        }
        basicInfoHook.setQuantity(itemToEdit.basicInfo.quantity);
        basicInfoHook.setUnitOfMeasure(itemToEdit.basicInfo.unitOfMeasure);

        characteristicsHook.setMaterial(itemToEdit.characteristics.material);
        characteristicsHook.setColor(itemToEdit.characteristics.color);
        if (itemToEdit.characteristics.filling) {
          characteristicsHook.setFilling(itemToEdit.characteristics.filling);
        }
        characteristicsHook.setWearLevel(itemToEdit.characteristics.wearLevel);

        defectsStainsHook.setNotes(itemToEdit.defectsStains.notes);
        // Завантажуємо плями та дефекти
        itemToEdit.defectsStains.stains.forEach((stain) => {
          defectsStainsHook.toggleStain(stain);
        });
        itemToEdit.defectsStains.defects.forEach((defect) => {
          defectsStainsHook.toggleDefect(defect);
        });

        setEditingItemId(itemId);
      }
    },
    [items, basicInfoHook, characteristicsHook, defectsStainsHook]
  );

  /**
   * Завершити редагування предмета
   */
  const stopEditingItem = useCallback(() => {
    setEditingItemId(null);

    // Очищуємо підвізард
    basicInfoHook.clearBasicInfo();
    characteristicsHook.clearCharacteristics();
    defectsStainsHook.clearDefectsStains();
    pricingHook.clearPricing();
    photosHook.clearPhotos();
  }, [basicInfoHook, characteristicsHook, defectsStainsHook, pricingHook, photosHook]);

  /**
   * Дублювати предмет
   */
  const duplicateItem = useCallback(
    (itemId: string) => {
      const itemToDuplicate = items.find((item) => item.id === itemId);
      if (itemToDuplicate) {
        const duplicatedItem: OrderItem = {
          ...itemToDuplicate,
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setItems((prev) => [...prev, duplicatedItem]);
      }
    },
    [items]
  );

  /**
   * Очистити всі предмети
   */
  const clearAllItems = useCallback(() => {
    setItems([]);
    setEditingItemId(null);
  }, []);

  return {
    // Стан
    items,
    currentItem,
    totalItemsCount,
    totalItemsAmount,
    isValid,
    isEditing,
    editingItemId,

    // Дії
    addItem,
    updateItem,
    removeItem,
    startEditingItem,
    stopEditingItem,
    duplicateItem,
    clearAllItems,

    // Підхуки для підвізарда
    basicInfoHook,
    characteristicsHook,
    defectsStainsHook,
    pricingHook,
    photosHook,
  };
}
