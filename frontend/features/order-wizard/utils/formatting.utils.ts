import { CartItemModifierType } from '@api/pricing';
import { formatPrice } from '@/shared/lib/utils/format';

export const formatModifierValue = (value: number, type: string): string => {
  if (type === CartItemModifierType.PERCENTAGE) {
    return `${(value / 100).toFixed(0)}%`;
  }
  if (type === CartItemModifierType.FIXED) {
    return `+${formatPrice(value)}`;
  }
  return `${value}`;
};

export const formatItemPricing = (item: {
  basePrice: number;
  priceBlack?: number | null;
  priceColor?: number | null;
}) => {
  const prices = [];

  if (item.priceBlack) {
    prices.push(`Чорний: ${formatPrice(item.priceBlack)}`);
  }

  if (item.basePrice) {
    prices.push(`Кольоровий: ${formatPrice(item.basePrice)}`);
  }

  return prices.join(', ') || 'Ціна не вказана';
};

export const formatEnumValue = (enumValue: string): string => {
  if (!enumValue) return '';
  return enumValue.charAt(0) + enumValue.slice(1).toLowerCase().replace(/_/g, ' ');
};
