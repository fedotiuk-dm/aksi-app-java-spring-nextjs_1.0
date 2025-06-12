// Публічне API для Substep2 Item Characteristics домену
export { useItemCharacteristics } from './use-item-characteristics.hook';
export type { UseItemCharacteristicsReturn } from './use-item-characteristics.hook';

// Схеми тільки якщо потрібні в UI
export {
  materialSelectionSchema,
  colorSelectionSchema,
  fillerSelectionSchema,
  wearLevelSelectionSchema,
  itemCharacteristicsFormSchema,
  materialFilterSchema,
} from './item-characteristics.schemas';

export type {
  MaterialSelectionData,
  ColorSelectionData,
  FillerSelectionData,
  WearLevelSelectionData,
  ItemCharacteristicsFormData,
  MaterialFilterData,
} from './item-characteristics.schemas';
