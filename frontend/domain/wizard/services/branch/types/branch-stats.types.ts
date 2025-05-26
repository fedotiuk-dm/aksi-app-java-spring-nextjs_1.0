/**
 * @fileoverview Типи статистики філій
 * @module domain/wizard/services/branch/types/branch-stats
 */

/**
 * Статистика філії
 */
export interface BranchStatsDomain {
  branchId: string;
  branchName: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  topServices: Array<{
    serviceId: string;
    serviceName: string;
    orderCount: number;
    revenue: number;
  }>;
  monthlyStats: Array<{
    month: string;
    ordersCount: number;
    revenue: number;
  }>;
}
