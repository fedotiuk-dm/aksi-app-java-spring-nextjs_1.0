/**
 * @fileoverview Hook for managing service-item combinations
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  getListServiceItemsQueryKey,
  getListServiceItemsQueryOptions,
  useCreateServiceItem,
  useUpdateServiceItem,
  getGetServiceItemByIdQueryKey,
  getGetServiceItemByIdQueryOptions,
  type ListServiceItemsParams,
  type GetServiceItemByIdParams,
} from '@/shared/api/generated/serviceItem';
import { useCatalogStore, CATALOG_MESSAGES } from '@/features/catalog';

/**
 * Hook for listing service items with filters
 */
export const useServiceItems = (params?: ListServiceItemsParams) => {
  const filters = useCatalogStore((state) => state.filters);
  const selectedService = useCatalogStore((state) => state.selectedService);
  const selectedItem = useCatalogStore((state) => state.selectedItem);
  
  const queryParams: ListServiceItemsParams = {
    ...params,
    serviceId: params?.serviceId || selectedService?.id,
    itemId: params?.itemId || selectedItem?.id,
    active: filters.activeOnly,
  };
  
  return useQuery({
    ...getListServiceItemsQueryOptions(queryParams),
    select: (data) => data.serviceItems,
  });
};

/**
 * Hook for getting single service-item by ID
 */
export const useServiceItem = (serviceItemId?: string, branchId?: string) => {
  const params: GetServiceItemByIdParams = branchId ? { branchId } : {};
  
  return useQuery({
    ...getGetServiceItemByIdQueryOptions(serviceItemId || '', params),
    enabled: !!serviceItemId,
  });
};

/**
 * Hook for creating new service-item combination
 */
export const useCreateServiceItemMutation = () => {
  const queryClient = useQueryClient();
  const closeModal = useCatalogStore((state) => state.closeModal);
  
  return useCreateServiceItem({
    mutation: {
      onSuccess: (data) => {
        toast.success(CATALOG_MESSAGES.SERVICE_ITEM.CREATE_SUCCESS);
        void queryClient.invalidateQueries({ queryKey: getListServiceItemsQueryKey() });
        closeModal();
        return data;
      },
      onError: (error) => {
        const message = (error as any)?.response?.data?.message || CATALOG_MESSAGES.SERVICE_ITEM.CREATE_ERROR;
        toast.error(message);
      },
    },
  });
};

/**
 * Hook for updating service-item combination
 */
export const useUpdateServiceItemMutation = () => {
  const queryClient = useQueryClient();
  const closeModal = useCatalogStore((state) => state.closeModal);
  
  return useUpdateServiceItem({
    mutation: {
      onSuccess: (data, variables) => {
        toast.success(CATALOG_MESSAGES.SERVICE_ITEM.UPDATE_SUCCESS);
        // Invalidate both list and single service item queries
        void queryClient.invalidateQueries({ queryKey: getListServiceItemsQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getGetServiceItemByIdQueryKey(variables.serviceItemId) });
        closeModal();
        return data;
      },
      onError: (error) => {
        const message = (error as any)?.response?.data?.message || CATALOG_MESSAGES.SERVICE_ITEM.UPDATE_ERROR;
        toast.error(message);
      },
    },
  });
};