/**
 * @fileoverview Hook for managing services
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  getListServicesQueryKey,
  getListServicesQueryOptions,
  useCreateService,
  useUpdateService,
  getGetServiceByIdQueryKey,
  getGetServiceByIdQueryOptions,
  type ListServicesParams,
} from '@/shared/api/generated/serviceItem';
import { useCatalogStore, CATALOG_MESSAGES } from '@/features/catalog';

/**
 * Hook for listing services with filters
 */
export const useServices = (params?: ListServicesParams) => {
  const filters = useCatalogStore((state) => state.filters);
  
  const queryParams: ListServicesParams = {
    ...params,
    category: filters.serviceCategory,
    active: filters.activeOnly,
  };
  
  return useQuery({
    ...getListServicesQueryOptions(queryParams),
    select: (data) => data.services,
  });
};

/**
 * Hook for getting single service by ID
 */
export const useService = (serviceId?: string) => {
  return useQuery({
    ...getGetServiceByIdQueryOptions(serviceId || ''),
    enabled: !!serviceId,
  });
};

/**
 * Hook for creating new service
 */
export const useCreateServiceMutation = () => {
  const queryClient = useQueryClient();
  const closeModal = useCatalogStore((state) => state.closeModal);
  
  return useCreateService({
    mutation: {
      onSuccess: (data) => {
        toast.success(CATALOG_MESSAGES.SERVICE.CREATE_SUCCESS);
        void queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
        closeModal();
        return data;
      },
      onError: (error) => {
        const message = (error as any)?.response?.data?.message || CATALOG_MESSAGES.SERVICE.CREATE_ERROR;
        toast.error(message);
      },
    },
  });
};

/**
 * Hook for updating service
 */
export const useUpdateServiceMutation = () => {
  const queryClient = useQueryClient();
  const closeModal = useCatalogStore((state) => state.closeModal);
  
  return useUpdateService({
    mutation: {
      onSuccess: (data, variables) => {
        toast.success(CATALOG_MESSAGES.SERVICE.UPDATE_SUCCESS);
        // Invalidate both list and single service queries
        void queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getGetServiceByIdQueryKey(variables.serviceId) });
        closeModal();
        return data;
      },
      onError: (error) => {
        const message = (error as any)?.response?.data?.message || CATALOG_MESSAGES.SERVICE.UPDATE_ERROR;
        toast.error(message);
      },
    },
  });
};