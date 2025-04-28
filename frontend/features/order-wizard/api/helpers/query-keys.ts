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
  CHARACTERISTICS: 'characteristics',   // Загальний ключ для всіх характеристик предмета
  MATERIALS: 'materials',               // Матеріали предметів
  COLORS: 'colors',                     // Кольори предметів
  FILLER_TYPES: 'fillerTypes',          // Типи наповнювачів
  WEAR_DEGREES: 'wearDegrees',          // Ступені зносу
  IS_FILLER_REQUIRED: 'isFillerRequired',
  
  // Підетап 2.3: Забруднення, дефекти та ризики
  STAIN_TYPES: 'stainTypes',            // Типи плям
  DEFECT_TYPES: 'defectTypes',          // Типи дефектів
  DEFECTS: 'defects',                   // Загальні дані про дефекти
  
  // Підетап 2.4: Знижки та надбавки (калькулятор ціни)
  PRICE_MODIFIERS: 'priceModifiers',    // Модифікатори ціни
  BASE_PRICE: 'basePrice',              // Базова ціна для категорії
  PRICE_CALCULATION: 'priceCalculation', // Розрахунок ціни
  
  // Підетап 2.5: Фотодокументація
  ITEM_PHOTOS: 'itemPhotos',
  
  // Етап 3: Загальні параметри
  PAYMENT: 'payment',
  CONFIRMATION: 'confirmation',
};
