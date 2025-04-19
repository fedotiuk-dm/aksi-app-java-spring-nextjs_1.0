/**
 * Типи для роботи з прайс-листом
 */

export interface PriceListItem {
  id: string;
  categoryId: string;
  catalogNumber: number;
  name: string;
  unitOfMeasure: string; // Змінено з unit
  basePrice: number;
  priceBlack?: number; // Змінено з blackColorPrice
  priceColor?: number; // Змінено з otherColorPrice
  isActive: boolean; // У бекенді це поле називається active
}

export interface ServiceCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  sortOrder: number;
  items: PriceListItem[];
}
