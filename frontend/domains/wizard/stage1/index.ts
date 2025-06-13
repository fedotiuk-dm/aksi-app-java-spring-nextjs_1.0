// Публічне API для Stage1 домену - Клієнт та базова інформація замовлення
// Експортуємо всі підетапи через їх публічні API

// =================== ПІДЕТАПИ STAGE1 ===================

// 1. Client Search - Пошук та вибір клієнтів
export * from './client-search';

// 2. Client Creation - Створення нових клієнтів
export * from './client-creation';

// 3. Basic Order Info - Базова інформація замовлення
export * from './basic-order-info';

// =================== ТИПИ STAGE1 ===================

// Реекспорт основних типів для зручності
export type { UseClientSearchReturn } from './client-search';

export type { UseClientCreationReturn } from './client-creation';

export type { UseBasicOrderInfoReturn } from './basic-order-info';
