/**
 * Константи для ключів кешування TanStack Query
 * Об'єднані в єдиний об'єкт для запобігання дублювання
 */
export const QUERY_KEYS = {
  // Загальні ключі
  ORDERS: 'orders',
  ORDER_DETAILS: 'orderDetails',
  ORDER_STATUS: 'orderStatus',
  
  // Етап 1: Клієнт і базова інформація
  ORDER_BASE_INFO: 'orderBaseInfo',
  
  // Етап 2: Менеджер предметів
  ORDER_ITEMS: 'orderItems',
  ORDER_ITEM_DETAILS: 'orderItemDetails',
  CHARACTERISTICS: 'characteristics',
  DEFECTS: 'defects',
  PRICE_CALCULATION: 'priceCalculation',
  PRICE_MODIFIERS: 'priceModifiers',
  ITEM_PHOTOS: 'itemPhotos',
  
  // Етап 3: Загальні параметри
  PAYMENT: 'payment',
  CONFIRMATION: 'confirmation',
};
