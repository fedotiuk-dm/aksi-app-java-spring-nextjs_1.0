import { formatEnumValue } from './formatting.utils';
import type { CartItemInfo, CalculatedItemPrice } from '@api/cart';

export const getItemDisplayInfo = (
  item: CartItemInfo,
  calculatedItem?: CalculatedItemPrice
) => {
  return {
    name: item.priceListItem?.name || 'Невідомий предмет',
    category: formatEnumValue(item.priceListItem?.categoryCode || ''),
    totalPrice: calculatedItem?.total || item.pricing?.total || 0,
    basePrice: calculatedItem?.basePrice || item.pricing?.basePrice || 0,
    characteristics: item.characteristics,
    modifiers: item.modifiers || []
  };
};

export const canSubmitItemForm = (selectedItemId: string | null, quantity: number): boolean => {
  return selectedItemId !== null && quantity > 0;
};