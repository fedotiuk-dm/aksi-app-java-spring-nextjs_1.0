/**
 * Сутність елемента прайс-листа
 * Містить бізнес-логіку для роботи з ціноутворенням на основі елементів прайс-листа
 */

import type {
  PriceListItem as IPriceListItem,
  PriceListItemId,
  ServiceCategoryId,
} from '../types/pricing.types';

export class PriceListItemEntity implements IPriceListItem {
  public readonly id: PriceListItemId;
  public readonly categoryId: ServiceCategoryId;
  public readonly catalogNumber?: number;
  public readonly name: string;
  public readonly unitOfMeasure: string;
  public readonly basePrice: number;
  public readonly priceBlack?: number;
  public readonly priceColor?: number;
  public readonly active: boolean;

  constructor(data: IPriceListItem) {
    this.id = data.id;
    this.categoryId = data.categoryId;
    this.catalogNumber = data.catalogNumber;
    this.name = data.name;
    this.unitOfMeasure = data.unitOfMeasure;
    this.basePrice = data.basePrice;
    this.priceBlack = data.priceBlack;
    this.priceColor = data.priceColor;
    this.active = data.active;

    this.validateEntity();
  }

  /**
   * Валідація сутності
   */
  private validateEntity(): void {
    if (!this.id) {
      throw new Error('PriceListItem ID не може бути порожнім');
    }

    if (!this.name?.trim()) {
      throw new Error('Назва предмета не може бути порожньою');
    }

    if (!this.unitOfMeasure?.trim()) {
      throw new Error('Одиниця виміру не може бути порожньою');
    }

    if (this.basePrice < 0) {
      throw new Error("Базова ціна не може бути від'ємною");
    }

    if (this.priceBlack !== undefined && this.priceBlack < 0) {
      throw new Error("Ціна для чорних речей не може бути від'ємною");
    }

    if (this.priceColor !== undefined && this.priceColor < 0) {
      throw new Error("Ціна для кольорових речей не може бути від'ємною");
    }
  }

  /**
   * Отримати ціну в залежності від кольору
   */
  public getPriceByColor(color?: string): number {
    if (!color) {
      return this.basePrice;
    }

    const normalizedColor = color.toLowerCase().trim();

    // Перевіряємо чи це чорний колір
    if (this.isBlackColor(normalizedColor)) {
      return this.priceBlack ?? this.basePrice;
    }

    // Для всіх інших кольорів
    return this.priceColor ?? this.basePrice;
  }

  /**
   * Перевірити чи колір є чорним
   */
  private isBlackColor(color: string): boolean {
    const blackColors = [
      'чорний',
      'black',
      'чёрный',
      'темно-чорний',
      'глибокий чорний',
      'вугільний',
      'coal',
    ];

    return blackColors.some((blackColor) => color.includes(blackColor.toLowerCase()));
  }

  /**
   * Перевірити чи предмет має спеціальні ціни для кольорів
   */
  public hasColorPricing(): boolean {
    return this.priceBlack !== undefined || this.priceColor !== undefined;
  }

  /**
   * Отримати інформацію про ціноутворення
   */
  public getPricingInfo(): {
    hasColorPricing: boolean;
    basePrice: number;
    blackPrice?: number;
    colorPrice?: number;
    priceRange: { min: number; max: number };
  } {
    const prices = [this.basePrice];

    if (this.priceBlack !== undefined) {
      prices.push(this.priceBlack);
    }

    if (this.priceColor !== undefined) {
      prices.push(this.priceColor);
    }

    return {
      hasColorPricing: this.hasColorPricing(),
      basePrice: this.basePrice,
      blackPrice: this.priceBlack,
      colorPrice: this.priceColor,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
      },
    };
  }

  /**
   * Розрахувати вартість для заданої кількості
   */
  public calculateTotalPrice(quantity: number, color?: string): number {
    if (quantity < 0) {
      throw new Error("Кількість не може бути від'ємною");
    }

    const unitPrice = this.getPriceByColor(color);
    return Number((unitPrice * quantity).toFixed(2));
  }

  /**
   * Перевірити чи предмет активний
   */
  public isActive(): boolean {
    return this.active;
  }

  /**
   * Отримати відформатовану назву для відображення
   */
  public getDisplayName(): string {
    const catalogPrefix = this.catalogNumber ? `${this.catalogNumber}. ` : '';
    return `${catalogPrefix}${this.name}`;
  }

  /**
   * Отримати повний опис предмета
   */
  public getFullDescription(): string {
    const pricingInfo = this.getPricingInfo();
    let description = `${this.getDisplayName()} (${this.unitOfMeasure})`;

    if (pricingInfo.hasColorPricing) {
      description += ` - від ${pricingInfo.priceRange.min} до ${pricingInfo.priceRange.max} грн`;
    } else {
      description += ` - ${pricingInfo.basePrice} грн/${this.unitOfMeasure}`;
    }

    return description;
  }

  /**
   * Клонувати сутність з новими даними
   */
  public clone(updates: Partial<IPriceListItem>): PriceListItemEntity {
    return new PriceListItemEntity({
      ...this,
      ...updates,
    });
  }

  /**
   * Порівняти з іншою сутністю
   */
  public equals(other: PriceListItemEntity): boolean {
    return this.id === other.id;
  }

  /**
   * Конвертувати в простий об'єкт
   */
  public toJSON(): IPriceListItem {
    return {
      id: this.id,
      categoryId: this.categoryId,
      catalogNumber: this.catalogNumber,
      name: this.name,
      unitOfMeasure: this.unitOfMeasure,
      basePrice: this.basePrice,
      priceBlack: this.priceBlack,
      priceColor: this.priceColor,
      active: this.active,
    };
  }
}
