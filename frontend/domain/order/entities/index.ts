/**
 * Експорт сутностей Order домену
 */

// === ОСНОВНІ СУТНОСТІ ===
export { OrderEntity } from './order.entity';

// === МОДУЛЬНІ СУТНОСТІ ===
export { OrderItemEntity } from './modules/order-item.entity';
export { OrderFinancialsEntity } from './modules/financial.entity';

// TODO: Додати інші модульні сутності в майбутньому:
// export { OrderCompletionEntity } from './modules/completion.entity';
// export { OrderPhotoEntity } from './modules/photo.entity';
// export { OrderDiscountEntity } from './modules/discount.entity';
// export { OrderStatusEntity } from './modules/status.entity';
