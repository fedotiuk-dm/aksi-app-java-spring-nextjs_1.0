import {
  getActiveBranches,
  getBranchById,
  getBranchByCode,
  type WizardBranch,
} from '@/domain/wizard/adapters/branch';
import {
  branchSelectionSchema,
  branchFilterSchema,
  type BranchSelectionData,
  type BranchFilterData,
} from '@/domain/wizard/schemas';

import { BaseWizardService } from '../../base.service';

/**
 * Мінімалістський сервіс для вибору філії
 * Розмір: ~70 рядків (дотримання ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція branch адаптерів для отримання філій
 * - Валідація через централізовані Zod схеми
 * - Мінімальна фільтрація активних філій
 *
 * НЕ дублює:
 * - API виклики (роль branch адаптерів)
 * - Мапінг даних (роль адаптерів)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Схеми валідації (роль централізованих schemas)
 */

export class BranchSelectionService extends BaseWizardService {
  protected readonly serviceName = 'BranchSelectionService';

  /**
   * Композиція: адаптер + фільтрація активних
   */
  async getActiveBranches(): Promise<WizardBranch[]> {
    const result = await getActiveBranches();
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: адаптер + отримання за ID
   */
  async getBranchById(id: string): Promise<WizardBranch | null> {
    const result = await getBranchById(id);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: адаптер + пошук за кодом
   */
  async getBranchByCode(code: string): Promise<WizardBranch | null> {
    const result = await getBranchByCode(code);
    return result.success ? result.data || null : null;
  }

  /**
   * Валідація вибору філії через централізовану схему
   */
  validateBranchSelection(data: unknown) {
    return branchSelectionSchema.safeParse(data);
  }

  /**
   * Валідація фільтра філій через централізовану схему
   */
  validateBranchFilter(data: unknown) {
    return branchFilterSchema.safeParse(data);
  }

  /**
   * Фільтрація філій за пошуком - мінімальна логіка
   * Приймає типізовані параметри
   */
  filterBranches(branches: WizardBranch[], filterData: BranchFilterData): WizardBranch[] {
    const { searchTerm, activeOnly } = filterData;

    let result = branches;

    // Фільтр по активності
    if (activeOnly) {
      result = result.filter((branch) => branch.active);
    }

    // Фільтр по пошуку
    if (searchTerm?.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (branch: WizardBranch) =>
          branch.name.toLowerCase().includes(term) ||
          branch.address.toLowerCase().includes(term) ||
          branch.code.toLowerCase().includes(term)
      );
    }

    return result;
  }

  /**
   * Перевірка чи філія активна
   */
  isBranchActive(branch: WizardBranch): boolean {
    return branch.active;
  }

  /**
   * Перевірка валідності вибору філії
   */
  isValidBranchSelection(data: BranchSelectionData): boolean {
    const validation = this.validateBranchSelection(data);
    return validation.success;
  }
}
