// Публічне API для Item Manager домену
export { useItemManager } from './use-item-manager.hook';
export type { UseItemManagerReturn } from './use-item-manager.hook';

// Схеми тільки якщо потрібні в UI
export {
  itemSearchFormSchema,
  itemFilterFormSchema,
  itemManagerSettingsSchema,
} from './item-manager.schemas';

export type {
  ItemSearchFormData,
  ItemFilterFormData,
  ItemManagerSettingsData,
} from './item-manager.schemas';
