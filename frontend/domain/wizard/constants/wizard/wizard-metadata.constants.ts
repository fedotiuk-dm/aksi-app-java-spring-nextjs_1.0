/**
 * Метадані wizard - відповідальність за версію та ключі сховища
 */

/**
 * Версія wizard (для сумісності)
 */
export const WIZARD_VERSION = '1.0.0' as const;

/**
 * Ключі локального сховища
 */
export const STORAGE_KEYS = {
  WIZARD_DRAFT: 'wizard_draft',
  WIZARD_CONTEXT: 'wizard_context',
  AUTO_SAVE_ENABLED: 'wizard_auto_save',
  LAST_USED_BRANCH: 'wizard_last_branch',
} as const;
