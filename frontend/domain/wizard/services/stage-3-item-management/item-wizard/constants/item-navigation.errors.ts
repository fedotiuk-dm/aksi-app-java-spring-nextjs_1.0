/**
 * @fileoverview Константи помилок для навігації item wizard
 * @module domain/wizard/services/stage-3-item-management/item-wizard/constants/item-navigation-errors
 */

/**
 * Помилки навігації item wizard
 */
export const ITEM_NAVIGATION_ERRORS = {
  INVALID_STEP: 'Некоректний крок wizard',
  NO_NEXT_STEP: 'Відсутній наступний крок',
  NO_PREVIOUS_STEP: 'Відсутній попередній крок',
  STEP_NOT_ACCESSIBLE: 'Крок недоступний для переходу',
  NAVIGATION_FAILED: 'Помилка навігації',
} as const;
