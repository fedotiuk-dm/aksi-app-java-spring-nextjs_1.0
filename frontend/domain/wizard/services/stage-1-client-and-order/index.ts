/**
 * Етап 1: Клієнт та базова інформація замовлення
 *
 * Експортує всі сервіси для першого етапу Order Wizard:
 * - Управління клієнтами (пошук, створення, валідація)
 * - Вибір філії (фільтрація, рекомендації, валідація)
 * - Ініціалізація замовлення (номери, мітки, базова структура)
 */

// ===== СЕРВІСИ =====
export { ClientManagementService } from './client-management/client-management.service';
export { BranchSelectionService } from './branch-selection/branch-selection.service';
export { OrderInitializationService } from './order-initialization/order-initialization.service';

// ===== ТИПИ (тільки існуючі) =====

// Типи з ClientManagementService
export type {
  ClientData,
  ContactMethod,
  InfoSource,
} from './client-management/client-management.service';

// Типи з BranchSelectionService
export type { BranchSelection } from './branch-selection/branch-selection.service';

// Типи з OrderInitializationService
export type { OrderInitData } from './order-initialization/order-initialization.service';

// Типи з результатів ініціалізації (з адаптерів)
export type { WizardOrderInitializationResult } from '@/domain/wizard/adapters/order';
