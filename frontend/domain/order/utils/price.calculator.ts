/**
 * Калькулятор цін для Order домену
 * Реалізує всі бізнес-правила розрахунку вартості хімчистки
 */

import { DiscountType, ExpediteType, MaterialType, WearDegree } from '../types';

import type { OrderItem, OrderItemModifier, OrderItemPriceCalculation } from '../types';

export class PriceCalculator {
  /**
   * Розраховує фінальну суму замовлення
   */
  static calculateFinalAmount(
    items: OrderItem[],
    discountType: DiscountType = DiscountType.NONE,
    discountPercentage: number = 0,
    expediteType: ExpediteType = ExpediteType.STANDARD,
    prepaymentAmount: number = 0
  ): {
    baseAmount: number;
    itemsSubtotal: number;
    discountAmount: number;
    expediteAmount: number;
    totalAmount: number;
    balanceAmount: number;
  } {
    // Розрахунок базової суми всіх предметів
    const baseAmount = items.reduce((sum, item) => sum + this.calculateItemBasePrice(item), 0);

    // Розрахунок суми з модифікаторами
    const itemsSubtotal = items.reduce(
      (sum, item) => sum + this.calculateItemWithModifiers(item).finalPrice,
      0
    );

    // Розрахунок знижки
    const applicableAmount = this.getDiscountApplicableAmount(items, itemsSubtotal, discountType);
    const discountAmount =
      discountType !== DiscountType.NONE ? (applicableAmount * discountPercentage) / 100 : 0;

    const afterDiscount = itemsSubtotal - discountAmount;

    // Розрахунок терміновості
    const expediteAmount = this.calculateExpediteAmount(afterDiscount, expediteType);

    const totalAmount = afterDiscount + expediteAmount;
    const balanceAmount = Math.max(0, totalAmount - prepaymentAmount);

    return {
      baseAmount,
      itemsSubtotal,
      discountAmount,
      expediteAmount,
      totalAmount,
      balanceAmount,
    };
  }

  /**
   * Розраховує базову ціну предмета
   */
  static calculateItemBasePrice(item: OrderItem): number {
    return item.unitPrice * item.quantity;
  }

  /**
   * Розраховує ціну предмета з усіма модифікаторами
   */
  static calculateItemWithModifiers(item: OrderItem): OrderItemPriceCalculation {
    const basePrice = this.calculateItemBasePrice(item);
    let currentPrice = basePrice;

    const appliedModifiers: OrderItemModifier[] = [];

    // === ЗАГАЛЬНІ МОДИФІКАТОРИ ===

    // Дитячі речі (до 30 розміру) - 30% від вартості
    if (this.isChildSized(item)) {
      const modifier: OrderItemModifier = {
        id: 'child_sized',
        orderItemId: item.id || '',
        name: 'Дитячі речі (до 30 розміру)',
        type: 'PERCENTAGE',
        value: -30,
        description: '30% знижка за дитячий розмір',
        applied: true,
      };
      appliedModifiers.push(modifier);
      currentPrice += (basePrice * modifier.value) / 100;
    }

    // Ручна чистка +20% до вартості
    if (this.requiresManualCleaning(item)) {
      const modifier: OrderItemModifier = {
        id: 'manual_cleaning',
        orderItemId: item.id || '',
        name: 'Ручна чистка',
        type: 'PERCENTAGE',
        value: 20,
        description: '+20% за ручну чистку',
        applied: true,
      };
      appliedModifiers.push(modifier);
      currentPrice += (basePrice * modifier.value) / 100;
    }

    // Дуже забруднені речі +від 20 до 100% до вартості
    const soilingLevel = this.getSoilingLevel(item);
    if (soilingLevel > 0) {
      const modifier: OrderItemModifier = {
        id: 'heavily_soiled',
        orderItemId: item.id || '',
        name: 'Сильно забруднені речі',
        type: 'PERCENTAGE',
        value: soilingLevel,
        description: `+${soilingLevel}% за сильне забруднення`,
        applied: true,
      };
      appliedModifiers.push(modifier);
      currentPrice += (basePrice * modifier.value) / 100;
    }

    // === МОДИФІКАТОРИ ДЛЯ ТЕКСТИЛЮ ===
    if (this.isTextileItem(item)) {
      const textileModifiers = this.getTextileModifiers(item, basePrice);
      appliedModifiers.push(...textileModifiers);
      textileModifiers.forEach((modifier) => {
        if (modifier.type === 'PERCENTAGE') {
          currentPrice += (basePrice * modifier.value) / 100;
        } else {
          currentPrice += modifier.value;
        }
      });
    }

    // === МОДИФІКАТОРИ ДЛЯ ШКІРИ ===
    if (this.isLeatherItem(item)) {
      const leatherModifiers = this.getLeatherModifiers(item, basePrice);
      appliedModifiers.push(...leatherModifiers);
      leatherModifiers.forEach((modifier) => {
        if (modifier.type === 'PERCENTAGE') {
          currentPrice += (basePrice * modifier.value) / 100;
        } else {
          currentPrice += modifier.value;
        }
      });
    }

    const finalPrice = Math.max(0, currentPrice);

    return {
      basePrice,
      modifiers: appliedModifiers,
      subtotal: currentPrice,
      discountAmount: item.discountApplied || 0,
      finalPrice: finalPrice - (item.discountApplied || 0),
      breakdown: this.createPriceBreakdown(basePrice, appliedModifiers, item.discountApplied || 0),
    };
  }

