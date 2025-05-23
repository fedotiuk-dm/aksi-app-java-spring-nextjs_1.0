import { ClientResponse } from '@/lib/api';

import { ClientEntity } from '../entities';
import {
  ClientSearchParams,
  ClientSearchResult,
  CreateClientFormData,
  UpdateClientFormData,
} from '../types';


/**
 * Інтерфейс репозиторію для роботи з клієнтами
 * Визначає контракт для роботи з клієнтами згідно Repository Pattern
 * Реалізує Dependency Inversion Principle - високорівневі модулі залежать від абстракцій
 */
export interface IClientRepository {
  /**
   * Отримання клієнта за ID
   * @returns ClientEntity - доменна сутність клієнта
   */
  getById(id: string): Promise<ClientEntity>;

  /**
   * Отримання всіх клієнтів
   * @returns Масив доменних сутностей ClientEntity
   */
  getAll(): Promise<ClientEntity[]>;

  /**
   * Пошук клієнтів з пагінацією
   * @returns Результат пошуку з метаданими пагінації
   */
  search(params: ClientSearchParams): Promise<ClientSearchResult>;

  /**
   * Створення нового клієнта
   * @returns ClientResponse - відповідь API (для сумісності з існуючим кодом)
   */
  create(client: CreateClientFormData): Promise<ClientResponse>;

  /**
   * Оновлення існуючого клієнта
   * @returns ClientResponse - відповідь API (для сумісності з існуючим кодом)
   */
  update(client: UpdateClientFormData): Promise<ClientResponse>;

  /**
   * Видалення клієнта за ID
   */
  delete(id: string): Promise<void>;
}
