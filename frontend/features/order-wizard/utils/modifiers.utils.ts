import type { PriceModifier } from '@api/pricing';
import type { PriceListItemInfoCategoryCode } from '@api/priceList';
import { formatModifierValue } from './formatting.utils';

export const filterModifiersByCategory = (
  modifiers: PriceModifier[],
  selectedCategoryCode: PriceListItemInfoCategoryCode | ''
) => {
  return modifiers.filter(
    (modifier) =>
      !modifier.categoryRestrictions ||
      modifier.categoryRestrictions.length === 0 ||
      modifier.categoryRestrictions.includes(selectedCategoryCode as PriceListItemInfoCategoryCode)
  );
};

export const getFormattedModifiers = (modifiers: PriceModifier[], selectedModifiers: string[]) => {
  return modifiers.map((modifier) => ({
    ...modifier,
    displayValue: formatModifierValue(modifier.value, modifier.type),
    isSelected: selectedModifiers.includes(modifier.code),
  }));
};
