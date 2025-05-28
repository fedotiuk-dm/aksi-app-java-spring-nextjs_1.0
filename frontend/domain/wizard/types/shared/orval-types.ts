/**
 * Реекспорт orval типів для wizard домену
 *
 * Централізоване місце для імпорту та реекспорту всіх orval типів,
 * які використовуються в wizard компонентах
 */

import { z } from 'zod';

// === ІМПОРТИ API ТИПІВ З ORVAL ===
import {
  getBranchLocationById200Response,
  getAllBranchLocations200Response,
} from '@/shared/api/generated/branch/zod';
import {
  getClientById200Response,
  searchClients200Response,
} from '@/shared/api/generated/client/zod';
import {
  getOrderItem200Response,
  updateOrderItemBody,
  getOrderItems200Response,
  calculateCompletionDateBody,
  applyDiscount1Body,
} from '@/shared/api/generated/order/zod';

// === ЕКСПОРТ ТИПІВ З ORVAL СХЕМ ===

// Типи клієнтів
export type ClientData = z.infer<typeof getClientById200Response>;
export type ClientSearchResultItem = z.infer<typeof searchClients200Response>;

// Типи філій
export type BranchData = z.infer<typeof getBranchLocationById200Response>;
export type BranchListItem = z.infer<typeof getAllBranchLocations200Response>;

// Типи предметів замовлення
export type OrderItemData = z.infer<typeof getOrderItem200Response>;
export type OrderItemUpdate = z.infer<typeof updateOrderItemBody>;
export type OrderItemListItem = z.infer<typeof getOrderItems200Response>;

// Enum типи з orval
export type ExpediteType = z.infer<typeof calculateCompletionDateBody>['expediteType'];
export type DiscountType = z.infer<typeof applyDiscount1Body>['discountType'];
