import { BranchLocationsApiService, BranchLocationDTO } from '@/lib/api';

import { BranchEntity } from '../entities';
import { IBranchRepository } from './branch-repository.interface';
import {
  CreateBranchFormData,
  UpdateBranchFormData,
  BranchSearchParams,
  BranchSearchResult,
} from '../types';
import { BranchAdapter } from '../utils';

/**
 * Репозиторій для роботи з приймальними пунктами
 * Реалізує Repository Pattern та використовує Adapter Pattern для перетворення типів
 * Відповідає принципу Dependency Inversion - залежить від абстракцій (інтерфейсів), а не конкретних реалізацій
 */
export class BranchRepository implements IBranchRepository {
  private readonly ERROR_PREFIX = 'Помилка';
  private readonly UNKNOWN_ERROR = 'Невідома помилка';

  /**
   * Отримує приймальний пункт за ID
   */
  async getById(id: string): Promise<BranchEntity> {
    try {
      const response = await BranchLocationsApiService.getBranchLocationById({
        id: id,
      });
      // Використовуємо адаптер для перетворення API response у доменну сутність
      return BranchAdapter.toDomainEntity(response);
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} отримання приймального пункту: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Отримує приймальний пункт за кодом
   */
  async getByCode(code: string): Promise<BranchEntity> {
    try {
      const response = await BranchLocationsApiService.getBranchLocationByCode({
        code: code,
      });
      // Використовуємо адаптер для перетворення API response у доменну сутність
      return BranchAdapter.toDomainEntity(response);
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} отримання приймального пункту за кодом: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Отримує всі приймальні пункти
   */
  async getAll(activeOnly = false): Promise<BranchEntity[]> {
    try {
      const response = await BranchLocationsApiService.getAllBranchLocations({
        active: activeOnly ? true : undefined,
      });

      // API повертає список BranchLocationDTO
      // Перевіряємо чи це масив (бекенд повертає List<BranchLocationDTO>)
      const locations: BranchLocationDTO[] = Array.isArray(response) ? response : [response];

      return BranchAdapter.toDomainEntities(locations);
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} отримання приймальних пунктів: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Пошук приймальних пунктів за параметрами
   */
  async search(params: BranchSearchParams): Promise<BranchSearchResult> {
    try {
      // Отримуємо всі пункти з урахуванням фільтра активності
      const allBranches = await this.getAll(!params.includeInactive);

      // Конвертуємо в доменні об'єкти
      const branches = allBranches.map((entity) => entity.toPlainObject());

      // Фільтруємо за ключовим словом
      const filteredBranches = params.keyword
        ? BranchAdapter.filterByKeyword(branches, params.keyword)
        : branches;

      // Додаткова фільтрація за активністю
      const finalBranches =
        params.active !== undefined
          ? filteredBranches.filter((branch) => branch.active === params.active)
          : filteredBranches;

      return {
        branches: BranchAdapter.sortByName(finalBranches),
        totalCount: finalBranches.length,
        hasActiveBranches: finalBranches.some((branch) => branch.active),
        hasInactiveBranches: finalBranches.some((branch) => !branch.active),
      };
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} пошуку приймальних пунктів: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Створює новий приймальний пункт
   */
  async create(data: CreateBranchFormData): Promise<BranchLocationDTO> {
    try {
      // Використовуємо BranchAdapter для перетворення form data в API request
      const requestData = BranchAdapter.toCreateRequest(data);
      return await BranchLocationsApiService.createBranchLocation({
        requestBody: requestData,
      });
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} створення приймального пункту: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Оновлює існуючий приймальний пункт
   */
  async update(data: UpdateBranchFormData): Promise<BranchLocationDTO> {
    try {
      // Використовуємо BranchAdapter для перетворення form data в API request
      const requestData = BranchAdapter.toUpdateRequest(data);
      return await BranchLocationsApiService.updateBranchLocation({
        id: data.id,
        requestBody: requestData,
      });
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} оновлення приймального пункту: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Змінює статус активності приймального пункту
   */
  async setActiveStatus(id: string, active: boolean): Promise<BranchLocationDTO> {
    try {
      return await BranchLocationsApiService.setActiveStatus({
        id: id,
        active: active,
      });
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} зміни статусу активності: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Видаляє приймальний пункт
   */
  async delete(id: string): Promise<void> {
    try {
      await BranchLocationsApiService.deleteBranchLocation({ id });
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} видалення приймального пункту: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Перевіряє чи існує приймальний пункт з таким кодом
   */
  async existsByCode(code: string, excludeId?: string): Promise<boolean> {
    try {
      const allBranches = await this.getAll();
      return allBranches.some(
        (branch) => branch.code === code && (!excludeId || branch.id !== excludeId)
      );
    } catch {
      // Якщо помилка при перевірці, повертаємо false
      return false;
    }
  }

  /**
   * Отримує активні приймальні пункти для вибору
   */
  async getActiveForSelection(): Promise<BranchEntity[]> {
    try {
      const branches = await this.getAll(true); // Тільки активні
      return branches.sort((a, b) => a.name.localeCompare(b.name, 'uk'));
    } catch (error) {
      throw new Error(
        `${this.ERROR_PREFIX} отримання активних приймальних пунктів: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`
      );
    }
  }
}