  /**
   * Перевіряє чи предмет дитячого розміру
   */
  private static isChildSized(item: OrderItem): boolean {
    return (
      item.name?.toLowerCase().includes('дитяч') ||
      item.description?.toLowerCase().includes('дитяч') ||
      item.specialInstructions?.toLowerCase().includes('дитяч') ||
      false
    );
  }

  /**
   * Перевіряє чи потребує ручної чистки
   */
  private static requiresManualCleaning(item: OrderItem): boolean {
    return (
      item.specialInstructions?.toLowerCase().includes('ручн') ||
      item.modifiersApplied?.includes('MANUAL_CLEANING') ||
      false
    );
  }

  /**
   * Визначає рівень забруднення (20-100%)
   */
  private static getSoilingLevel(item: OrderItem): number {
    const stains = item.stains?.toLowerCase() || '';
    const defects = item.defectsAndRisks?.toLowerCase() || '';
    const combined = `${stains} ${defects}`;

    if (combined.includes('дуже забруднен') || combined.includes('сильно забруднен')) {
      return 100;
    } else if (combined.includes('забруднен')) {
      return 50;
    } else if (item.wearDegree === WearDegree.PERCENT_75) {
      return 30;
    } else if (item.wearDegree === WearDegree.PERCENT_50) {
      return 20;
    }

    return 0;
  }

  /**
   * Перевіряє чи це текстільний виріб
   */
  private static isTextileItem(item: OrderItem): boolean {
    const textileMaterials: MaterialType[] = [
      MaterialType.COTTON,
      MaterialType.WOOL,
      MaterialType.SILK,
      MaterialType.SYNTHETIC,
    ];
    return item.material ? textileMaterials.includes(item.material as MaterialType) : false;
  }

  /**
   * Перевіряє чи це шкіряний виріб
   */
  private static isLeatherItem(item: OrderItem): boolean {
    const leatherMaterials: MaterialType[] = [
      MaterialType.LEATHER,
      MaterialType.NUBUCK,
      MaterialType.SUEDE,
      MaterialType.SPLIT_LEATHER,
    ];
    return item.material ? leatherMaterials.includes(item.material as MaterialType) : false;
  }

