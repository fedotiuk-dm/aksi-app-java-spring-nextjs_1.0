import { formatPrice } from '@/shared/lib/utils/format';

export interface ItemWithPricing {
  id: string;
  name: string;
  basePrice: number;
  priceColor?: number | null;
  priceBlack?: number | null;
  hasColorPrice: boolean;
  hasBlackPrice: boolean;
}

export const getColorOptions = (item: ItemWithPricing | undefined) => {
  if (!item) return [];

  const hasDistinctColorPrice = item.hasColorPrice && item.priceColor !== item.basePrice;
  const hasDistinctBlackPrice = item.hasBlackPrice && item.priceBlack !== item.basePrice;

  if (!hasDistinctColorPrice && !hasDistinctBlackPrice) {
    return [{
      value: 'standard',
      label: `Стандартна ціна (${formatPrice(item.basePrice)})`,
      price: item.basePrice
    }];
  }

  const options = [{
    value: 'base',
    label: `Базова ціна (${formatPrice(item.basePrice)})`,
    price: item.basePrice
  }];

  if (hasDistinctColorPrice) {
    options.push({
      value: 'color',
      label: `Кольорова ціна (${formatPrice(item.priceColor ?? 0)})`,
      price: item.priceColor ?? 0
    });
  }

  if (hasDistinctBlackPrice) {
    options.push({
      value: 'black',
      label: `Чорна ціна (${formatPrice(item.priceBlack ?? 0)})`,
      price: item.priceBlack ?? 0
    });
  }

  return options;
};

export const getBasePrice = (item: ItemWithPricing | undefined, colorType: string): number => {
  if (!item) return 0;

  const priceMap = {
    black: item.priceBlack || 0,
    color: item.priceColor || 0,
    base: item.basePrice,
    standard: item.basePrice
  };

  return priceMap[colorType as keyof typeof priceMap] || item.basePrice;
};