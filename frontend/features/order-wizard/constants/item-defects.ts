import { ItemStainType, ItemDefectType } from '@/shared/api/generated/cart';

// Stains config - labels should come from i18n in future
export const STAINS_CONFIG = [
  { code: ItemStainType.GREASE, label: 'Жир' },
  { code: ItemStainType.BLOOD, label: 'Кров' },
  { code: ItemStainType.PROTEIN, label: 'Білок' },
  { code: ItemStainType.WINE, label: 'Вино' },
  { code: ItemStainType.COFFEE, label: 'Кава' },
  { code: ItemStainType.GRASS, label: 'Трава' },
  { code: ItemStainType.INK, label: 'Чорнило' },
  { code: ItemStainType.COSMETICS, label: 'Косметика' },
  { code: ItemStainType.OTHER, label: 'Інше' },
] as const;

// Defects config - labels should come from i18n in future
export const DEFECTS_CONFIG = [
  { code: ItemDefectType.WORN, label: 'Потертості' },
  { code: ItemDefectType.TORN, label: 'Порване' },
  { code: ItemDefectType.MISSING_ACCESSORIES, label: 'Відсутність фурнітури' },
  { code: ItemDefectType.DAMAGED_ACCESSORIES, label: 'Пошкодження фурнітури' },
  { code: ItemDefectType.OTHER, label: 'Інше' },
] as const;