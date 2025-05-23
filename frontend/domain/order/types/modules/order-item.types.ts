/**
 * Типи для модуля OrderItem (Предмети замовлення)
 * Згідно з DDD принципами - окремий модуль для предметів
 */

/**
 * Дефекти предмета
 */
export enum DefectType {
  WORN = 'WORN', // Потертості
  TORN = 'TORN', // Порване
  MISSING_ACCESSORIES = 'MISSING_ACCESSORIES', // Відсутність фурнітури
  DAMAGED_ACCESSORIES = 'DAMAGED_ACCESSORIES', // Пошкодження фурнітури
  COLOR_CHANGE_RISK = 'COLOR_CHANGE_RISK', // Ризики зміни кольору
  DEFORMATION_RISK = 'DEFORMATION_RISK', // Ризики деформації
  OTHER = 'OTHER', // Інше
}

/**
 * Типи плям
 */
export enum StainType {
  GREASE = 'GREASE', // Жир
  BLOOD = 'BLOOD', // Кров
  PROTEIN = 'PROTEIN', // Білок
  WINE = 'WINE', // Вино
  COFFEE = 'COFFEE', // Кава
  GRASS = 'GRASS', // Трава
  INK = 'INK', // Чорнило
  COSMETICS = 'COSMETICS', // Косметика
  OTHER = 'OTHER', // Інше
}

/**
 * Типи наповнювача
 */
export enum FillerType {
  DOWN = 'DOWN', // Пух
  SYNTHETIC = 'SYNTHETIC', // Синтепон
  OTHER = 'OTHER', // Інше
}

/**
 * Матеріали
 */
export enum MaterialType {
  COTTON = 'COTTON', // Бавовна
  WOOL = 'WOOL', // Шерсть
  SILK = 'SILK', // Шовк
  SYNTHETIC = 'SYNTHETIC', // Синтетика
  LEATHER = 'LEATHER', // Гладка шкіра
  NUBUCK = 'NUBUCK', // Нубук
  SUEDE = 'SUEDE', // Замша
  SPLIT_LEATHER = 'SPLIT_LEATHER', // Спілок
}

/**
 * Ступень зносу
 */
export enum WearDegree {
  PERCENT_10 = '10%',
  PERCENT_30 = '30%',
  PERCENT_50 = '50%',
  PERCENT_75 = '75%',
}

/**
 * Дефект предмета
 */
export interface OrderItemDefect {
  id?: string;
  orderItemId?: string;
  type: DefectType;
  description?: string;
}

/**
 * Пляма предмета
 */
export interface OrderItemStain {
  id?: string;
  orderItemId?: string;
  type: StainType;
  description?: string;
  location?: string;
  severity?: 'LIGHT' | 'MEDIUM' | 'HEAVY';
}

/**
 * Модифікатор ціни предмета
 */
export interface OrderItemModifier {
  id?: string;
  orderItemId?: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  description?: string;
  applied: boolean;
}

/**
 * Розширені характеристики предмета
 */
export interface OrderItemCharacteristics {
  material?: MaterialType;
  color?: string;
  fillerType?: FillerType;
  fillerCompressed?: boolean;
  wearDegree?: WearDegree;
  childSized?: boolean; // Дитячі речі (до 30 розміру)
  manualCleaning?: boolean; // Ручна чистка
  heavilySoiled?: boolean; // Дуже забруднені
  heavilySoiledPercentage?: number;
  noWarranty?: boolean; // Без гарантій
  noWarrantyReason?: string;
}

/**
 * Результат розрахунку ціни предмета
 */
export interface OrderItemPriceCalculation {
  basePrice: number;
  modifiers: OrderItemModifier[];
  subtotal: number;
  discountAmount: number;
  finalPrice: number;
  breakdown: PriceBreakdownItem[];
}

/**
 * Деталізація розрахунку ціни
 */
export interface PriceBreakdownItem {
  name: string;
  type: 'BASE' | 'MODIFIER' | 'DISCOUNT';
  amount: number;
  percentage?: number;
  description?: string;
}

/**
 * Параметри пошуку предметів
 */
export interface OrderItemSearchParams {
  orderId?: string;
  category?: string;
  material?: MaterialType;
  hasDefects?: boolean;
  hasStains?: boolean;
  priceRange?: [number, number];
  keyword?: string;
}

/**
 * Статистика предметів замовлення
 */
export interface OrderItemStats {
  totalItems: number;
  totalValue: number;
  averagePrice: number;
  byCategory: Record<string, number>;
  byMaterial: Record<MaterialType, number>;
  withDefects: number;
  withStains: number;
  withPhotos: number;
}
