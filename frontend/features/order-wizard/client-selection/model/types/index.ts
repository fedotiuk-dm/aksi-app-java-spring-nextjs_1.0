export * from './form-types';
export * from './state-types';
export * from './action-types';
export * from './api-utils';
export * from './slice-types';
export * from './common-types';

import { ClientStore } from './state-types';

/**
 * Інтерфейс для типізації слайсів з ключами стану та дій
 */
export interface SliceModel<TState extends keyof ClientStore, TActions extends keyof ClientStore> {
  stateKeys: TState[];
  actionKeys: TActions[];
}
