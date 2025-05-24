/**
 * Ліміти валідації wizard - відповідальність за числові обмеження полів
 */

/**
 * Ліміти валідації для полів за категоріями
 */
export const FIELD_LIMITS = {
  // Клієнт
  FIRST_NAME: { min: 2, max: 50 },
  LAST_NAME: { min: 2, max: 50 },
  PHONE: { min: 10, max: 13 },
  EMAIL: { min: 5, max: 100 },
  ADDRESS: { min: 5, max: 200 },

  // Замовлення
  RECEIPT_NUMBER: { min: 1, max: 20 },
  UNIQUE_LABEL: { min: 1, max: 50 },
  ORDER_NOTES: { min: 0, max: 500 },

  // Предмет
  ITEM_NAME: { min: 2, max: 100 },
  ITEM_COLOR: { min: 2, max: 30 },
  ITEM_NOTES: { min: 0, max: 300 },
  QUANTITY: { min: 1, max: 100 },
  WEIGHT: { min: 0.1, max: 50 },

  // Ціна та оплата
  PRICE: { min: 0, max: 100000 },
  PAID_AMOUNT: { min: 0, max: 100000 },
  DISCOUNT_PERCENT: { min: 0, max: 100 },
} as const;
