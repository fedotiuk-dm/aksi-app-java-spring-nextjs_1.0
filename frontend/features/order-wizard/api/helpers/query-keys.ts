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
  
  // Підетап 2.1: Основна інформація про предмет
  CATEGORIES: 'categories',
  ITEM_NAMES: 'itemNames',
  UNITS_OF_MEASURE: 'unitsOfMeasure',
  UNIT_SUPPORT: 'unitSupport',
  
  // Підетап 2.2: Характеристики предмета
  CHARACTERISTICS: 'characteristics',
  
  // Підетап 2.3: Забруднення та дефекти
  DEFECTS: 'defects',
  
  // Підетап 2.4: Ціноутворення
  PRICE_CALCULATION: 'priceCalculation',
  PRICE_MODIFIERS: 'priceModifiers',
  
  // Підетап 2.5: Фотодокументація
  ITEM_PHOTOS: 'itemPhotos',
  
  // Етап 3: Загальні параметри
  PAYMENT: 'payment',
  CONFIRMATION: 'confirmation',
};
