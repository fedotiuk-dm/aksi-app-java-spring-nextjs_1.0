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
  PRICE_LIST: {
    LOADING_ERROR: 'Помилка завантаження прайс-листа',
    NO_ITEMS: 'Елементи прайс-листа не знайдено',
    BLACK_DYEING: 'Чорне фарбування',
    INACTIVE: 'Неактивний',
    ACTIVE: 'Активний',
    TITLE: 'Прайс-лист',
    VIEW_MODE_LABEL: 'Режим перегляду',
    CARDS_VIEW: 'Картки',
    TABLE_VIEW: 'Таблиця',
    TABLE_HEADERS: {
      NUMBER: '№',
      NAME: 'Назва',
      CATEGORY: 'Категорія',
      UNIT: 'Од. виміру',
      BASE_PRICE: 'Базова ціна',
      BLACK_PRICE: 'Чорне фарбування',
      STATUS: 'Статус',
    },
    EMPTY_VALUE: '—',
  },
  SERVICE_LIST: {
    LOADING_ERROR: 'Помилка завантаження послуг',
    TITLE: 'Послуги',
    ADD_BUTTON: 'Додати послугу',
    NO_ITEMS: 'Послуги не знайдено',
    CREATE_FIRST: 'Створіть першу послугу',
    EDIT_ARIA: 'Редагувати',
    DELETE_ARIA: 'Видалити',
    CODE_LABEL: 'Код',
    INACTIVE: 'Неактивна',
    SPECIAL_HANDLING: 'Спеціальна обробка',
    PROCESSING_TIMES_LABEL: 'Терміни обробки',
    TAGS_LABEL: 'Теги',
  },
  ITEM_LIST: {
    LOADING_ERROR: 'Помилка завантаження товарів',
    TITLE: 'Товари',
    ADD_BUTTON: 'Додати товар',
    NO_ITEMS: 'Товари не знайдено',
    CREATE_FIRST: 'Створіть перший товар',
    EDIT_ARIA: 'Редагувати',
    DELETE_ARIA: 'Видалити',
    CODE_LABEL: 'Код',
    PLURAL_LABEL: 'Множина',
    INACTIVE: 'Неактивний',
    SPECIAL_HANDLING: 'Спеціальна обробка',
    SERVICE_CATEGORY_LABEL: 'Категорія послуг',
    TAGS_LABEL: 'Теги',
  },
  SERVICE_FORM: {
    TITLE_CREATE: 'Створити послугу',
    TITLE_EDIT: 'Редагувати послугу',
    SECTION_BASIC: 'Базова інформація',
    SECTION_DISPLAY: 'Налаштування відображення',
    SECTION_PROCESSING: 'Налаштування обробки',
    FIELDS: {
      CODE: 'Код послуги',
      CODE_PLACEHOLDER: 'CLEANING_SHIRT',
      NAME: 'Назва послуги',
      NAME_PLACEHOLDER: 'Прання сорочки',
      DESCRIPTION: 'Опис послуги',
      DESCRIPTION_PLACEHOLDER: 'Детальний опис послуги...',
      CATEGORY: 'Категорія',
      ICON: 'Іконка',
      ICON_PLACEHOLDER: 'cleaning',
      ICON_HELPER: 'ID іконки для відображення',
      COLOR: 'Колір для відображення',
      HEX_COLOR: 'Hex колір',
      HEX_PLACEHOLDER: '#000000',
      SORT_ORDER: 'Порядок сортування',
      SORT_PLACEHOLDER: '1',
      PROCESSING_TIMES: 'Доступні терміни обробки',
      SPECIAL_HANDLING: 'Потребує спеціальної обробки',
      TAGS: 'Теги',
      TAGS_PLACEHOLDER: 'organic, eco-friendly',
      TAGS_HELPER: 'Розділіть теги комами',
    },
    BUTTONS: {
      CANCEL: 'Скасувати',
      CREATE: 'Створити',
      UPDATE: 'Оновити',
      CREATING: 'Створення...',
      UPDATING: 'Оновлення...',
    },
  },
  ITEM_FORM: {
    TITLE_CREATE: 'Створити товар',
    TITLE_EDIT: 'Редагувати товар',
    SECTION_BASIC: 'Базова інформація',
    SECTION_DETAILS: 'Деталі товару',
    FIELDS: {
      CODE: 'Код товару',
      CODE_PLACEHOLDER: 'SHIRT_M',
      NAME: 'Назва товару',
      NAME_PLACEHOLDER: 'Сорочка чоловіча',
      PLURAL_NAME: 'Назва у множині',
      PLURAL_NAME_PLACEHOLDER: 'Сорочки чоловічі',
      DESCRIPTION: 'Опис товару',
      DESCRIPTION_PLACEHOLDER: 'Детальний опис товару...',
      CATEGORY: 'Категорія',
      CATALOG_NUMBER: 'Артикул',
      CATALOG_NUMBER_PLACEHOLDER: '12345',
      SERVICE_CATEGORY_CODE: 'Код категорії послуг',
      UNIT_OF_MEASURE: 'Одиниця виміру',
      BASE_PRICE: 'Базова ціна',
      PRICE_BLACK: 'Ціна чорного фарбування',
      PRICE_COLOR: 'Ціна кольорового фарбування',
      ICON: 'Іконка',
      TAGS: 'Теги',
      TAGS_PLACEHOLDER: 'cotton, formal',
      TAGS_HELPER: 'Розділіть теги комами',
    },
    BUTTONS: {
      CANCEL: 'Скасувати',
      CREATE: 'Створити',
      UPDATE: 'Оновити',
      CREATING: 'Створення...',
      UPDATING: 'Оновлення...',
    },
  },
  SERVICE_ITEM_FORM: {
    TITLE_CREATE: 'Створити комбінацію послуга-товар',
    TITLE_EDIT: 'Редагувати комбінацію',
    SECTION_SELECTION: 'Вибір послуги та товару',
    SECTION_PRICING: 'Ціноутворення',
    SECTION_EXPRESS: 'Експрес обслуговування',
    SECTION_PROCESSING: 'Налаштування обробки',
    FIELDS: {
      SERVICE: 'Послуга',
      ITEM: 'Товар',
      BASE_PRICE: 'Базова ціна',
      BASE_PRICE_HELPER: 'Ціна в копійках (100 копійок = 1 гривня)',
      PRICE_EQUIVALENT: 'Еквівалент',
      EXPRESS_AVAILABLE: 'Доступне експрес обслуговування',
      EXPRESS_MULTIPLIER: 'Коефіцієнт для експрес',
      EXPRESS_MULTIPLIER_HELPER: 'Множник для розрахунку експрес ціни',
      EXPRESS_PRICE: 'Експрес ціна',
      PROCESSING_TIME: 'Стандартний термін обробки',
      MIN_QUANTITY: 'Мін. кількість',
      MAX_QUANTITY: 'Макс. кількість',
      SPECIAL_INSTRUCTIONS: 'Спеціальні інструкції',
      SPECIAL_INSTRUCTIONS_PLACEHOLDER: 'Особливі вимоги до обробки...',
      POPULARITY_SCORE: 'Оцінка популярності',
      POPULARITY_SCORE_HELPER: 'Від 0 до 100, впливає на сортування',
    },
    BUTTONS: {
      CANCEL: 'Скасувати',
      CREATE: 'Створити',
      UPDATE: 'Оновити',
      CREATING: 'Створення...',
      UPDATING: 'Оновлення...',
    },
  },
  COMMON: {
    LOADING: 'Завантаження...',
    ERROR: 'Помилка',
    NO_DATA: 'Дані не знайдено',
  },
  CATALOG: {
    TITLE: 'Каталог послуг і товарів',
    DESCRIPTION: 'Управління послугами, товарами та прайс-листом для пральні',
  },
  TABS: {
    SERVICES: 'Послуги',
    ITEMS: 'Товари',
    PRICE_LIST: 'Прайс-лист',
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
  PAGINATION: {
    OFFSET: 0,
    LIMIT: 100,
    SKELETON_ITEMS: 6,
  },
  GRID: {
    BREAKPOINTS: {
      XS: 12,
      SM: 6,
      MD: 4,
    },
  },
  TABLE: {
    MIN_WIDTH: 650,
  },
} as const;