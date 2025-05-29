import { z } from 'zod';

import {
  getAllBranchLocations200Response,
  getAllBranchLocationsQueryParams,
} from '@/shared/api/generated/branch/zod';

import { BaseWizardService } from '../../base.service';

import type { BranchData } from '../../../types';

/**
 * Сервіс для бізнес-логіки вибору філії
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація вибору філії через Zod схеми
 * - Фільтрація та сортування філій
 * - Бізнес-правила для вибору філії
 * - Перетворення API типів в доменні типи
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 */

// Використовуємо orval схеми напряму
export type BranchLocationDTO = z.infer<typeof getAllBranchLocations200Response>;

// Локальна композитна схема для фільтрації (розширює API параметри)
const branchFilterSchema = getAllBranchLocationsQueryParams.extend({
  searchTerm: z.string().optional(),
  region: z.string().optional(),
  sortBy: z.enum(['name', 'code', 'address']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type BranchFilterCriteria = z.infer<typeof branchFilterSchema>;

// Локальна схема для валідації вибору (тільки для внутрішніх потреб сервісу)
const branchSelectionSchema = z.object({
  selectedBranchId: z.string().min(1, 'Необхідно вибрати філію'),
  selectedBranch: getAllBranchLocations200Response,
});

export interface BranchSelectionResult {
  isValid: boolean;
  errors: string[];
  selectedBranch?: BranchData;
}

export class BranchSelectionService extends BaseWizardService {
  protected readonly serviceName = 'BranchSelectionService';

  /**
   * Перетворення API типу в доменний тип
   */
  mapApiToDomain(branchDto: BranchLocationDTO): BranchData {
    return {
      id: branchDto.id || '',
      name: branchDto.name || '',
      address: branchDto.address || '',
      phone: branchDto.phone,
      code: branchDto.code || '',
      active: branchDto.active ?? true,
      createdAt: branchDto.createdAt || new Date().toISOString(),
      updatedAt: branchDto.updatedAt || new Date().toISOString(),
    };
  }

  /**
   * Валідація вибору філії через Zod схему
   */
  validateBranchSelection(branchId: string, branches: BranchData[]): BranchSelectionResult {
    const errors: string[] = [];

    if (!branchId.trim()) {
      errors.push('Необхідно вибрати пункт прийому');
    }

    const selectedBranch = branches.find((b) => b.id === branchId);

    if (!selectedBranch) {
      errors.push('Вибрана філія не знайдена');
    } else {
      if (!selectedBranch.active) {
        errors.push('Вибрана філія неактивна');
      }

      // Додаткова валідація через локальну Zod схему
      try {
        branchSelectionSchema.parse({
          selectedBranchId: branchId,
          selectedBranch: selectedBranch,
        });
      } catch (zodError) {
        if (zodError instanceof z.ZodError) {
          errors.push(...zodError.errors.map((e) => e.message));
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      selectedBranch,
    };
  }

  /**
   * Валідація критеріїв фільтрації через локальну Zod схему
   */
  validateFilterCriteria(criteria: Partial<BranchFilterCriteria>): {
    isValid: boolean;
    errors: string[];
    validatedCriteria?: BranchFilterCriteria;
  } {
    try {
      const validatedCriteria = branchFilterSchema.parse(criteria);
      return {
        isValid: true,
        errors: [],
        validatedCriteria,
      };
    } catch (zodError) {
      const errors =
        zodError instanceof z.ZodError
          ? zodError.errors.map((e) => `${e.path.join('.')}: ${e.message}`)
          : ['Невідома помилка валідації'];

      return {
        isValid: false,
        errors,
      };
    }
  }

  /**
   * Фільтрація філій за критеріями
   */
  filterBranches(branches: BranchData[], criteria: BranchFilterCriteria): BranchData[] {
    let result = [...branches];

    // Фільтр по активності (з orval схеми)
    if (criteria.active !== undefined) {
      result = result.filter((branch) => branch.active === criteria.active);
    }

    // Фільтр по пошуку (локальне розширення)
    if (criteria.searchTerm?.trim()) {
      const term = criteria.searchTerm.toLowerCase();
      result = result.filter(
        (branch) =>
          branch.name.toLowerCase().includes(term) ||
          branch.address.toLowerCase().includes(term) ||
          branch.code.toLowerCase().includes(term)
      );
    }

    // Сортування (локальне розширення)
    if (criteria.sortBy) {
      result.sort((a, b) => {
        let aValue = '';
        let bValue = '';

        switch (criteria.sortBy) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'code':
            aValue = a.code;
            bValue = b.code;
            break;
          case 'address':
            aValue = a.address;
            bValue = b.address;
            break;
        }

        const comparison = aValue.localeCompare(bValue, 'uk');
        return criteria.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }

  /**
   * Рекомендація філії на основі адреси клієнта
   */
  recommendBranchByAddress(clientAddress: string, branches: BranchData[]): BranchData | null {
    if (!clientAddress.trim() || branches.length === 0) {
      return null;
    }

    const addressLower = clientAddress.toLowerCase();

    // Шукаємо за містом в адресі
    const cityMatches = branches.filter((branch) => {
      const branchAddress = branch.address.toLowerCase();
      // Простий пошук спільних слів
      const addressWords = addressLower.split(/\s+/);
      const branchWords = branchAddress.split(/\s+/);

      return addressWords.some(
        (word) =>
          word.length > 3 && branchWords.some((branchWord: string) => branchWord.includes(word))
      );
    });

    if (cityMatches.length > 0) {
      // Повертаємо першу активну
      return cityMatches.find((branch) => branch.active) || cityMatches[0];
    }

    return null;
  }

  /**
   * Отримання статистики філій
   */
  getBranchStatistics(branches: BranchData[]) {
    return {
      total: branches.length,
      active: branches.filter((b) => b.active).length,
      inactive: branches.filter((b) => !b.active).length,
      hasPhone: branches.filter((b) => !!b.phone).length,
    };
  }

  /**
   * Перевірка чи можна використовувати філію для нового замовлення
   */
  canUseForNewOrder(branch: BranchData): { canUse: boolean; reason?: string } {
    if (!branch.active) {
      return { canUse: false, reason: 'Філія неактивна' };
    }

    if (!branch.code) {
      return { canUse: false, reason: 'Відсутній код філії' };
    }

    return { canUse: true };
  }
}
