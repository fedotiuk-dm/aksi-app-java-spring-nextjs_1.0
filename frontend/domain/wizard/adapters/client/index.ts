/**
 * @fileoverview Експорт всіх функцій для роботи з клієнтами
 * @module domain/wizard/adapters/client
 */

// Експорт мапперів
export {
  mapClientResponseToDomain,
  mapClientToCreateRequest,
  mapClientToUpdateRequest,
  // Legacy експорти
  mapClientDTOToDomain,
  mapClientSummaryDTOToDomain,
  mapClientToDTO,
  mapClientArrayToDomain,
} from './client.mapper';

// Експорт API функцій
export {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  searchClients,
  searchClientsWithPagination,
} from './client.api';
