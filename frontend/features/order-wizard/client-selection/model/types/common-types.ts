import { ClientResponse } from '@/lib/api';

import { ClientStore } from '../types';

/**
 * Режим вибору клієнта
 */
export type ClientSelectionMode = 'existing' | 'new' | 'edit';

/**
 * Типи каналів комунікації та джерел
 */
export type CommunicationChannel = 'PHONE' | 'SMS' | 'VIBER';
export type ClientSource = 'INSTAGRAM' | 'GOOGLE' | 'RECOMMENDATION' | 'OTHER';

/**
 * Інтерфейс для глобального стану візарда
 */
export interface WizardGlobalState {
  client?: ClientResponse;
  clientMode?: ClientSelectionMode;
  [key: string]: unknown;
}

/**
 * Типи для функцій стору
 */
export type StoreMethod = (...args: unknown[]) => unknown;
export type StoreMethodArgs = unknown[];

/**
 * Базовий інтерфейс для окремих слайсів стану
 * Допомагає типізувати кожен слайс
 */
export interface SliceState<T extends keyof ClientStore> {
  state: Pick<ClientStore, T>;
  actions: Record<string, StoreMethod>;
}
