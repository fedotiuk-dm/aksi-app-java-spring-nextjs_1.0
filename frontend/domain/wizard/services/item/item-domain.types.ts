/**
 * @fileoverview Доменні типи для предметів замовлень
 * @module domain/wizard/services/item/types
 */

/**
 * Доменна модель предмета
 */
export interface ItemDomain {
  id: string;
  orderId: string;
  serviceId: string;
  serviceName: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  unitOfMeasure: UnitOfMeasure;
  basePrice: number;
  modifiers: ItemModifierDomain[];
  totalPrice: number;
  characteristics: ItemCharacteristicsDomain;
  defectsAndRisks: ItemDefectsAndRisksDomain;
  photos: ItemPhotoDomain[];
  notes?: string;
  status: ItemStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Одиниці виміру
 */
export type UnitOfMeasure = 'PIECE' | 'KG';

/**
 * Статуси предмета
 */
export type ItemStatus =
  | 'PENDING' // Очікує обробки
  | 'IN_PROCESS' // В обробці
  | 'READY' // Готово
  | 'DELIVERED'; // Видано

/**
 * Модифікатор предмета
 */
export interface ItemModifierDomain {
  id: string;
  name: string;
  type: ModifierType;
  value: number;
  appliedAmount: number;
  category: ModifierCategory;
  description?: string;
}

/**
 * Типи модифікаторів
 */
export type ModifierType = 'PERCENTAGE' | 'FIXED' | 'MULTIPLIER';

/**
 * Категорії модифікаторів
 */
export type ModifierCategory =
  | 'MATERIAL' // Матеріал
  | 'SIZE' // Розмір
  | 'CONDITION' // Стан
  | 'URGENCY' // Терміновість
  | 'SPECIAL' // Спеціальні послуги
  | 'DISCOUNT'; // Знижки

/**
 * Характеристики предмета
 */
export interface ItemCharacteristicsDomain {
  material?: MaterialType;
  color?: string;
  filler?: FillerType;
  wearDegree?: WearDegree;
  size?: SizeCategory;
  brand?: string;
  fabricComposition?: string;
  careInstructions?: string[];
}

/**
 * Типи матеріалів
 */
export type MaterialType =
  | 'COTTON' // Бавовна
  | 'WOOL' // Шерсть
  | 'SILK' // Шовк
  | 'SYNTHETIC' // Синтетика
  | 'LEATHER' // Шкіра
  | 'SUEDE' // Замша
  | 'NUBUCK' // Нубук
  | 'FUR' // Хутро
  | 'DOWN' // Пух
  | 'MIXED'; // Змішаний

/**
 * Типи наповнювачів
 */
export type FillerType =
  | 'DOWN' // Пух
  | 'FEATHER' // Перо
  | 'SYNTHETIC' // Синтетичний
  | 'WOOL' // Шерстяний
  | 'COTTON' // Бавовняний
  | 'NONE'; // Без наповнювача

/**
 * Ступені зносу
 */
export type WearDegree = '10%' | '30%' | '50%' | '75%';

/**
 * Категорії розмірів
 */
export type SizeCategory =
  | 'CHILD' // Дитячий (до 30 розміру)
  | 'ADULT' // Дорослий
  | 'LARGE' // Великий
  | 'OVERSIZED'; // Негабаритний

/**
 * Дефекти та ризики
 */
export interface ItemDefectsAndRisksDomain {
  stains: StainDomain[];
  defects: DefectDomain[];
  risks: RiskDomain[];
  hasNoGuarantee: boolean;
  noGuaranteeReason?: string;
}

/**
 * Плями
 */
export interface StainDomain {
  type: StainType;
  location: string;
  size: StainSize;
  age: StainAge;
  description?: string;
}

/**
 * Типи плям
 */
export type StainType =
  | 'GREASE' // Жир
  | 'BLOOD' // Кров
  | 'PROTEIN' // Білок
  | 'WINE' // Вино
  | 'COFFEE' // Кава
  | 'GRASS' // Трава
  | 'INK' // Чорнило
  | 'COSMETICS' // Косметика
  | 'PAINT' // Фарба
  | 'RUST' // Іржа
  | 'OTHER'; // Інше

/**
 * Розміри плям
 */
export type StainSize = 'SMALL' | 'MEDIUM' | 'LARGE';

/**
 * Вік плям
 */
export type StainAge = 'FRESH' | 'OLD' | 'VERY_OLD';

/**
 * Дефекти
 */
export interface DefectDomain {
  type: DefectType;
  location: string;
  severity: DefectSeverity;
  description?: string;
}

/**
 * Типи дефектів
 */
export type DefectType =
  | 'WEAR' // Потертості
  | 'TEAR' // Розриви
  | 'MISSING_BUTTON' // Відсутність фурнітури
  | 'BROKEN_ZIPPER' // Пошкодження фурнітури
  | 'HOLE' // Дірки
  | 'DISCOLORATION' // Знебарвлення
  | 'SHRINKAGE' // Усадка
  | 'OTHER'; // Інше

/**
 * Ступені серйозності дефектів
 */
export type DefectSeverity = 'MINOR' | 'MODERATE' | 'SEVERE';

/**
 * Ризики
 */
export interface RiskDomain {
  type: RiskType;
  probability: RiskProbability;
  description?: string;
}

/**
 * Типи ризиків
 */
export type RiskType =
  | 'COLOR_CHANGE' // Зміна кольору
  | 'DEFORMATION' // Деформація
  | 'SHRINKAGE' // Усадка
  | 'DAMAGE' // Пошкодження
  | 'INCOMPLETE_CLEANING' // Неповне очищення
  | 'FABRIC_DAMAGE' // Пошкодження тканини
  | 'OTHER'; // Інше

/**
 * Ймовірність ризиків
 */
export type RiskProbability = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Фото предмета
 */
export interface ItemPhotoDomain {
  id: string;
  itemId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  photoType: PhotoType;
  description?: string;
  uploadedAt: Date;
}

/**
 * Типи фото
 */
export type PhotoType =
  | 'GENERAL' // Загальний вигляд
  | 'STAIN' // Плями
  | 'DEFECT' // Дефекти
  | 'LABEL' // Етикетка
  | 'DETAIL' // Деталі
  | 'BEFORE' // До обробки
  | 'AFTER'; // Після обробки

/**
 * Запит на створення предмета
 */
export interface CreateItemDomainRequest {
  orderId: string;
  serviceId: string;
  quantity: number;
  unitOfMeasure: UnitOfMeasure;
  modifierIds: string[];
  characteristics: ItemCharacteristicsDomain;
  defectsAndRisks: ItemDefectsAndRisksDomain;
  photos: CreateItemPhotoDomainRequest[];
  notes?: string;
}

/**
 * Запит на створення фото предмета
 */
export interface CreateItemPhotoDomainRequest {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  base64Data: string;
  photoType: PhotoType;
  description?: string;
}

/**
 * Запит на оновлення предмета
 */
export interface UpdateItemDomainRequest {
  quantity?: number;
  modifierIds?: string[];
  characteristics?: Partial<ItemCharacteristicsDomain>;
  defectsAndRisks?: Partial<ItemDefectsAndRisksDomain>;
  notes?: string;
  status?: ItemStatus;
}

/**
 * Параметри пошуку предметів
 */
export interface ItemSearchDomainParams {
  orderId?: string;
  serviceId?: string;
  categoryId?: string;
  status?: ItemStatus;
  material?: MaterialType;
  hasStains?: boolean;
  hasDefects?: boolean;
  page?: number;
  size?: number;
}

/**
 * Результат пошуку предметів
 */
export interface ItemSearchDomainResult {
  items: ItemDomain[];
  total: number;
  page: number;
  size: number;
  hasMore: boolean;
}

/**
 * Шаблон предмета для швидкого створення
 */
export interface ItemTemplateDomain {
  id: string;
  name: string;
  serviceId: string;
  serviceName: string;
  categoryId: string;
  categoryName: string;
  defaultCharacteristics: ItemCharacteristicsDomain;
  commonModifiers: string[];
  description?: string;
  isActive: boolean;
}

/**
 * Статистика предметів
 */
export interface ItemStatsDomain {
  totalItems: number;
  itemsByStatus: Record<ItemStatus, number>;
  itemsByCategory: Record<string, number>;
  itemsByMaterial: Record<MaterialType, number>;
  averageProcessingTime: number; // в годинах
  mostCommonStains: Array<{
    type: StainType;
    count: number;
  }>;
  mostCommonDefects: Array<{
    type: DefectType;
    count: number;
  }>;
}
