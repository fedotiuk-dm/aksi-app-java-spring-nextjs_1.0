// Публічне API для Substep1 Item Basic Info домену
export { useItemBasicInfo } from './use-item-basic-info.hook';
export type { UseItemBasicInfoReturn } from './use-item-basic-info.hook';

// Схеми тільки якщо потрібні в UI
export {
  serviceCategorySelectionSchema,
  priceListItemSelectionSchema,
  quantityInputSchema,
  itemBasicInfoFormSchema,
} from './item-basic-info.schemas';

export type {
  ServiceCategorySelectionData,
  PriceListItemSelectionData,
  QuantityInputData,
  ItemBasicInfoFormData,
} from './item-basic-info.schemas';
