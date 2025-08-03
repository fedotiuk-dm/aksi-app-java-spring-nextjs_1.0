/**
 * @fileoverview Catalog constants and enums
 */

import { 
  ServiceInfoCategory,
  ItemInfoCategory,
  ServiceInfoAllowedProcessingTimesItem,
  PriceListItemInfoCategoryCode,
  PriceListItemInfoUnitOfMeasure
} from '@/shared/api/generated/serviceItem';

// Re-export enums for convenience
export const SERVICE_CATEGORIES = ServiceInfoCategory;
export const ITEM_CATEGORIES = ItemInfoCategory;
export const PROCESSING_TIMES = ServiceInfoAllowedProcessingTimesItem;
export const PRICE_LIST_CATEGORIES = PriceListItemInfoCategoryCode; // Will be used for price list filtering
export const UNITS_OF_MEASURE = PriceListItemInfoUnitOfMeasure;
// SERVICE_ITEM_PROCESSING_TIMES is the same as PROCESSING_TIMES, so we don't need duplication

// Type exports
export type ServiceCategory = typeof ServiceInfoCategory[keyof typeof ServiceInfoCategory];
export type ItemCategory = typeof ItemInfoCategory[keyof typeof ItemInfoCategory];
export type ProcessingTime = typeof ServiceInfoAllowedProcessingTimesItem[keyof typeof ServiceInfoAllowedProcessingTimesItem];
export type PriceListCategory = typeof PriceListItemInfoCategoryCode[keyof typeof PriceListItemInfoCategoryCode];
export type UnitOfMeasure = typeof PriceListItemInfoUnitOfMeasure[keyof typeof PriceListItemInfoUnitOfMeasure];

// Display names for categories
export const SERVICE_CATEGORY_NAMES: Record<ServiceCategory, string> = {
  [SERVICE_CATEGORIES.CLOTHING]: 'Одяг',
  [SERVICE_CATEGORIES.LAUNDRY]: 'Прання',
  [SERVICE_CATEGORIES.IRONING]: 'Прасування',
  [SERVICE_CATEGORIES.LEATHER]: 'Шкіра',
  [SERVICE_CATEGORIES.PADDING]: 'Пухові вироби',
  [SERVICE_CATEGORIES.FUR]: 'Хутро',
  [SERVICE_CATEGORIES.DYEING]: 'Фарбування',
  [SERVICE_CATEGORIES.ADDITIONAL_SERVICES]: 'Додаткові послуги',
};

export const ITEM_CATEGORY_NAMES: Record<ItemCategory, string> = {
  [ITEM_CATEGORIES.CLOTHING]: 'Одяг',
  [ITEM_CATEGORIES.FOOTWEAR]: 'Взуття',
  [ITEM_CATEGORIES.ACCESSORIES]: 'Аксесуари',
  [ITEM_CATEGORIES.HOME_TEXTILES]: 'Домашній текстиль',
  [ITEM_CATEGORIES.LEATHER_GOODS]: 'Шкіряні вироби',
  [ITEM_CATEGORIES.FUR]: 'Хутро',
  [ITEM_CATEGORIES.WEDDING]: 'Весільні вироби',
  [ITEM_CATEGORIES.SPECIAL]: 'Спеціальні вироби',
};

export const PROCESSING_TIME_NAMES: Record<ProcessingTime, string> = {
  [PROCESSING_TIMES.EXPRESS_1H]: 'Експрес (1 година)',
  [PROCESSING_TIMES.EXPRESS_4H]: 'Експрес (4 години)',
  [PROCESSING_TIMES.SAME_DAY]: 'Того ж дня',
  [PROCESSING_TIMES.NEXT_DAY]: 'Наступний день',
  [PROCESSING_TIMES.STANDARD_2D]: 'Стандарт (2 дні)',
  [PROCESSING_TIMES.STANDARD_3D]: 'Стандарт (3 дні)',
  [PROCESSING_TIMES.EXTENDED]: 'Розширений термін',
};

export const UNIT_NAMES: Record<UnitOfMeasure, string> = {
  [UNITS_OF_MEASURE.PIECE]: 'шт.',
  [UNITS_OF_MEASURE.KILOGRAM]: 'кг',
  [UNITS_OF_MEASURE.PAIR]: 'пара',
  [UNITS_OF_MEASURE.SQUARE_METER]: 'м²',
};

// Price list category names (same as service categories)
export const PRICE_LIST_CATEGORY_NAMES = SERVICE_CATEGORY_NAMES;

// Price formatting
export const formatPrice = (kopiykas: number): string => {
  const uah = kopiykas / 100;
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
  }).format(uah);
};

// Pagination defaults
export const CATALOG_PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Messages for toasts and notifications
export const CATALOG_MESSAGES = {
  SERVICE: {
    CREATE_SUCCESS: 'Послугу успішно створено',
    CREATE_ERROR: 'Помилка при створенні послуги',
    UPDATE_SUCCESS: 'Послугу успішно оновлено',
    UPDATE_ERROR: 'Помилка при оновленні послуги',
  },
  ITEM: {
    CREATE_SUCCESS: 'Товар успішно створено',
    CREATE_ERROR: 'Помилка при створенні товару',
    UPDATE_SUCCESS: 'Товар успішно оновлено',
    UPDATE_ERROR: 'Помилка при оновленні товару',
  },
  SERVICE_ITEM: {
    CREATE_SUCCESS: 'Комбінацію послуга-товар успішно створено',
    CREATE_ERROR: 'Помилка при створенні комбінації',
    UPDATE_SUCCESS: 'Комбінацію послуга-товар успішно оновлено',
    UPDATE_ERROR: 'Помилка при оновленні комбінації',
  },
} as const;

// Modal types
export const CATALOG_MODAL_TYPES = {
  SERVICE: 'service',
  ITEM: 'item',
  SERVICE_ITEM: 'serviceItem',
} as const;

export type CatalogModalType = typeof CATALOG_MODAL_TYPES[keyof typeof CATALOG_MODAL_TYPES];

// Default form values
export const CATALOG_DEFAULTS = {
  SERVICE: {
    CATEGORY: SERVICE_CATEGORIES.CLOTHING,
    COLOR: '#000000',
  },
  ITEM: {
    CATEGORY: ITEM_CATEGORIES.CLOTHING,
  },
  SERVICE_ITEM: {
    PROCESSING_TIME: PROCESSING_TIMES.STANDARD_2D,
    EXPRESS_MULTIPLIER: 1.5,
    MIN_QUANTITY: 1,
  },
  FILTERS: {
    ACTIVE_ONLY: true,
  },
  STORE_NAME: 'catalog-store',
} as const;