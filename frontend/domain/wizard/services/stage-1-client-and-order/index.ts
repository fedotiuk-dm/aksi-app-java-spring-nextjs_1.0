/**
 * Етап 1: Клієнт та базова інформація замовлення
 *
 * Експортує всі сервіси для першого етапу Order Wizard:
 * - Вибір філії (фільтрація, рекомендації, валідація)
 * - Ініціалізація замовлення (номери, мітки, базова структура)
 *
 * ПРИМІТКА: Сервіси тепер зосереджені на бізнес-логіці. API виклики роблять хуки через Orval.
 * Використовуємо Zod схеми з orval для валідації та типізації.
 */

// ===== СЕРВІСИ =====
// Працюючий сервіс з orval + zod інтеграцією
import { BranchSelectionService } from './branch-selection/branch-selection.service';
import { OrderInitializationService } from './order-initialization/order-initialization.service';

import type {
  BranchLocationDTO,
  BranchFilterCriteria,
  BranchSelectionResult,
} from './branch-selection/branch-selection.service';
import type {
  CreateOrderRequest,
  OrderResponse,
  OrderInitData,
  UniqueTagValidation,
  ReceiptNumberData,
  OrderInitializationResult,
} from './order-initialization/order-initialization.service';

export { BranchSelectionService, OrderInitializationService };
export type {
  BranchLocationDTO,
  BranchFilterCriteria,
  BranchSelectionResult,
  CreateOrderRequest,
  OrderResponse,
  OrderInitData,
  UniqueTagValidation,
  ReceiptNumberData,
  OrderInitializationResult,
};

// ===== ТИПИ =====

// Типи з BranchSelectionService (базуються на orval Zod схемах)
// export type {
//   BranchLocationDTO,        // z.infer<typeof getAllBranchLocations200Response>
//   BranchFilterCriteria,     // z.infer<typeof branchFilterSchema>
//   BranchSelectionResult,    // композитний тип для результату валідації
// } from './branch-selection/branch-selection.service';

// Типи з OrderInitializationService (базуються на orval Zod схемах)
// export type {
//   CreateOrderRequest,       // z.infer<typeof createOrderBody>
//   OrderResponse,            // z.infer<typeof createOrder201Response>
//   OrderInitData,            // локальна схема для ініціалізації
//   UniqueTagValidation,      // локальна схема для валідації тегів
//   ReceiptNumberData,        // локальна схема для генерації номерів
//   OrderInitializationResult,// композитний тип для результату
// } from './order-initialization/order-initialization.service';
