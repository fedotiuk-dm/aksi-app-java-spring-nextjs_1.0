/**
 * @fileoverview Публічне API для всіх хуків етапу 2 (Менеджер предметів)
 */

// Основний менеджер координації
export { useItemManager } from './useItemManager';

// Підхуки для підвізарда
export { useItemBasicInfo } from './useItemBasicInfo';
export { useItemCharacteristics } from './useItemCharacteristics';
export { useItemDefectsStains } from './useItemDefectsStains';
export { useItemPricing } from './useItemPricing';
export { useItemPhotos } from './useItemPhotos';

// Типи
export type {
  OrderItem,
  ItemBasicInfo,
  ItemCharacteristics,
  ItemDefectsStains,
  ItemPricing,
  ItemPhotos,
  UseItemManagerReturn,
  UseItemBasicInfoReturn,
  UseItemCharacteristicsReturn,
  UseItemDefectsStainsReturn,
  UseItemPricingReturn,
  UseItemPhotosReturn,
} from './types';
