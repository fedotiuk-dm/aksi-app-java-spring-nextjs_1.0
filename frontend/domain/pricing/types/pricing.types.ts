/**
 * Типи та енуми для Pricing домену
 * Описують структури даних для роботи з цінами, прайс-листами та модифікаторами
 */

/**
 * Категорії послуг хімчистки
 */
export enum ServiceCategory {
  CLOTHING_CLEANING = 'clothing_cleaning',
  LAUNDRY = 'laundry',
  IRONING = 'ironing',
  LEATHER_CLEANING = 'leather_cleaning',
  SHEEPSKIN_COATS = 'sheepskin_coats',
  FUR_PRODUCTS = 'fur_products',
  TEXTILE_DYEING = 'textile_dyeing',
}

/**
 * Одиниці виміру
 */
export enum UnitOfMeasure {
  PIECE = 'piece',
  KILOGRAM = 'kilogram',
  SQUARE_METER = 'square_meter',
  LINEAR_METER = 'linear_meter',
}

/**
 * Типи модифікаторів ціни
 */
export enum PriceModifierType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  MULTIPLIER = 'multiplier',
}

/**
 * Правила застосування модифікаторів
 */
export enum ModifierApplicationRule {
  ADDITIVE = 'additive',
  MULTIPLICATIVE = 'multiplicative',
  EXCLUSIVE = 'exclusive',
  CONDITIONAL = 'conditional',
}

/**
 * Елемент прайс-листа
 */
export interface PriceListItem {
  id?: string;
  categoryId: string;
  category: ServiceCategory;
  itemNumber: string; // Номер в прайс-листі
  name: string; // Назва послуги/виробу
  description?: string;
  basePrice: number; // Базова ціна
  unitOfMeasure: UnitOfMeasure;
  isActive: boolean;

  // Спеціальні ціни
  blackColorPrice?: number; // Ціна для чорних виробів
  lightColorPrice?: number; // Ціна для світлих виробів
  specialPrice?: number; // Спеціальна ціна

  // Мета-інформація
  tags?: string[]; // Теги для пошуку
  keywords?: string[]; // Ключові слова
  minQuantity?: number; // Мінімальна кількість
  maxQuantity?: number; // Максимальна кількість

  // Аудит
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Категорія послуг
 */
export interface ServiceCategoryInfo {
  id: string;
  code: ServiceCategory;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;

  // Налаштування категорії
  defaultUnitOfMeasure: UnitOfMeasure;
  allowsColorModification: boolean; // Чи дозволяє модифікацію за кольором
  standardDeliveryDays: number; // Стандартний термін виконання

  // Доступні модифікатори для категорії
  availableModifiers: string[]; // ID модифікаторів

  // Обмеження знижок
  allowsDiscounts: boolean;
  excludedFromDiscounts?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Модифікатор ціни
 */
export interface PriceModifier {
  id: string;
  code: string; // Унікальний код модифікатора
  name: string;
  description?: string;

  // Параметри модифікатора
  type: PriceModifierType;
  value: number; // Значення (відсоток, сума, множник)
  applicationRule: ModifierApplicationRule;

  // Умови застосування
  applicableCategories: ServiceCategory[]; // Категорії до яких застосовується
  materialTypes?: string[]; // Типи матеріалів
  colorTypes?: string[]; // Типи кольорів
  sizeRanges?: string[]; // Діапазони розмірів

  // Пріоритет застосування
  priority: number; // Чим менше число, тим вищий пріоритет

  // Обмеження
  minOrderAmount?: number; // Мінімальна сума замовлення
  maxApplications?: number; // Максимальна кількість застосувань

  // Статус
  isActive: boolean;
  validFrom?: Date;
  validUntil?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Результат розрахунку ціни
 */
export interface PriceCalculationResult {
  itemId: string;
  basePrice: number;
  quantity: number;
  unitOfMeasure: UnitOfMeasure;

  // Застосовані модифікатори
  appliedModifiers: AppliedModifier[];

  // Розрахунки
  subtotalBeforeModifiers: number;
  modifiersTotal: number;
  subtotalAfterModifiers: number;

  // Знижки
  discountAmount: number;
  discountPercentage: number;

  // Фінальна ціна
  finalPrice: number;
  pricePerUnit: number;

