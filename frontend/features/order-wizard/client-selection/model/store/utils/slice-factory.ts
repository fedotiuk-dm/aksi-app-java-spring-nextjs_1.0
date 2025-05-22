import { StateCreator } from 'zustand';

import { WizardStep } from '../../../../wizard/store/navigation';
import { ClientStore, SliceCreator, StoreMethod, StoreMethodArgs } from '../../types';

/**
 * Базова фабрика для створення слайсів з покращеною типізацією
 *
 * @template TSlice - Тип методів та властивостей слайсу
 * @param name - Назва слайсу для логування
 * @param slice - Функція створення слайсу
 * @returns Функція створення слайсу з додатковою логікою
 */
export function createSlice<TSlice extends Partial<ClientStore>>(
  name: string,
  slice: SliceCreator<TSlice>
): SliceCreator<TSlice> {
  return (set, get, api) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Store] Creating slice: ${name}`);
    }

    // Створюємо слайс з проксі для логування
    const sliceInstance = slice(set, get, api);

    if (process.env.NODE_ENV === 'development') {
      // Додаємо логування для кожного методу слайсу
      return new Proxy(sliceInstance, {
        get(target, prop) {
          const value = target[prop as keyof typeof target];
          if (typeof value === 'function') {
            return (...args: StoreMethodArgs) => {
              console.debug(`[${name}] Calling ${String(prop)}`, args);
              return (value as StoreMethod)(...args);
            };
          }
          return value;
        },
      });
    }

    return sliceInstance;
  };
}

/**
 * Композитор слайсів для об'єднання в єдиний стор
 *
 * @param slices - Масив функцій створення слайсів
 * @returns Функція створення повного стору
 */
export function composeSlices(
  ...slices: Array<SliceCreator<Partial<ClientStore>>>
): StateCreator<ClientStore, [], [], ClientStore> {
  return (set, get, api) => {
    // Об'єднуємо всі слайси в один об'єкт
    return slices.reduce((acc, slice) => {
      return { ...acc, ...slice(set, get, api) };
    }, {} as ClientStore);
  };
}

/**
 * Тип для визначення залежностей слайсу від інших слайсів
 * Дозволяє явно вказати, які дії з інших слайсів використовуються
 */
export type SliceDependencies<T extends keyof ClientStore> = {
  [K in T]?: boolean;
};

/**
 * Функція для перевірки доступності потрібних залежностей слайсу
 * Використовується в рантаймі для перевірки наявності необхідних методів
 *
 * @param store - поточний стор
 * @param dependencies - об'єкт із залежностями
 * @returns true, якщо всі залежності доступні
 */
export function checkSliceDependencies<T extends keyof ClientStore>(
  store: Partial<ClientStore>,
  dependencies: SliceDependencies<T>
): boolean {
  for (const key in dependencies) {
    if (dependencies[key as T] && !(key in store)) {
      console.warn(`Slice dependency not found: ${key}`);
      return false;
    }
  }
  return true;
}

/**
 * Типізований інтерфейс для зовнішніх модулів стора
 */
export interface NavigationModule {
  updateStepAvailability: (step: WizardStep, isAvailable: boolean) => void;
  goToStep: (step: WizardStep) => void;
}

export interface WizardModule {
  updateClientData: (client: unknown) => void;
  setMode: (mode: string) => void;
}

/**
 * Допоміжний тип для специфічних залежностей слайсів
 * Використовується для типізації залежностей між різними частинами стору
 */
export interface StoreModules {
  navigation?: NavigationModule;
  wizard?: WizardModule;
  [key: string]: unknown;
}
