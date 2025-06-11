import type { OrderItemDTO } from '../../../lib/api/generated/models/OrderItemDTO';
import type {
  ItemSummary,
  ManagerStatistics,
  ItemsFilter,
  ItemsSorting,
  SortField,
  SortDirection,
} from '../types/stage2.types';

/**
 * Утиліти для роботи з предметами Stage 2
 *
 * Відповідальність:
 * - Обробка та трансформація даних предметів
 * - Фільтрація та сортування
 * - Розрахунок статистики
 * - Форматування для відображення
 */

// ========== ТРАНСФОРМАЦІЯ ДАНИХ ==========

/**
 * Перетворює OrderItemDTO в ItemSummary для відображення в таблиці
 */
export const transformToItemSummary = (item: OrderItemDTO): ItemSummary => ({
  id: item.id || '',
  name: item.name,
  category: item.category || 'Не вказана',
  quantity: item.quantity,
  unitPrice: item.unitPrice,
  totalPrice: item.totalPrice || item.quantity * item.unitPrice,
  color: item.color,
  material: item.material,
});

/**
 * Перетворює масив предметів в масив ItemSummary
 */
export const transformItemsToSummaries = (items: OrderItemDTO[]): ItemSummary[] => {
  return items.map(transformToItemSummary);
};

// ========== РОЗРАХУНОК СТАТИСТИКИ ==========

/**
 * Розраховує статистику менеджера предметів
 */
export const calculateManagerStatistics = (items: OrderItemDTO[]): ManagerStatistics => {
  if (items.length === 0) {
    return {
      totalItems: 0,
      totalAmount: 0,
      averageItemPrice: 0,
      categoriesCount: 0,
      hasDefectItems: false,
      hasSpecialInstructions: false,
    };
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.totalPrice || item.quantity * item.unitPrice),
    0
  );

  const categories = new Set(items.map((item) => item.category).filter(Boolean));

  const hasDefectItems = items.some(
    (item) => item.defects || item.defectsAndRisks || item.noGuaranteeReason
  );

  const hasSpecialInstructions = items.some((item) => item.specialInstructions);

  return {
    totalItems: items.length,
    totalAmount,
    averageItemPrice: totalAmount / items.length,
    categoriesCount: categories.size,
    hasDefectItems,
    hasSpecialInstructions,
  };
};

// ========== ФІЛЬТРАЦІЯ ==========

/**
 * Фільтрує предмети за заданими критеріями
 */
export const filterItems = (items: OrderItemDTO[], filter: ItemsFilter): OrderItemDTO[] => {
  return items.filter((item) => {
    // Пошук за назвою
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(searchLower);
      const categoryMatch = item.category?.toLowerCase().includes(searchLower);
      const materialMatch = item.material?.toLowerCase().includes(searchLower);

      if (!nameMatch && !categoryMatch && !materialMatch) {
        return false;
      }
    }

    // Фільтр за категорією
    if (filter.category && item.category !== filter.category) {
      return false;
    }

    // Фільтр за ціновим діапазоном
    if (filter.priceRange) {
      const itemPrice = item.totalPrice || item.quantity * item.unitPrice;
      if (itemPrice < filter.priceRange.min || itemPrice > filter.priceRange.max) {
        return false;
      }
    }

    // Фільтр за наявністю дефектів
    if (filter.hasDefects !== undefined) {
      const hasDefects = !!(item.defects || item.defectsAndRisks || item.noGuaranteeReason);
      if (hasDefects !== filter.hasDefects) {
        return false;
      }
    }

    // Фільтр за наявністю спеціальних інструкцій
    if (filter.hasSpecialInstructions !== undefined) {
      const hasInstructions = !!item.specialInstructions;
      if (hasInstructions !== filter.hasSpecialInstructions) {
        return false;
      }
    }

    return true;
  });
};

// ========== СОРТУВАННЯ ==========

/**
 * Сортує предмети за заданими критеріями
 */
export const sortItems = (items: OrderItemDTO[], sorting: ItemsSorting): OrderItemDTO[] => {
  const { field, direction } = sorting;

  return [...items].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (field) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'category':
        aValue = a.category || '';
        bValue = b.category || '';
        break;
      case 'quantity':
        aValue = a.quantity;
        bValue = b.quantity;
        break;
      case 'unitPrice':
        aValue = a.unitPrice;
        bValue = b.unitPrice;
        break;
      case 'totalPrice':
        aValue = a.totalPrice || a.quantity * a.unitPrice;
        bValue = b.totalPrice || b.quantity * b.unitPrice;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    // Порівняння для рядків
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue, 'uk');
      return direction === 'asc' ? comparison : -comparison;
    }

    // Порівняння для чисел
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const comparison = aValue - bValue;
      return direction === 'asc' ? comparison : -comparison;
    }

    return 0;
  });
};

// ========== ВАЛІДАЦІЯ ==========

/**
 * Перевіряє, чи предмет готовий до додавання
 */
export const validateItemForAdd = (item: Partial<OrderItemDTO>): string[] => {
  const errors: string[] = [];

  if (!item.name || item.name.trim().length === 0) {
    errors.push("Назва предмета є обов'язковою");
  }

  if (!item.quantity || item.quantity <= 0) {
    errors.push('Кількість повинна бути більше 0');
  }

  if (!item.unitPrice || item.unitPrice <= 0) {
    errors.push('Ціна за одиницю повинна бути більше 0');
  }

  if (!item.category || item.category.trim().length === 0) {
    errors.push("Категорія є обов'язковою");
  }

  return errors;
};

/**
 * Перевіряє, чи можна видалити предмет
 */
export const canDeleteItem = (item: OrderItemDTO): boolean => {
  // Тут можна додати логіку перевірки, наприклад:
  // - чи не залежать від цього предмета інші предмети
  // - чи не має предмет обробку в процесі

  return true; // Поки що дозволяємо видаляти будь-який предмет
};

// ========== ФОРМАТУВАННЯ ==========

/**
 * Форматує ціну для відображення
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 2,
  }).format(price);
};

/**
 * Форматує кількість з одиницею виміру
 */
export const formatQuantity = (quantity: number, unit?: string): string => {
  const formattedQuantity = Number.isInteger(quantity) ? quantity.toString() : quantity.toFixed(2);

  return unit ? `${formattedQuantity} ${unit}` : formattedQuantity;
};

/**
 * Створює короткий опис предмета для відображення
 */
export const getItemShortDescription = (item: OrderItemDTO): string => {
  const parts: string[] = [item.name];

  if (item.color) {
    parts.push(item.color);
  }

  if (item.material) {
    parts.push(item.material);
  }

  return parts.join(', ');
};

/**
 * Отримує унікальні категорії з списку предметів
 */
export const getUniqueCategories = (items: OrderItemDTO[]): string[] => {
  const categories = new Set(
    items.map((item) => item.category).filter((category): category is string => !!category)
  );

  return Array.from(categories).sort();
};

/**
 * Отримує діапазон цін з списку предметів
 */
export const getPriceRange = (items: OrderItemDTO[]): { min: number; max: number } => {
  if (items.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = items.map((item) => item.totalPrice || item.quantity * item.unitPrice);

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};
