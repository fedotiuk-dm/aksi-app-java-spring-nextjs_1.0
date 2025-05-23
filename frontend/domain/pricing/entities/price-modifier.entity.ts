/**
 * Сутність модифікатора ціни
 * Містить бізнес-логіку для застосування модифікаторів до базової ціни
 */

import { ModifierCategory, ModifierType } from '../types/pricing.types';

import type { PriceModifier as IPriceModifier, ModifierCode } from '../types/pricing.types';

export class PriceModifierEntity implements IPriceModifier {
  public readonly id: string;
  public readonly code: ModifierCode;
  public readonly name: string;
  public readonly description?: string;
  public readonly category: ModifierCategory;
  public readonly appliesTo: string[];
  public readonly type: ModifierType;
  public readonly value: number;
  public readonly active: boolean;

  constructor(data: IPriceModifier) {
    this.id = data.id;
    this.code = data.code;
    this.name = data.name;
    this.description = data.description;
    this.category = data.category;
    this.appliesTo = [...(data.appliesTo || [])];
    this.type = data.type;
    this.value = data.value;
    this.active = data.active;

    this.validateEntity();
  }

  /**
   * Валідація сутності
   */
  private validateEntity(): void {
    if (!this.id) {
      throw new Error('PriceModifier ID не може бути порожнім');
    }

    if (!this.code?.trim()) {
      throw new Error('Код модифікатора не може бути порожнім');
    }

    if (!this.name?.trim()) {
      throw new Error('Назва модифікатора не може бути порожньою');
    }

    if (!Object.values(ModifierCategory).includes(this.category)) {
      throw new Error('Невалідна категорія модифікатора');
    }

    if (!Object.values(ModifierType).includes(this.type)) {
      throw new Error('Невалідний тип модифікатора');
    }

    this.validateValueByType();
  }

  /**
   * Валідація значення в залежності від типу
   */
  private validateValueByType(): void {
    switch (this.type) {
      case ModifierType.PERCENTAGE:
        // Відсотки можуть бути від -100% до необмеженого числа
        if (this.value < -100) {
          throw new Error('Відсоток не може бути менше -100%');
        }
        break;

      case ModifierType.FIXED_AMOUNT:
        // Фіксована сума може бути будь-якою (включаючи від'ємну для знижок)
        break;

      case ModifierType.RANGE:
        if (this.value < 0) {
          throw new Error("Діапазон не може бути від'ємним");
        }
        break;

      default:
        throw new Error('Невідомий тип модифікатора');
    }
  }

  /**
   * Застосувати модифікатор до базової ціни
   */
  public apply(basePrice: number, quantity: number = 1): number {
    if (basePrice < 0) {
      throw new Error("Базова ціна не може бути від'ємною");
    }

    if (quantity <= 0) {
      throw new Error('Кількість повинна бути більше 0');
    }

    switch (this.type) {
      case ModifierType.PERCENTAGE:
        return this.applyPercentage(basePrice);

      case ModifierType.FIXED_AMOUNT:
        return this.applyFixedAmount(quantity);

      case ModifierType.RANGE:
        return this.applyRange(basePrice);

      default:
        throw new Error('Невідомий тип модифікатора');
    }
  }

  /**
   * Застосувати відсотковий модифікатор
   */
  private applyPercentage(basePrice: number): number {
    return (basePrice * this.value) / 100;
  }

  /**
   * Застосувати фіксований модифікатор
   */
  private applyFixedAmount(quantity: number): number {
    return this.value * quantity;
  }

  /**
   * Застосувати діапазонний модифікатор (поки як відсоток)
   */
  private applyRange(basePrice: number): number {
    // TODO: Реалізувати логіку діапазону
    return this.applyPercentage(basePrice);
  }

  /**
   * Перевірити чи модифікатор застосовується до категорії
   */
  public appliesToCategory(categoryCode: string): boolean {
    if (this.appliesTo.length === 0) {
      // Якщо не вказано категорії, застосовується до всіх
      return true;
    }

    return this.appliesTo.includes(categoryCode);
  }

  /**
   * Перевірити чи модифікатор є загальним
   */
  public isGeneral(): boolean {
    return this.category === ModifierCategory.GENERAL;
  }

  /**
   * Перевірити чи модифікатор є текстильним
   */
  public isTextile(): boolean {
    return this.category === ModifierCategory.TEXTILE;
  }

  /**
   * Перевірити чи модифікатор є шкіряним
   */
  public isLeather(): boolean {
    return this.category === ModifierCategory.LEATHER;
  }

  /**
   * Перевірити чи модифікатор активний
   */
  public isActive(): boolean {
    return this.active;
  }

  /**
   * Отримати відформатований опис модифікатора
   */
  public getDisplayDescription(): string {
    let description = this.name;

    if (this.type === ModifierType.PERCENTAGE) {
      const sign = this.value >= 0 ? '+' : '';
      description += ` (${sign}${this.value}%)`;
    } else if (this.type === ModifierType.FIXED_AMOUNT) {
      const sign = this.value >= 0 ? '+' : '';
      description += ` (${sign}${this.value} грн)`;
    }

    return description;
  }

  /**
   * Отримати короткий опис впливу на ціну
   */
  public getPriceImpactDescription(basePrice: number, quantity: number = 1): string {
    const impact = this.apply(basePrice, quantity);
    const sign = impact >= 0 ? '+' : '';

    if (this.type === ModifierType.PERCENTAGE) {
      return `${sign}${this.value}% (${sign}${impact.toFixed(2)} грн)`;
    } else {
      return `${sign}${impact.toFixed(2)} грн`;
    }
  }

  /**
   * Перевірити сумісність з іншим модифікатором
   */
  public isCompatibleWith(other: PriceModifierEntity): boolean {
    // Логіка перевірки сумісності (може бути розширена)
    // Поки що просто перевіряємо, що це не той самий модифікатор
    return this.code !== other.code;
  }

  /**
   * Клонувати сутність з новими даними
   */
  public clone(updates: Partial<IPriceModifier>): PriceModifierEntity {
    return new PriceModifierEntity({
      ...this,
      ...updates,
    });
  }

  /**
   * Порівняти з іншою сутністю
   */
  public equals(other: PriceModifierEntity): boolean {
    return this.id === other.id;
  }

  /**
   * Конвертувати в простий об'єкт
   */
  public toJSON(): IPriceModifier {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      description: this.description,
      category: this.category,
      appliesTo: [...this.appliesTo],
      type: this.type,
      value: this.value,
      active: this.active,
    };
  }
}
