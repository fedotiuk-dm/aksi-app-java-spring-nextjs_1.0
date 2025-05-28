/**
 * @fileoverview Підетап 2.0 - Координатор менеджера предметів (orval + zod)
 * @module domain/wizard/services/stage-2-item-management/item-manager
 *
 * Експортує:
 * - ItemManagerService з orval + zod валідацією
 * - Типи ТІЛЬКИ для менеджменту (OrderItemsListResponse, OrderSummary, ItemTableRow)
 * - Бізнес-логіка для CRUD операцій та підсумків замовлення
 * - НЕ дублює типи з інших сервісів (OrderItemResponse, ItemValidationResult)
 *
 * ✅ ORVAL READY: повністю інтегровано з orval + zod
 */

export * from './item-manager.service';
