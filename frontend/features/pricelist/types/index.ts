/**
 * Типи для роботи з прайс-листом
 */

export interface PriceListItem {
  id: string;
  categoryId: string;
  catalogNumber?: number;
  name: string;
  unitOfMeasure: string; // Змінено з unit
  basePrice: number;
  priceBlack: number | null; // Змінено з blackColorPrice
  priceColor: number | null; // Змінено з otherColorPrice
  isActive?: boolean;  // Використовуємо наше стандартне поле
  active?: boolean;     // Додаємо поле з бекенду
}

export interface ServiceCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  sortOrder: number;
  items: PriceListItem[];
  isActive?: boolean; // Перейменовано з active на isActive для сумісності з бекендом
}
