/**
 * Етап 1: Клієнт та базова інформація замовлення
 *
 * Експортує всі сервіси для першого етапу Order Wizard:
 * - Вибір філії (фільтрація, рекомендації, валідація)
 * - Ініціалізація замовлення (номери, мітки, базова структура)
 *
 * ПРИМІТКА: Сервіси тепер зосереджені на бізнес-логіці. API виклики роблять хуки через Orval.
 */

// ===== СЕРВІСИ =====
// Працюючий сервіс
import { BranchSelectionService } from './branch-selection/branch-selection.service';

import type {
  BranchFilterCriteria,
  BranchSelectionResult,
} from './branch-selection/branch-selection.service';

export { BranchSelectionService };
export type { BranchFilterCriteria, BranchSelectionResult };

// TODO: Переписати OrderInitializationService під Orval
// export { OrderInitializationService } from './order-initialization/order-initialization.service';

// ===== ТИПИ =====

// Типи з BranchSelectionService
// export type {
//   BranchFilterCriteria,
//   BranchSelectionResult,
// } from './branch-selection/branch-selection.service';

// TODO: Оновити типи після переписування OrderInitializationService
// Типи з OrderInitializationService
// export type {
//   OrderInitData,
//   UniqueTagValidation,
//   ReceiptNumberData,
// } from './order-initialization/order-initialization.service';
