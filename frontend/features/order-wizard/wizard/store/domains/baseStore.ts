/**
 * Базові типи для доменних сторів
 */

/**
 * Базовий тип для всіх доменних сторів
 */
export type BaseStoreState = {
  error: string | null;
  isSaving: boolean;
};

/**
 * Базові дії для всіх доменних сторів
 */
export type BaseStoreActions = {
  setError: (error: string | null) => void;
  setIsSaving: (isSaving: boolean) => void;
  reset: () => void;
};

/**
 * Базовий тип для інтерфейсу доменного стору
 */
export type BaseStore = BaseStoreState & BaseStoreActions;

/**
 * Тип для доступу до інших доменних сторів
 */
export type GetOtherStore<T> = () => T;
