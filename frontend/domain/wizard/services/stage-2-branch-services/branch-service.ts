/**
 * @fileoverview BranchService - доменний сервіс для роботи з філіями
 * @module domain/wizard/services
 */

import { getAllBranches } from '../../adapters/branch/branch.api';

import type { Branch } from '../../types';

/**
 * Результат операції з філіями
 */
export interface BranchOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}

/**
 * Параметри пошуку філій
 */
export interface BranchSearchParams {
  keyword?: string;
  activeOnly?: boolean;
  includeInactive?: boolean;
}

/**
 * Результат пошуку філій
 */
export interface BranchSearchResult {
  branches: Branch[];
  total: number;
  hasMore: boolean;
}

/**
 * BranchService - доменний сервіс для роботи з філіями
 *
 * Відповідальність:
 * - Завантаження та фільтрація філій
 * - Пошук філій за критеріями
 * - Валідація вибору філії
 * - Бізнес-правила для філій
 */
export class BranchService {
  private cachedBranches: Branch[] = [];
  private lastCacheUpdate: Date | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 хвилин

  /**
   * Завантаження всіх активних філій
   */
  async loadActiveBranches(): Promise<BranchOperationResult<Branch[]>> {
    try {
      // Перевіряємо кеш
      if (this.isCacheValid()) {
        const activeBranches = this.cachedBranches.filter((branch) => branch.active);
        return {
          success: true,
          data: activeBranches,
        };
      }

      // Завантажуємо з API
      const branches = await getAllBranches();

      // Оновлюємо кеш
      this.cachedBranches = branches;
      this.lastCacheUpdate = new Date();

      // Фільтруємо тільки активні
      const activeBranches = branches.filter((branch) => branch.active);

      return {
        success: true,
        data: activeBranches,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка завантаження філій: ${error instanceof Error ? error.message : 'Невідома помилка'}`,
      };
    }
  }

  /**
   * Завантаження всіх філій (включно з неактивними)
   */
  async loadAllBranches(): Promise<BranchOperationResult<Branch[]>> {
    try {
      // Перевіряємо кеш
      if (this.isCacheValid()) {
        return {
          success: true,
          data: this.cachedBranches,
        };
      }

      // Завантажуємо з API
      const branches = await getAllBranches();

      // Оновлюємо кеш
      this.cachedBranches = branches;
      this.lastCacheUpdate = new Date();

      return {
        success: true,
        data: branches,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка завантаження філій: ${error instanceof Error ? error.message : 'Невідома помилка'}`,
      };
    }
  }

  /**
   * Пошук філій за ключовим словом
   */
  async searchBranches(
    params: BranchSearchParams
  ): Promise<BranchOperationResult<BranchSearchResult>> {
    try {
      // Спочатку завантажуємо всі філії
      const loadResult = params.includeInactive
        ? await this.loadAllBranches()
        : await this.loadActiveBranches();

      if (!loadResult.success || !loadResult.data) {
        return {
          success: false,
          error: loadResult.error || 'Не вдалося завантажити філії',
        };
      }

      let filteredBranches = loadResult.data;

      // Фільтруємо за ключовим словом
      if (params.keyword && params.keyword.trim()) {
        const keyword = params.keyword.toLowerCase().trim();
        filteredBranches = filteredBranches.filter(
          (branch) =>
            branch.name.toLowerCase().includes(keyword) ||
            branch.address.toLowerCase().includes(keyword) ||
            branch.code.toLowerCase().includes(keyword) ||
            (branch.phone && branch.phone.toLowerCase().includes(keyword))
        );
      }

      // Фільтруємо за статусом активності
      if (params.activeOnly) {
        filteredBranches = filteredBranches.filter((branch) => branch.active);
      }

      return {
        success: true,
        data: {
          branches: filteredBranches,
          total: filteredBranches.length,
          hasMore: false, // Поки що завантажуємо всі результати
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка пошуку філій: ${error instanceof Error ? error.message : 'Невідома помилка'}`,
      };
    }
  }

  /**
   * Знаходження філії за ID
   */
  async findBranchById(id: string): Promise<BranchOperationResult<Branch | null>> {
    try {
      // Спочатку шукаємо в кеші
      if (this.isCacheValid()) {
        const branch = this.cachedBranches.find((b) => b.id === id);
        return {
          success: true,
          data: branch || null,
        };
      }

      // Завантажуємо всі філії
      const loadResult = await this.loadAllBranches();
      if (!loadResult.success || !loadResult.data) {
        return {
          success: false,
          error: loadResult.error || 'Не вдалося завантажити філії',
        };
      }

      const branch = loadResult.data.find((b) => b.id === id);
      return {
        success: true,
        data: branch || null,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка пошуку філії: ${error instanceof Error ? error.message : 'Невідома помилка'}`,
      };
    }
  }

  /**
   * Валідація вибору філії для замовлення
   */
  validateBranchForOrder(branch: Branch | null): BranchOperationResult<boolean> {
    if (!branch) {
      return {
        success: false,
        error: 'Філія не вибрана',
      };
    }

    if (!branch.active) {
      return {
        success: false,
        error: 'Вибрана філія неактивна',
        warnings: ['Неактивні філії не можуть приймати нові замовлення'],
      };
    }

    if (!branch.name || !branch.address) {
      return {
        success: false,
        error: 'Неповна інформація про філію',
      };
    }

    return {
      success: true,
      data: true,
    };
  }

  /**
   * Перевірка чи філія може приймати замовлення
   */
  canAcceptOrders(branch: Branch): boolean {
    return branch.active && !!branch.name && !!branch.address;
  }

  /**
   * Форматування філії для відображення
   */
  formatBranchForDisplay(branch: Branch): string {
    const parts = [branch.name];

    if (branch.address) {
      parts.push(branch.address);
    }

    if (branch.phone) {
      parts.push(`тел: ${branch.phone}`);
    }

    return parts.join(' • ');
  }

  /**
   * Очищення кешу
   */
  clearCache(): void {
    this.cachedBranches = [];
    this.lastCacheUpdate = null;
  }

  /**
   * Перевірка валідності кешу
   */
  private isCacheValid(): boolean {
    if (!this.lastCacheUpdate || this.cachedBranches.length === 0) {
      return false;
    }

    const now = new Date();
    const timeDiff = now.getTime() - this.lastCacheUpdate.getTime();
    return timeDiff < this.CACHE_TTL;
  }

  /**
   * Отримання статистики кешу (для діагностики)
   */
  getCacheStats() {
    return {
      cachedCount: this.cachedBranches.length,
      lastUpdate: this.lastCacheUpdate,
      isValid: this.isCacheValid(),
      ttl: this.CACHE_TTL,
    };
  }
}
