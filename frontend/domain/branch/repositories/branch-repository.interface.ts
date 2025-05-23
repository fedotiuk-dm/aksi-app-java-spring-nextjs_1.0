import { BranchLocationDTO } from '@/lib/api';

import { BranchEntity } from '../entities';
import {
  CreateBranchFormData,
  UpdateBranchFormData,
  BranchSearchParams,
  BranchSearchResult,
} from '../types';

/**
 * Інтерфейс репозиторію для роботи з приймальними пунктами
 * Реалізує Dependency Inversion Principle - високорівневі модулі не залежать від низькорівневих
 * Визначає контракт для доступу до даних без прив'язки до конкретної реалізації
 */
export interface IBranchRepository {
  /**
   * Отримує приймальний пункт за ID
   */
  getById(id: string): Promise<BranchEntity>;

  /**
   * Отримує приймальний пункт за кодом
   */
  getByCode(code: string): Promise<BranchEntity>;

  /**
   * Отримує всі приймальні пункти
   * @param activeOnly - чи повертати тільки активні пункти
   */
  getAll(activeOnly?: boolean): Promise<BranchEntity[]>;

  /**
   * Пошук приймальних пунктів за параметрами
   */
  search(params: BranchSearchParams): Promise<BranchSearchResult>;

  /**
   * Створює новий приймальний пункт
   */
  create(data: CreateBranchFormData): Promise<BranchLocationDTO>;

  /**
   * Оновлює існуючий приймальний пункт
   */
  update(data: UpdateBranchFormData): Promise<BranchLocationDTO>;

  /**
   * Змінює статус активності приймального пункту
   */
  setActiveStatus(id: string, active: boolean): Promise<BranchLocationDTO>;

  /**
   * Видаляє приймальний пункт
   */
  delete(id: string): Promise<void>;

  /**
   * Перевіряє чи існує приймальний пункт з таким кодом
   */
  existsByCode(code: string, excludeId?: string): Promise<boolean>;

  /**
   * Отримує активні приймальні пункти для вибору
   */
  getActiveForSelection(): Promise<BranchEntity[]>;
}
