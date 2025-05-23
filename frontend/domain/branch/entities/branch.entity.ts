import type { Branch } from '../types';

/**
 * Доменна сутність приймального пункту
 * Реалізує бізнес-логіку та правила предметної області
 *
 * Принципи DDD:
 * - Інкапсулює бізнес-логіку
 * - Забезпечує валідацію
 * - Містить доменні методи
 */
export class BranchEntity implements Branch {
  public readonly id?: string;
  public readonly name: string;
  public readonly address: string;
  public readonly phone?: string;
  public readonly code: string;
  public readonly active: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(data: Branch) {
    this.id = data.id;
    this.name = data.name;
    this.address = data.address;
    this.phone = data.phone;
    this.code = data.code;
    this.active = data.active;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;

    // Валідація при створенні
    this.validateEntity();
  }

  /**
   * Валідація доменної сутності
   */
  private validateEntity(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Назва приймального пункту не може бути порожньою');
    }

    if (!this.address || this.address.trim().length === 0) {
      throw new Error('Адреса приймального пункту не може бути порожньою');
    }

    if (!this.code || this.code.trim().length === 0) {
      throw new Error('Код приймального пункту не може бути порожнім');
    }

    if (this.code && !/^[A-Z0-9]{2,5}$/.test(this.code)) {
      throw new Error('Код пункту повинен містити від 2 до 5 великих літер або цифр');
    }

    if (this.phone && !/^\+?[0-9\s-()]{10,15}$/.test(this.phone)) {
      throw new Error('Некоректний формат телефону');
    }
  }

  /**
   * Отримує відформатоване найменування для UI
   */
  get displayName(): string {
    const status = this.active ? '' : ' (Неактивний)';
    return `${this.name} [${this.code}]${status}`;
  }

  /**
   * Перевіряє чи працює приймальний пункт
   */
  get isOperational(): boolean {
    return this.active;
  }

  /**
   * Отримує скорочене найменування
   */
  get shortName(): string {
    return `${this.code} - ${this.name}`;
  }

  /**
   * Перевіряє чи підходить пункт під пошукові критерії
   */
  matchesSearchCriteria(keyword: string): boolean {
    if (!keyword) return true;

    const searchTerm = keyword.toLowerCase();
    return (
      this.name.toLowerCase().includes(searchTerm) ||
      this.code.toLowerCase().includes(searchTerm) ||
      this.address.toLowerCase().includes(searchTerm) ||
      (this.phone ? this.phone.toLowerCase().includes(searchTerm) : false)
    );
  }

  /**
   * Створює копію сутності з оновленими даними
   */
  update(updates: Partial<Branch>): BranchEntity {
    return new BranchEntity({
      ...this,
      ...updates,
      updatedAt: new Date(),
    });
  }

  /**
   * Активує приймальний пункт
   */
  activate(): BranchEntity {
    return this.update({ active: true });
  }

  /**
   * Деактивує приймальний пункт
   */
  deactivate(): BranchEntity {
    return this.update({ active: false });
  }

  /**
   * Перетворює сутність на простий об'єкт
   */
  toPlainObject(): Branch {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      phone: this.phone,
      code: this.code,
      active: this.active,
      displayName: this.displayName,
      isOperational: this.isOperational,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Порівнює дві сутності за ID
   */
  equals(other: BranchEntity): boolean {
    return this.id !== undefined && this.id === other.id;
  }
}
