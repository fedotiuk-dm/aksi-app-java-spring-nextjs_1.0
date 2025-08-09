import type { PriceListItemInfoCategoryCode } from '@/shared/api/generated/priceList';

export interface ModifierConfig {
  code: string;
  label: string;
  value: string;
}

// Modifier codes and labels - should come from API in future
// These codes should match backend ItemModifier.code values
export const GENERAL_MODIFIERS: ModifierConfig[] = [
  { code: 'CHILD', label: 'Дитячі речі (до 30 розміру)', value: '-30%' },
  { code: 'MANUAL', label: 'Ручна чистка', value: '+20%' },
  { code: 'DIRTY', label: 'Дуже забруднені речі', value: '+20-100%' },
  { code: 'URGENT', label: 'Термінова чистка', value: '+50-100%' },
];

export const TEXTILE_MODIFIERS: ModifierConfig[] = [
  { code: 'FUR_COLLAR', label: 'З хутряними комірами та манжетами', value: '+30%' },
  { code: 'WATERPROOF', label: 'Водовідштовхуюче покриття', value: '+30%' },
  { code: 'SILK', label: 'Натуральний шовк, атлас, шифон', value: '+50%' },
  { code: 'COMBINED', label: 'Комбіновані вироби (шкіра+текстиль)', value: '+100%' },
  { code: 'TOYS', label: "Великі м'які іграшки", value: '+100%' },
  { code: 'BUTTONS', label: 'Пришивання гудзиків', value: 'фікс.' },
  // Коди нижче тимчасово приховані через відсутність підтримки на бекенді
  // { code: 'BW_COLOR', label: 'Чорний та світлі тони', value: '+20%' },
  // { code: 'WEDDING', label: 'Весільна сукня зі шлейфом', value: '+30%' },
];

export const LEATHER_MODIFIERS: ModifierConfig[] = [
  { code: 'IRON', label: 'Прасування шкіряних виробів', value: '70%' },
  { code: 'WATERPROOF', label: 'Водовідштовхуюче покриття', value: '+30%' },
  { code: 'DYE_AFTER', label: 'Фарбування (після нашої чистки)', value: '+50%' },
  { code: 'DYE_BEFORE', label: 'Фарбування (після чистки деінде)', value: '100%' },
  { code: 'INSERTS', label: 'Шкіряні вироби із вставками', value: '+30%' },
  { code: 'PEARL', label: 'Перламутрове покриття', value: '+30%' },
  { code: 'PADDING_FUR', label: 'Дублянки на штучному хутрі', value: '-20%' },
  { code: 'MANUAL_LEATHER', label: 'Ручна чистка виробів зі шкіри', value: '+30%' },
];

export function getAvailableModifiers(
  category: PriceListItemInfoCategoryCode | ''
): ModifierConfig[] {
  if (!category) return [];

  const modifiers = [...GENERAL_MODIFIERS];

  if (category === 'CLOTHING' || category === 'LAUNDRY') {
    modifiers.push(...TEXTILE_MODIFIERS);
  }

  if (category === 'LEATHER' || category === 'PADDING') {
    modifiers.push(...LEATHER_MODIFIERS);
  }

  return modifiers;
}
