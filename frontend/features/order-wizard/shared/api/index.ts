// Експорт API клієнта
export { default as apiClient } from './api-client';
export * from './logger';

// Імпортуємо все з основного API модуля
import {
  OpenAPI,
  ApiError,
  // Сервіси
  ClientsService,
  OrdersService,
  OrderItemPhotosService,
  BranchLocationsApiService,
  PriceListService,
  ServiceCategoryService,
  // Моделі
  ClientResponse,
  CreateClientRequest,
  UpdateClientRequest,
  ClientSearchRequest,
  OrderDTO,
  CreateOrderRequest,
  OrderItemDTO,
  BranchLocationDTO,
  PriceListItemDTO,
  ServiceCategoryDTO,
} from '@/lib/api';

// Реекспорт API типів
export {
  OpenAPI,
  ApiError,
  // Сервіси
  ClientsService,
  OrdersService,
  OrderItemPhotosService,
  BranchLocationsApiService as BranchesService,
  PriceListService,
  ServiceCategoryService,
};

// Реекспорт всіх моделей даних з перейменуванням для сумісності
export type {
  ClientResponse,
  CreateClientRequest as ClientCreateRequest,
  UpdateClientRequest as ClientUpdateRequest,
  ClientSearchRequest as ClientSearchCriteria,
  OrderDTO as OrderResponse,
  CreateOrderRequest as OrderRequest,
  OrderItemDTO as OrderItemResponse,
  OrderItemDTO as OrderItemRequest,
  BranchLocationDTO as BranchResponse,
  PriceListItemDTO as PriceListItemResponse,
  ServiceCategoryDTO as ServiceCategoryResponse,
};

