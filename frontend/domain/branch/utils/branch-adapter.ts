import {
  BranchLocationDTO,
  BranchLocationCreateRequest,
  BranchLocationUpdateRequest,
} from '@/lib/api';

import { BranchEntity } from '../entities';
import { Branch, CreateBranchFormData, UpdateBranchFormData } from '../types';

/**
 * Адаптер для перетворення між API типами та доменними типами
 * Реалізує Adapter Pattern та Dependency Inversion Principle
 * Вирішує проблему конфлікту типів між API та доменом
 */
export class BranchAdapter {
  /**
   * Перетворює BranchLocationDTO з API на доменну сутність BranchEntity
   */
  static toDomainEntity(apiResponse: BranchLocationDTO): BranchEntity {
    return new BranchEntity({
      id: apiResponse.id,
      name: apiResponse.name,
      address: apiResponse.address,
      phone: apiResponse.phone || undefined,
      code: apiResponse.code,
      active: apiResponse.active ?? true,
      createdAt: apiResponse.createdAt ? new Date(apiResponse.createdAt) : undefined,
      updatedAt: apiResponse.updatedAt ? new Date(apiResponse.updatedAt) : undefined,
    });
  }

  /**
   * Перетворює BranchLocationDTO з API на доменний інтерфейс Branch
   */
  static toDomain(apiResponse: BranchLocationDTO): Branch {
    return {
      id: apiResponse.id,
      name: apiResponse.name,
      address: apiResponse.address,
      phone: apiResponse.phone || undefined,
      code: apiResponse.code,
      active: apiResponse.active ?? true,
      displayName: this.createDisplayName(apiResponse),
      isOperational: apiResponse.active ?? true,
      createdAt: apiResponse.createdAt ? new Date(apiResponse.createdAt) : undefined,
      updatedAt: apiResponse.updatedAt ? new Date(apiResponse.updatedAt) : undefined,
    };
  }

  /**
   * Перетворює масив BranchLocationDTO на масив доменних сутностей
   */
  static toDomainEntities(apiResponses: BranchLocationDTO[]): BranchEntity[] {
    return apiResponses.map((response) => this.toDomainEntity(response));
  }

  /**
   * Перетворює масив BranchLocationDTO на масив доменних об'єктів
   */
  static toDomainBranches(apiResponses: BranchLocationDTO[]): Branch[] {
    return apiResponses.map((response) => this.toDomain(response));
  }

  /**
   * Перетворює доменну сутність BranchEntity на BranchLocationDTO для API
   */
  static toApiResponse(entity: BranchEntity): Partial<BranchLocationDTO> {
    return {
      id: entity.id,
      name: entity.name,
      address: entity.address,
      phone: entity.phone,
      code: entity.code,
      active: entity.active,
      createdAt: entity.createdAt ? entity.createdAt.toISOString() : undefined,
      updatedAt: entity.updatedAt ? entity.updatedAt.toISOString() : undefined,
    };
  }

  /**
   * Перетворює CreateBranchFormData в BranchLocationCreateRequest для API
   */
  static toCreateRequest(formData: CreateBranchFormData): BranchLocationCreateRequest {
    return this.mapFormDataToRequest(formData);
  }

  /**
   * Перетворює UpdateBranchFormData в BranchLocationUpdateRequest для API
   * Відрізняється від toCreateRequest тим що містить ID для ідентифікації
   */
  static toUpdateRequest(formData: UpdateBranchFormData): BranchLocationUpdateRequest {
    return this.mapFormDataToRequest(formData);
  }

  /**
   * Спільна логіка мапінгу form data в API request
   */
  private static mapFormDataToRequest(formData: CreateBranchFormData | UpdateBranchFormData) {
    return {
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      code: formData.code,
      active: formData.active,
    };
  }

  /**
   * Створює відформатоване найменування для відображення
   */
  private static createDisplayName(apiResponse: BranchLocationDTO): string {
    const status = (apiResponse.active ?? true) ? '' : ' (Неактивний)';
    return `${apiResponse.name} [${apiResponse.code}]${status}`;
  }

  /**
   * Фільтрує активні приймальні пункти
   */
  static filterActive(branches: Branch[]): Branch[] {
    return branches.filter((branch) => branch.active);
  }

  /**
   * Фільтрує приймальні пункти за ключовим словом
   */
  static filterByKeyword(branches: Branch[], keyword: string): Branch[] {
    if (!keyword.trim()) return branches;

    const searchTerm = keyword.toLowerCase();
    return branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(searchTerm) ||
        branch.code.toLowerCase().includes(searchTerm) ||
        branch.address.toLowerCase().includes(searchTerm) ||
        (branch.phone && branch.phone.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Сортує приймальні пункти за найменуванням
   */
  static sortByName(branches: Branch[]): Branch[] {
    return [...branches].sort((a, b) => a.name.localeCompare(b.name, 'uk'));
  }

  /**
   * Сортує приймальні пункти за кодом
   */
  static sortByCode(branches: Branch[]): Branch[] {
    return [...branches].sort((a, b) => a.code.localeCompare(b.code));
  }

  /**
   * Знаходить приймальний пункт за кодом
   */
  static findByCode(branches: Branch[], code: string): Branch | undefined {
    return branches.find((branch) => branch.code === code);
  }

  /**
   * Знаходить приймальний пункт за ID
   */
  static findById(branches: Branch[], id: string): Branch | undefined {
    return branches.find((branch) => branch.id === id);
  }
}