  /**
   * Отримує модифікатори для текстильних виробів
   */
  private static getTextileModifiers(item: OrderItem, basePrice: number): OrderItemModifier[] {
    const modifiers: OrderItemModifier[] = [];

    // Чистка виробів з хутряними комірами та манжетами +30%
    if (item.description?.toLowerCase().includes('хутр')) {
      modifiers.push({
        id: 'fur_trim',
        orderItemId: item.id || '',
        name: 'Хутряні коміри/манжети',
        type: 'PERCENTAGE',
        value: 30,
        description: '+30% за хутряні елементи',
        applied: true,
      });
    }

    // Нанесення водовідштовхуючого покриття +30%
    if (item.specialInstructions?.toLowerCase().includes('водовідштовх')) {
      modifiers.push({
        id: 'water_repellent',
        orderItemId: item.id || '',
        name: 'Водовідштовхуюче покриття',
        type: 'PERCENTAGE',
        value: 30,
        description: '+30% за водовідштовхуюче покриття',
        applied: true,
      });
    }

    // Чистка виробів із натурального шовку, атласу, шифону +50%
    if (
      item.material === MaterialType.SILK ||
      item.description?.toLowerCase().includes('атлас') ||
      item.description?.toLowerCase().includes('шифон')
    ) {
      modifiers.push({
        id: 'delicate_fabric',
        orderItemId: item.id || '',
        name: 'Делікатні тканини',
        type: 'PERCENTAGE',
        value: 50,
        description: '+50% за делікатні тканини (шовк, атлас, шифон)',
        applied: true,
      });
    }

    // Чистка комбінованих виробів (шкіра+текстиль) +100%
    if (item.description?.toLowerCase().includes('комбінован')) {
      modifiers.push({
        id: 'combined_materials',
        orderItemId: item.id || '',
        name: 'Комбіновані матеріали',
        type: 'PERCENTAGE',
        value: 100,
        description: '+100% за комбіновані матеріали',
        applied: true,
      });
    }

    // Ручна чистка великих м'яких іграшок +100%
    if (item.name?.toLowerCase().includes('іграшк')) {
      modifiers.push({
        id: 'big_toy',
        orderItemId: item.id || '',
        name: "Велика м'яка іграшка",
        type: 'PERCENTAGE',
        value: 100,
        description: "+100% за велику м'яку іграшку",
        applied: true,
      });
    }

    // Чистка виробів чорного та світлих тонів +20%
    if (
      item.color?.toLowerCase().includes('чорн') ||
      item.color?.toLowerCase().includes('світл') ||
      item.color?.toLowerCase().includes('біл')
    ) {
      modifiers.push({
        id: 'special_colors',
        orderItemId: item.id || '',
        name: 'Особливі кольори',
        type: 'PERCENTAGE',
        value: 20,
        description: '+20% за чорні/світлі кольори',
        applied: true,
      });
    }

    // Чистка весільної сукні зі шлейфом +30%
    if (
      item.name?.toLowerCase().includes('весільн') &&
      item.description?.toLowerCase().includes('шлейф')
    ) {
      modifiers.push({
        id: 'wedding_dress',
        orderItemId: item.id || '',
        name: 'Весільна сукня зі шлейфом',
        type: 'PERCENTAGE',
        value: 30,
        description: '+30% за весільну сукню зі шлейфом',
        applied: true,
      });
    }

    return modifiers;
  }

  /**
   * Отримує модифікатори для шкіряних виробів
   */
  private static getLeatherModifiers(item: OrderItem, basePrice: number): OrderItemModifier[] {
    const modifiers: OrderItemModifier[] = [];

    // Прасування шкіряних виробів 70% від вартості чистки
    if (item.specialInstructions?.toLowerCase().includes('прасув')) {
      modifiers.push({
        id: 'leather_ironing',
        orderItemId: item.id || '',
        name: 'Прасування шкіри',
        type: 'PERCENTAGE',
        value: 70,
        description: '70% від вартості чистки за прасування',
        applied: true,
      });
    }

    // Фарбування (після нашої чистки) +50%
    if (item.specialInstructions?.toLowerCase().includes('фарбув')) {
      modifiers.push({
        id: 'dyeing_after_cleaning',
        orderItemId: item.id || '',
        name: 'Фарбування (після чистки)',
        type: 'PERCENTAGE',
        value: 50,
        description: '+50% за фарбування після нашої чистки',
        applied: true,
      });
    }

    // Чистка шкіряних виробів із вставками +30%
    if (item.description?.toLowerCase().includes('вставк')) {
      modifiers.push({
        id: 'leather_inserts',
        orderItemId: item.id || '',
        name: 'Шкіра з вставками',
        type: 'PERCENTAGE',
        value: 30,
        description: '+30% за вставки іншого матеріалу',
        applied: true,
      });
    }

    // Нанесення перламутрового покриття +30%
    if (item.specialInstructions?.toLowerCase().includes('перламутр')) {
      modifiers.push({
        id: 'pearl_coating',
        orderItemId: item.id || '',
        name: 'Перламутрове покриття',
        type: 'PERCENTAGE',
        value: 30,
        description: '+30% за перламутрове покриття',
        applied: true,
      });
    }

    // Чистка натуральних дублянок на штучному хутрі -20%
    if (
      item.name?.toLowerCase().includes('дублянк') &&
      item.description?.toLowerCase().includes('штучн')
    ) {
      modifiers.push({
        id: 'artificial_fur_sheepskin',
        orderItemId: item.id || '',
        name: 'Дублянка на штучному хутрі',
        type: 'PERCENTAGE',
        value: -20,
        description: '-20% для дублянки на штучному хутрі',
        applied: true,
      });
    }

    // Ручна чистка виробів зі шкіри +30%
    if (this.requiresManualCleaning(item)) {
      modifiers.push({
        id: 'manual_leather_cleaning',
        orderItemId: item.id || '',
        name: 'Ручна чистка шкіри',
        type: 'PERCENTAGE',
        value: 30,
        description: '+30% за ручну чистку шкіри',
        applied: true,
      });
    }

    return modifiers;
  }

