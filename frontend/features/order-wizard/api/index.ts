// Експорт існуючих API хуків
export { useClients } from './clients';
export { useBranchLocations, useBranchLocationDetails } from './branches';

// Експорт API хуків спільних для всіх етапів
export { useOrders } from './stages/common/orders';
export { useOrderStatus } from './stages/common/order-status';

// Експорт API хуків для етапу 2: Менеджер предметів
// Підетап 2.1: Базова робота з предметами
export { useOrderItems } from './stages/stage2/items';
// Підетап 2.2: Характеристики предметів
export { useItemCharacteristics } from './stages/stage2/characteristics';
// Підетап 2.4: Знижки та надбавки (калькулятор ціни)
export { usePriceCalculator } from './stages/stage2/price-calculator';
// Підетап 2.5: Фотодокументація
export { useOrderItemPhotos } from './stages/stage2/photos';
