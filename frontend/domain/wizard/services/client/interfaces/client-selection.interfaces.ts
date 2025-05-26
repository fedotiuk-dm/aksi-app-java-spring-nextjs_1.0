 /**
 * @fileoverview Інтерфейси сервісів вибору клієнтів
 * @module domain/wizard/services/client/interfaces/client-selection
 */

import type { BaseService, OperationResult } from '../../interfaces';
import type { ClientDomain } from '../types';

/**
 * Інтерфейс сервісу вибору клієнтів
 */
export interface IClientSelectionService extends BaseService {
  selectClient(client: ClientDomain): OperationResult<ClientDomain>;
  clearSelection(): OperationResult<void>;
  getSelectedClient(): OperationResult<ClientDomain | null>;
  isClientSelected(): boolean;
}
