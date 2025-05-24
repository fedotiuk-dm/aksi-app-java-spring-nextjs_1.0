/**
 * Ліміти wizard системи - відповідальність за системні обмеження
 */

/**
 * Ліміти системи
 */
export const WIZARD_LIMITS = {
  MAX_ITEMS_PER_ORDER: 50,
  MAX_PHOTOS_PER_ITEM: 5,
  MAX_PHOTO_SIZE_MB: 5,
  MIN_CLIENT_SEARCH_LENGTH: 2,
  MAX_SEARCH_RESULTS: 20,
  MAX_RECEIPT_NUMBER_LENGTH: 20,
  MAX_UNIQUE_LABEL_LENGTH: 50,
} as const;
