/**
 * Сутність OrderItem (Предмет замовлення)
 * Реалізує бізнес-логіку предметів з розрахунком цін
 */

import { Entity } from '@/domain/shared/types';

import { DefectType, StainType, MaterialType, WearDegree, FillerType } from '../../types';

import type {
  OrderItem,
  OrderItemModifier,
  OrderItemPriceCalculation,
  OrderItemCharacteristics,
} from '../../types';

export class OrderItemEntity implements Entity<string> {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly name: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly description?: string,
    public readonly category?: string,
    public readonly color?: string,
    public readonly material?: MaterialType,
    public readonly unitOfMeasure?: string,
    public readonly defects?: string,
    public readonly specialInstructions?: string,
    public readonly fillerType?: FillerType,
    public readonly fillerCompressed?: boolean,
    public readonly wearDegree?: WearDegree,
    public readonly stains?: string,
    public readonly otherStains?: string,
    public readonly defectsAndRisks?: string,
    public readonly noGuaranteeReason?: string,
    public readonly defectsNotes?: string,
    public readonly totalPrice?: number,
    public readonly calculatedPrice?: number,
    public readonly discountApplied?: number,
    public readonly modifiersApplied: string[] = [],
    public readonly hasPhotos: boolean = false,
    public readonly photoCount: number = 0,
    public readonly isComplete: boolean = false,
    public readonly hasIssues: boolean = false
  ) {}

  /**
   * Створює нову сутність з об'єкта
   */
  static fromObject(data: OrderItem): OrderItemEntity {
    return new OrderItemEntity(
      data.id || crypto.randomUUID(),
      data.orderId || '',
      data.name,
      data.quantity,
      data.unitPrice,
      data.description,
      data.category,
      data.color,
      data.material as MaterialType,
      data.unitOfMeasure,
      data.defects,
      data.specialInstructions,
      data.fillerType as FillerType,
      data.fillerCompressed,
      data.wearDegree as WearDegree,
      data.stains,
      data.otherStains,
      data.defectsAndRisks,
      data.noGuaranteeReason,
      data.defectsNotes,
      data.totalPrice,
      data.calculatedPrice,
      data.discountApplied,
      data.modifiersApplied || [],
      data.hasPhotos || false,
      data.photoCount || 0,
      data.isComplete || false,
      data.hasIssues || false
    );
  }

  /**
   * Перетворює сутність в звичайний об'єкт
   */
  toPlainObject(): OrderItem {
    return {
      id: this.id,
      orderId: this.orderId,
      name: this.name,
      description: this.description,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      totalPrice: this.totalPrice || this.calculateTotalPrice(),
      category: this.category,
      color: this.color,
      material: this.material,
      unitOfMeasure: this.unitOfMeasure,
      defects: this.defects,
      specialInstructions: this.specialInstructions,
      fillerType: this.fillerType,
      fillerCompressed: this.fillerCompressed,
      wearDegree: this.wearDegree,
      stains: this.stains,
      otherStains: this.otherStains,
      defectsAndRisks: this.defectsAndRisks,
      noGuaranteeReason: this.noGuaranteeReason,
      defectsNotes: this.defectsNotes,
      calculatedPrice: this.calculatedPrice || this.calculateTotalPrice(),
      discountApplied: this.discountApplied,
      modifiersApplied: this.modifiersApplied,
      hasPhotos: this.hasPhotos,
      photoCount: this.photoCount,
      isComplete: this.isComplete,
      hasIssues: this.hasIssues || this.checkForIssues(),
    };
  }

  /**
   * Розраховує загальну ціну предмета
   */
  calculateTotalPrice(): number {
    return this.unitPrice * this.quantity;
  }

  /**
   * Отримує характеристики предмета
   */
  getCharacteristics(): OrderItemCharacteristics {
    return {
      material: this.material,
      color: this.color,
      fillerType: this.fillerType,
      fillerCompressed: this.fillerCompressed,
      wearDegree: this.wearDegree,
      childSized: this.isChildSized(),
      manualCleaning: this.requiresManualCleaning(),
      heavilySoiled: this.isHeavilySoiled(),
      noWarranty: Boolean(this.noGuaranteeReason),
      noWarrantyReason: this.noGuaranteeReason,
    };
  }

  /**
   * Перевіряє чи предмет дитячого розміру
   */
  isChildSized(): boolean {
    // Логіка визначення дитячого розміру (до 30 розміру)
    return (
      this.name.toLowerCase().includes('дитяч') ||
      this.description?.toLowerCase().includes('дитяч') ||
      false
    ); // TODO: додати логіку розпізнавання розміру
  }

  /**
   * Перевіряє чи потребує ручної чистки
   */
  requiresManualCleaning(): boolean {
    return (
      this.specialInstructions?.toLowerCase().includes('ручн') ||
      this.modifiersApplied.includes('MANUAL_CLEANING') ||
      false
    );
  }

  /**
   * Перевіряє чи сильно забруднений
   */
  isHeavilySoiled(): boolean {
    return (
      this.defectsAndRisks?.includes('забруднен') ||
      this.stains?.includes('сильн') ||
      this.modifiersApplied.includes('HEAVILY_SOILED') ||
      false
    );
  }

  /**
   * Парсить список плям
   */
  getStainsList(): StainType[] {
    if (!this.stains) return [];

    const stainMap: Record<string, StainType> = {
      жир: StainType.GREASE,
      кров: StainType.BLOOD,
      білок: StainType.PROTEIN,
      вино: StainType.WINE,
      кава: StainType.COFFEE,
      трава: StainType.GRASS,
      чорнило: StainType.INK,
      косметика: StainType.COSMETICS,
    };

    const stains: StainType[] = [];
    Object.entries(stainMap).forEach(([keyword, stainType]) => {
      if (this.stains && this.stains.toLowerCase().includes(keyword)) {
        stains.push(stainType);
      }
    });

    return stains;
  }

  /**
   * Парсить список дефектів
   */
  getDefectsList(): DefectType[] {
    if (!this.defects && !this.defectsAndRisks) return [];

    const defectText = `${this.defects || ''} ${this.defectsAndRisks || ''}`.toLowerCase();
    const defectMap: Record<string, DefectType> = {
      потерт: DefectType.WORN,
      порван: DefectType.TORN,
      відсутн: DefectType.MISSING_ACCESSORIES,
      пошкодж: DefectType.DAMAGED_ACCESSORIES,
      'зміна кольору': DefectType.COLOR_CHANGE_RISK,
      деформац: DefectType.DEFORMATION_RISK,
    };

    const defects: DefectType[] = [];
    Object.entries(defectMap).forEach(([keyword, defectType]) => {
      if (defectText.includes(keyword)) {
        defects.push(defectType);
      }
    });

    return defects;
  }

  /**
   * Перевіряє чи є проблеми з предметом
   */
  checkForIssues(): boolean {
    return (
      this.getDefectsList().length > 0 ||
      this.getStainsList().length > 0 ||
      Boolean(this.noGuaranteeReason) ||
      this.wearDegree === WearDegree.PERCENT_75 ||
      !this.isComplete
    );
  }

  /**
   * Отримує короткий опис предмета
   */
  getShortDescription(): string {
    const parts = [this.name];

    if (this.color) parts.push(this.color);
    if (this.material) parts.push(this.getMaterialDisplayName());
    if (this.quantity > 1) parts.push(`${this.quantity} шт.`);

    return parts.join(', ');
  }

  /**
   * Отримує відображувану назву матеріалу
   */
  getMaterialDisplayName(): string {
    const materialMap: Record<MaterialType, string> = {
      [MaterialType.COTTON]: 'Бавовна',
      [MaterialType.WOOL]: 'Шерсть',
      [MaterialType.SILK]: 'Шовк',
      [MaterialType.SYNTHETIC]: 'Синтетика',
      [MaterialType.LEATHER]: 'Шкіра',
      [MaterialType.NUBUCK]: 'Нубук',
      [MaterialType.SUEDE]: 'Замша',
      [MaterialType.SPLIT_LEATHER]: 'Спілок',
    };

    return this.material ? materialMap[this.material] || this.material : '';
  }

  /**
   * Перевіряє чи готовий предмет до завершення
   */
  isReadyForCompletion(): boolean {
    return (
      this.isComplete &&
      (!this.requiresPhotos() || this.hasPhotos) &&
      this.quantity > 0 &&
      this.unitPrice > 0
    );
  }

  /**
   * Перевіряє чи потребує предмет фотографування
   */
  requiresPhotos(): boolean {
    return (
      this.getDefectsList().length > 0 ||
      this.getStainsList().length > 0 ||
      Boolean(this.noGuaranteeReason)
    );
  }

  /**
   * Отримує рівень пріоритету обробки
   */
  getProcessingPriority(): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
    if (this.noGuaranteeReason) return 'URGENT';
    if (this.wearDegree === WearDegree.PERCENT_75) return 'HIGH';
    if (this.getDefectsList().length > 2) return 'HIGH';
    if (this.isHeavilySoiled()) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Розраховує ціну з модифікаторами
   */
  calculatePriceWithModifiers(modifiers: OrderItemModifier[]): OrderItemPriceCalculation {
    let basePrice = this.calculateTotalPrice();
    let currentPrice = basePrice;
    const appliedModifiers: OrderItemModifier[] = [];

    modifiers.forEach((modifier) => {
      if (modifier.applied) {
        appliedModifiers.push(modifier);
        if (modifier.type === 'PERCENTAGE') {
          currentPrice += (basePrice * modifier.value) / 100;
        } else {
          currentPrice += modifier.value;
        }
      }
    });

    return {
      basePrice,
      modifiers: appliedModifiers,
      subtotal: currentPrice,
      discountAmount: this.discountApplied || 0,
      finalPrice: currentPrice - (this.discountApplied || 0),
      breakdown: [
        {
          name: 'Базова ціна',
          type: 'BASE',
          amount: basePrice,
        },
        ...appliedModifiers.map((m) => ({
          name: m.name,
          type: 'MODIFIER' as const,
          amount: m.type === 'PERCENTAGE' ? (basePrice * m.value) / 100 : m.value,
          percentage: m.type === 'PERCENTAGE' ? m.value : undefined,
          description: m.description,
        })),
        ...(this.discountApplied
          ? [
              {
                name: 'Знижка',
                type: 'DISCOUNT' as const,
                amount: -(this.discountApplied || 0),
              },
            ]
          : []),
      ],
    };
  }

  /**
   * Створює копію з оновленими полями
   */
  update(updates: Partial<OrderItem>): OrderItemEntity {
    return OrderItemEntity.fromObject({
      ...this.toPlainObject(),
      ...updates,
    });
  }

  /**
   * Валідує предмет
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name?.trim()) {
      errors.push("Назва предмета обов'язкова");
    }

    if (this.quantity <= 0) {
      errors.push('Кількість повинна бути більше 0');
    }

    if (this.unitPrice < 0) {
      errors.push("Ціна не може бути від'ємною");
    }

    if (this.noGuaranteeReason && !this.noGuaranteeReason.trim()) {
      errors.push('Причина "без гарантій" обов\'язкова');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