  // Деталізація
  breakdown: PriceBreakdownItem[];

  // Мета-інформація
  calculatedAt: Date;
  calculationMethod: string;
  notes?: string[];
  warnings?: string[];
}

/**
 * Застосований модифікатор
 */
export interface AppliedModifier {
  modifierId: string;
  modifier: PriceModifier;
  appliedValue: number; // Застосоване значення
  resultingAmount: number; // Результуюча сума
  reason: string; // Причина застосування
  order: number; // Порядок застосування
}

/**
 * Елемент деталізації розрахунку
 */
export interface PriceBreakdownItem {
  description: string;
  type: 'base' | 'modifier' | 'discount' | 'total';
  amount: number;
  percentage?: number;
  calculation?: string; // Формула розрахунку
}

/**
 * Пошук по прайс-листу
 */
export interface PriceSearchParams {
  keyword?: string;
  category?: ServiceCategory;
  categories?: ServiceCategory[];
  unitOfMeasure?: UnitOfMeasure;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  tags?: string[];
  itemNumbers?: string[];
}

/**
 * Результат пошуку цін
 */
export interface PriceSearchResult {
  items: PriceListItem[];
  totalCount: number;
  filteredCount: number;
  categories: ServiceCategoryInfo[];
  priceRange: {
    min: number;
    max: number;
    average: number;
  };
  hasMore: boolean;
}

/**
 * Параметри розрахунку ціни
 */
export interface PriceCalculationParams {
  priceListItem: PriceListItem;
  quantity: number;

  // Характеристики предмета
  color?: string;
  materialType?: string;
  size?: string;
  condition?: string;

  // Додаткові параметри
  isUrgent?: boolean;
  urgencyLevel?: 'standard' | '48h' | '24h';

  // Знижки
  discountType?: string;
  discountPercentage?: number;

  // Спеціальні умови
  customModifiers?: string[]; // ID кастомних модифікаторів
  excludeModifiers?: string[]; // ID виключених модифікаторів

  // Контекст
  clientId?: string;
  orderDate?: Date;
  seasonalAdjustment?: boolean;
}

/**
 * Налаштування цін
 */
export interface PricingSettings {
  id?: string;

  // Загальні налаштування
  defaultCurrency: string;
  taxRate: number; // Податкова ставка
  roundingRule: 'up' | 'down' | 'nearest'; // Правило округлення
  roundingPrecision: number; // Точність округлення

  // Модифікатори
  enableAutomaticModifiers: boolean;
  enableSeasonalAdjustments: boolean;
  enableVolumeDiscounts: boolean;

  // Знижки
  maxDiscountPercentage: number;
  allowStackableDiscounts: boolean;

  // Термінові замовлення
  urgentSurcharge48h: number; // Надбавка за 48 годин
  urgentSurcharge24h: number; // Надбавка за 24 години

  // Спеціальні правила
  childItemsDiscount: number; // Знижка на дитячі речі
  manualCleaningSurcharge: number; // Надбавка за ручну чистку

  updatedAt?: Date;
  updatedBy?: string;
}

/**
 * Статистика цін
 */
export interface PricingStatistics {
  // Загальна статистика
  totalItems: number;
  activeItems: number;
  categoriesCount: number;
  modifiersCount: number;

  // Ціновий діапазон
  priceDistribution: {
    category: ServiceCategory;
    minPrice: number;
    maxPrice: number;
    averagePrice: number;
    itemsCount: number;
  }[];

  // Популярні послуги
  popularItems: {
    itemId: string;
    name: string;
    usageCount: number;
    averagePrice: number;
  }[];

  // Модифікатори
  modifierUsage: {
    modifierId: string;
    name: string;
    applicationCount: number;
    totalImpact: number;
  }[];

  calculatedAt: Date;
}

/**
 * Результат операцій з цінами
 */
export interface PricingOperationResult {
  success: boolean;
  data?: any;
  errors?: PricingOperationErrors;
  warnings?: string[];
  metadata?: {
    itemsProcessed?: number;
    calculationTime?: number;
    cacheHit?: boolean;
  };
}

/**
 * Помилки операцій з цінами
 */
export interface PricingOperationErrors {
  general?: string;
  validation?: Record<string, string>;
  calculation?: string[];
  modifiers?: string[];
  categories?: string[];
  items?: string[];
}
