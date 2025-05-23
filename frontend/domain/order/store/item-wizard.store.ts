import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { MaterialType, DefectType, StainType } from '../types';

/**
 * Дані предмета в процесі створення/редагування
 */
export interface ItemWizardData {
  // Основна інформація (2.1)
  name: string;
  category: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  description?: string;

  // Характеристики (2.2)
  material?: MaterialType;
  color?: string;
  fillerType?: string;
  fillerCompressed?: boolean;
  wearDegree?: string;

  // Дефекти та плями (2.3)
  defects?: DefectType[];
  stains?: StainType[];
  defectsNotes?: string;
  noWarranty?: boolean;
  noWarrantyReason?: string;

  // Додаткові модифікатори (2.4)
  childSized?: boolean;
  manualCleaning?: boolean;
  heavilySoiled?: boolean;
  heavilySoiledPercentage?: number;

  // Фото (2.5)
  photos?: File[];
  hasPhotos?: boolean;
}

/**
 * Початковий стан предмета
 */
const initialItemData: ItemWizardData = {
  name: '',
  category: '',
  quantity: 1,
  unitOfMeasure: 'шт',
  unitPrice: 0,
  description: '',
  material: undefined,
  color: '',
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
};

/**
 * Item Wizard Store
 */
interface ItemWizardStore {
  // Стан
  itemData: ItemWizardData;
  isEditing: boolean;
  editingItemId?: string;

  // Дії
  setItemData: (data: ItemWizardData) => void;
  updateItemData: (updates: Partial<ItemWizardData>) => void;
  resetItemData: () => void;

  // Методи оновлення по секціях
  updateBasicInfo: (
    updates: Partial<
      Pick<
        ItemWizardData,
        'name' | 'category' | 'quantity' | 'unitOfMeasure' | 'unitPrice' | 'description'
      >
    >
  ) => void;
  updateProperties: (
    updates: Partial<
      Pick<ItemWizardData, 'material' | 'color' | 'fillerType' | 'fillerCompressed' | 'wearDegree'>
    >
  ) => void;
  updateDefectsStains: (
    updates: Partial<
      Pick<
        ItemWizardData,
        'defects' | 'stains' | 'defectsNotes' | 'noWarranty' | 'noWarrantyReason'
      >
    >
  ) => void;
  updatePriceModifiers: (
    updates: Partial<
      Pick<
        ItemWizardData,
        'childSized' | 'manualCleaning' | 'heavilySoiled' | 'heavilySoiledPercentage'
      >
    >
  ) => void;
  updatePhotos: (updates: Partial<Pick<ItemWizardData, 'photos' | 'hasPhotos'>>) => void;

  // Режим редагування
  startEditing: (itemId: string, data: ItemWizardData) => void;
  stopEditing: () => void;
}

/**
 * Item Wizard Store Implementation
 */
export const useItemWizardStore = create<ItemWizardStore>()(
  devtools(
    (set, get) => ({
      // Початковий стан
      itemData: initialItemData,
      isEditing: false,
      editingItemId: undefined,

      // Загальні дії
      setItemData: (data) => {
        console.log('ItemWizardStore: setItemData', data);
        set({ itemData: data });
      },

      updateItemData: (updates) => {
        console.log('ItemWizardStore: updateItemData', updates);
        set((state) => ({
          itemData: { ...state.itemData, ...updates },
        }));
      },

      resetItemData: () => {
        console.log('ItemWizardStore: resetItemData');
        set({
          itemData: initialItemData,
          isEditing: false,
          editingItemId: undefined,
        });
      },

      // Методи оновлення по секціях
      updateBasicInfo: (updates) => {
        console.log('ItemWizardStore: updateBasicInfo', updates);
        set((state) => ({
          itemData: { ...state.itemData, ...updates },
        }));
      },

      updateProperties: (updates) => {
        console.log('ItemWizardStore: updateProperties', updates);
        set((state) => ({
          itemData: { ...state.itemData, ...updates },
        }));
      },

      updateDefectsStains: (updates) => {
        console.log('ItemWizardStore: updateDefectsStains', updates);
        set((state) => ({
          itemData: { ...state.itemData, ...updates },
        }));
      },

      updatePriceModifiers: (updates) => {
        console.log('ItemWizardStore: updatePriceModifiers', updates);
        set((state) => ({
          itemData: { ...state.itemData, ...updates },
        }));
      },

      updatePhotos: (updates) => {
        console.log('ItemWizardStore: updatePhotos', updates);
        set((state) => ({
          itemData: { ...state.itemData, ...updates },
        }));
      },

      // Режим редагування
      startEditing: (itemId, data) => {
        console.log('ItemWizardStore: startEditing', { itemId, data });
        set({
          isEditing: true,
          editingItemId: itemId,
          itemData: data,
        });
      },

      stopEditing: () => {
        console.log('ItemWizardStore: stopEditing');
        set({
          isEditing: false,
          editingItemId: undefined,
          itemData: initialItemData,
        });
      },
    }),
    {
      name: 'item-wizard-store',
    }
  )
);
