import { z } from 'zod';

import type { BranchLocationDTO } from '@/shared/api/generated/client/aksiApi.schemas';

/**
 * Мінімалістичний сервіс для роботи з філіями
 * Тільки бізнес-логіка, без API викликів
 */
export class BranchService {
  /**
   * Валідація вибору філії
   */
  validateBranchSelection(branchId: string): { isValid: boolean; error?: string } {
    if (!branchId?.trim()) {
      return { isValid: false, error: 'Необхідно вибрати пункт прийому' };
    }
    return { isValid: true };
  }

  /**
   * Перевірка активності філії
   */
  isBranchActive(branch: BranchLocationDTO): boolean {
    return branch.active === true;
  }

  /**
   * Фільтрація філій за пошуковим терміном
   */
  filterBranches(branches: BranchLocationDTO[], searchTerm: string): BranchLocationDTO[] {
    if (!searchTerm?.trim()) return branches;

    const term = searchTerm.toLowerCase();
    return branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(term) ||
        branch.address.toLowerCase().includes(term) ||
        branch.code.toLowerCase().includes(term)
    );
  }

  /**
   * Сортування філій
   */
  sortBranches(
    branches: BranchLocationDTO[],
    sortBy: 'name' | 'code' | 'address' = 'name'
  ): BranchLocationDTO[] {
    return [...branches].sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      return aValue.localeCompare(bValue);
    });
  }

  /**
   * Знайти філію за ID
   */
  findBranchById(branches: BranchLocationDTO[], id: string): BranchLocationDTO | undefined {
    return branches.find((branch) => branch.id === id);
  }
}