  /**
   * Розраховує надбавку за терміновість
   */
  private static calculateExpediteAmount(amount: number, expediteType: ExpediteType): number {
    switch (expediteType) {
      case ExpediteType.EXPRESS_48H:
        return amount * 0.5; // +50%
      case ExpediteType.EXPRESS_24H:
        return amount * 1.0; // +100%
      default:
        return 0;
    }
  }

  /**
   * Розраховує суму на яку поширюється знижка
   */
  private static getDiscountApplicableAmount(
    items: OrderItem[],
    totalAmount: number,
    discountType: DiscountType
  ): number {
    if (discountType === DiscountType.NONE) return 0;

    // Знижки не діють на прасування, прання і фарбування текстилю
    const excludedCategories = ['прасування', 'прання', 'фарбування'];

    const excludedAmount = items.reduce((sum, item) => {
      const isExcluded = excludedCategories.some(
        (category) =>
          item.category?.toLowerCase().includes(category) ||
          item.name?.toLowerCase().includes(category)
      );

      if (isExcluded) {
        return sum + (item.calculatedPrice || item.totalPrice || this.calculateItemBasePrice(item));
      }

      return sum;
    }, 0);

    return totalAmount - excludedAmount;
  }

  /**
   * Створює деталізацію розрахунку ціни
   */
  private static createPriceBreakdown(
    basePrice: number,
    modifiers: OrderItemModifier[],
    discountAmount: number
  ): Array<{
    name: string;
    type: 'BASE' | 'MODIFIER' | 'DISCOUNT';
    amount: number;
    percentage?: number;
    description?: string;
  }> {
    const breakdown: Array<{
      name: string;
      type: 'BASE' | 'MODIFIER' | 'DISCOUNT';
      amount: number;
      percentage?: number;
      description?: string;
    }> = [
      {
        name: 'Базова ціна',
        type: 'BASE',
        amount: basePrice,
      },
    ];

    modifiers.forEach((modifier) => {
      breakdown.push({
        name: modifier.name,
        type: 'MODIFIER',
        amount:
          modifier.type === 'PERCENTAGE' ? (basePrice * modifier.value) / 100 : modifier.value,
        percentage: modifier.type === 'PERCENTAGE' ? modifier.value : undefined,
        description: modifier.description,
      });
    });

    if (discountAmount > 0) {
      breakdown.push({
        name: 'Знижка',
        type: 'DISCOUNT',
        amount: -discountAmount,
      });
    }

    return breakdown;
  }

  /**
   * Розраховує стандартний термін виконання (в днях)
   */
  static calculateStandardCompletionDays(items: OrderItem[]): number {
    const hasLeatherItems = items.some((item) => this.isLeatherItem(item));
    return hasLeatherItems ? 14 : 2; // 14 днів для шкіри, 2 дні для інших
  }

  /**
   * Розраховує дату виконання з урахуванням терміновості
   */
  static calculateCompletionDate(
    items: OrderItem[],
    expediteType: ExpediteType = ExpediteType.STANDARD,
    startDate: Date = new Date()
  ): Date {
    let days = this.calculateStandardCompletionDays(items);

    switch (expediteType) {
      case ExpediteType.EXPRESS_48H:
        days = 2;
        break;
      case ExpediteType.EXPRESS_24H:
        days = 1;
        break;
    }

    const completionDate = new Date(startDate);
    completionDate.setDate(completionDate.getDate() + days);

    return completionDate;
  }
}
