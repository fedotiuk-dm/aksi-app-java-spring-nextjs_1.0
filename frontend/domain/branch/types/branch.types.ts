/**
 * Типи для домену Branch (Приймальний пункт)
 * Згідно з DDD принципами - відображає бізнес-поняття предметної області
 */

/**
 * Доменний інтерфейс для приймального пункту
 * Адаптований з BranchLocationDTO але з доменною логікою
 */
export interface Branch {
  id?: string;
  name: string;
  address: string;
  phone?: string;
  code: string;
  active: boolean;
  displayName?: string; // Форматоване найменування для UI
  isOperational?: boolean; // Бізнес-логіка: чи працює пункт
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Критерії пошуку приймальних пунктів
 */
export interface BranchSearchParams {
  keyword?: string;
  active?: boolean;
  includeInactive?: boolean;
}

/**
 * Результат пошуку приймальних пунктів
 */
export interface BranchSearchResult {
  branches: Branch[];
  totalCount: number;
  hasActiveBranches: boolean;
  hasInactiveBranches: boolean;
}

/**
 * Результат операцій з приймальними пунктами
 */
export interface BranchOperationResult {
  branch: Branch | null;
  errors: BranchOperationErrors | null;
}

/**
 * Помилки операцій з приймальними пунктами
 */
export interface BranchOperationErrors {
  general?: string;
  name?: string;
  address?: string;
  phone?: string;
  code?: string;
}

/**
 * Статистика по приймальному пункту
 */
export interface BranchStatistics {
  branchId: string;
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  averageProcessingTime?: number; // в годинах
}
