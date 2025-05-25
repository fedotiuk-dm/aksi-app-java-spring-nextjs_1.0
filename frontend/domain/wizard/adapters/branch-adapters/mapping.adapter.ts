/**
 * @fileoverview Адаптер маппінгу branch даних API ↔ Domain
 * @module domain/wizard/adapters/branch-adapters
 */

import type { Branch } from '../../types/wizard-step-states.types';
import type {
  BranchLocationDTO,
  BranchLocationCreateRequest,
  BranchLocationUpdateRequest,
} from '@/lib/api';

export interface BranchCreateRequest {
  code: string;
  name: string;
  address: string;
  phone?: string;
  active?: boolean;
}

export interface BranchUpdateRequest {
  name: string;
  address: string;
  phone?: string;
  code: string;
  active?: boolean;
}

/**
 * Адаптер для маппінгу branch даних між API та Domain
 *
 * Відповідальність:
 * - Перетворення API моделей у доменні типи
 * - Нормалізація даних філій
 * - Валідація та очищення даних
 */
export class BranchMappingAdapter {
  /**
   * Перетворює API філію у доменний тип
   */
  static branchToDomain(apiBranch: BranchLocationDTO): Branch {
    return {
      id: apiBranch.id || '',
      code: apiBranch.code || '',
      name: apiBranch.name || '',
      address: apiBranch.address || '',
      phone: apiBranch.phone || undefined,
      active: apiBranch.active ?? true,
      createdAt: apiBranch.createdAt || new Date().toISOString(),
      updatedAt: apiBranch.updatedAt || new Date().toISOString(),
    };
  }

  /**
   * Перетворює доменний запит створення у API формат
   */
  static branchCreateRequestToApi(domainRequest: BranchCreateRequest): BranchLocationCreateRequest {
    return {
      code: domainRequest.code,
      name: domainRequest.name,
      address: domainRequest.address,
      phone: domainRequest.phone,
      active: domainRequest.active ?? true,
    };
  }

  /**
   * Перетворює доменний запит оновлення у API формат
   */
  static branchUpdateRequestToApi(domainRequest: BranchUpdateRequest): BranchLocationUpdateRequest {
    return {
      name: domainRequest.name,
      address: domainRequest.address,
      phone: domainRequest.phone,
      code: domainRequest.code,
      active: domainRequest.active,
    };
  }

  /**
   * Перетворює масив API філій у доменні типи
   */
  static branchesToDomain(apiBranches: BranchLocationDTO[]): Branch[] {
    return apiBranches.map(this.branchToDomain);
  }

  /**
   * Нормалізує код філії
   */
  static normalizeBranchCode(code: string): string {
    return code.trim().toUpperCase();
  }

  /**
   * Нормалізує номер телефону філії
   */
  static normalizeBranchPhone(phone: string): string {
    // Видаляємо всі символи крім цифр та +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Якщо номер починається з 380, додаємо +
    if (cleaned.startsWith('380') && !cleaned.startsWith('+380')) {
      return '+' + cleaned;
    }

    // Якщо номер починається з 0, замінюємо на +380
    if (cleaned.startsWith('0')) {
      return '+38' + cleaned;
    }

    return cleaned;
  }

  /**
   * Створює відображуване ім'я філії
   */
  static createDisplayName(branch: BranchLocationDTO | Branch): string {
    return `${branch.code} - ${branch.name}`;
  }

  /**
   * Створює короткий опис філії
   */
  static createShortDescription(branch: Branch): string {
    return `${branch.name} (${branch.address})`;
  }

  /**
   * Створює повний опис філії
   */
  static createFullDescription(branch: Branch): string {
    const parts = [branch.name, branch.address];

    if (branch.phone) {
      parts.push(`Тел: ${branch.phone}`);
    }

    return parts.join('\n');
  }

  /**
   * Фільтрує активні філії
   */
  static filterActiveBranches(branches: Branch[]): Branch[] {
    return branches.filter((branch) => branch.active);
  }

  /**
   * Сортує філії за кодом
   */
  static sortBranchesByCode(branches: Branch[]): Branch[] {
    return [...branches].sort((a, b) => a.code.localeCompare(b.code));
  }

  /**
   * Знаходить філію за кодом
   */
  static findBranchByCode(branches: Branch[], code: string): Branch | undefined {
    return branches.find((branch) => branch.code === code);
  }

  /**
   * Валідує код філії
   */
  static validateBranchCode(code: string): boolean {
    // Код повинен бути 2-5 символів, тільки великі літери та цифри
    const codeRegex = /^[A-Z0-9]{2,5}$/;
    return codeRegex.test(code);
  }

  /**
   * Валідує номер телефону
   */
  static validateBranchPhone(phone?: string): boolean {
    if (!phone) return true; // Телефон не обов'язковий

    const phoneRegex = /^\+?[0-9\s\-()]{10,15}$/;
    return phoneRegex.test(phone);
  }
}
