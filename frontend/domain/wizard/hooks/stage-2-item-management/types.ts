/**
 * @fileoverview Типи для етапу 2 - менеджер предметів
 */

import type { StainType, DefectType } from './useItemDefectsStains';
import type {
  ServiceCategoryDTO,
  PriceListItemDTO,
  PriceModifierDTO,
  PriceCalculationRequestDTO,
  PriceCalculationResponseDTO,
} from '@/shared/api/generated/full/aksiApi.schemas';
import type { OrderItemPhotoDTO } from '@/shared/api/generated/full/aksiApi.schemas';

// ===================================
// Основна інформація про предмет
// ===================================

export interface ItemBasicInfo {
  category?: ServiceCategoryDTO;
  priceListItem?: PriceListItemDTO;
  quantity: number;
  unitOfMeasure: 'pieces' | 'kg';
}

export interface UseItemBasicInfoReturn {
  // Стан
  basicInfo: ItemBasicInfo;
  categories: ServiceCategoryDTO[];
  priceListItems: PriceListItemDTO[];
  isLoadingCategories: boolean;
  isLoadingPriceList: boolean;
  error: string | null;

  // Дії
  setCategory: (category: ServiceCategoryDTO) => void;
  setPriceListItem: (priceListItem: PriceListItemDTO) => void;
  setQuantity: (quantity: number) => void;
  setUnitOfMeasure: (unitOfMeasure: 'pieces' | 'kg') => void;
  clearBasicInfo: () => void;
}

// ===================================
// Характеристики предмета
// ===================================

export interface ItemCharacteristics {
  material: string;
  color: string;
  filling?: string;
  wearLevel: number; // 10, 30, 50, 75
}

export interface UseItemCharacteristicsReturn {
  // Стан
  characteristics: ItemCharacteristics;
  materialOptions: string[];
  colorOptions: string[];
  fillingOptions: string[];
  wearLevelOptions: number[];
  isLoading: boolean;
  error: string | null;

  // Дії
  setMaterial: (material: string) => void;
  setColor: (color: string) => void;
  setFilling: (filling: string) => void;
  setWearLevel: (level: number) => void;
  clearCharacteristics: () => void;
}

// ===================================
// Дефекти та плями
// ===================================

export interface ItemDefectsStains {
  stains: StainType[];
  defects: DefectType[];
  notes: string;
}

export interface UseItemDefectsStainsReturn {
  // Стан
  defectsStains: ItemDefectsStains;
  availableStains: StainType[];
  availableDefects: DefectType[];
  isLoading: boolean;
  error: string | null;

  // Дії
  toggleStain: (stain: StainType) => void;
  toggleDefect: (defect: DefectType) => void;
  setNotes: (notes: string) => void;
  clearDefectsStains: () => void;
}

// ===================================
// Модифікатори та ціна
// ===================================

export interface ItemPricing {
  modifiers: PriceModifierDTO[];
  basePrice: number;
  finalPrice: number;
  calculation?: PriceCalculationResponseDTO;
}

export interface UseItemPricingReturn {
  // Стан
  pricing: ItemPricing;
  availableModifiers: PriceModifierDTO[];
  isLoadingModifiers: boolean;
  isCalculating: boolean;
  calculationError: string | null;

  // Дії
  toggleModifier: (modifier: PriceModifierDTO) => void;
  calculatePrice: (request: PriceCalculationRequestDTO) => Promise<void>;
  clearPricing: () => void;
}

// ===================================
// Фотодокументація
// ===================================

export interface ItemPhotos {
  photos: File[];
  uploadedPhotos: OrderItemPhotoDTO[];
  maxPhotos: number;
}

export interface UseItemPhotosReturn {
  // Стан
  photos: ItemPhotos;
  isUploading: boolean;
  uploadError: string | null;
  uploadProgress: number;

  // Дії
  addPhoto: (file: File) => Promise<void>;
  removePhoto: (index: number) => void;
  uploadPhotos: (itemId?: string) => Promise<void>;
  clearPhotos: () => void;
}

// ===================================
// Менеджер предметів
// ===================================

export interface OrderItem {
  id: string;
  basicInfo: ItemBasicInfo;
  characteristics: ItemCharacteristics;
  defectsStains: ItemDefectsStains;
  pricing: ItemPricing;
  photos: ItemPhotos;
  createdAt: Date;
  updatedAt: Date;
}

export interface UseItemManagerReturn {
  // Стан
  items: OrderItem[];
  currentItem: OrderItem | null;
  totalItemsCount: number;
  totalItemsAmount: number;
  isValid: boolean;
  isEditing: boolean;
  editingItemId: string | null;

  // Дії
  addItem: () => OrderItem;
  updateItem: (itemId: string, updates: Partial<OrderItem>) => void;
  removeItem: (itemId: string) => void;
  startEditingItem: (itemId: string) => void;
  stopEditingItem: () => void;
  duplicateItem: (itemId: string) => void;
  clearAllItems: () => void;

  // Підхуки для підвізарда
  basicInfoHook: UseItemBasicInfoReturn;
  characteristicsHook: UseItemCharacteristicsReturn;
  defectsStainsHook: UseItemDefectsStainsReturn;
  pricingHook: UseItemPricingReturn;
  photosHook: UseItemPhotosReturn;
}
