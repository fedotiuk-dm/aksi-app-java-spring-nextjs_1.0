/**
 * @fileoverview Hook for managing items
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  getListItemsQueryKey,
  getListItemsQueryOptions,
  useCreateItem,
  useUpdateItem,
  getGetItemByIdQueryKey,
  getGetItemByIdQueryOptions,
  type ListItemsParams,
} from '@/shared/api/generated/serviceItem';
import { useCatalogStore, CATALOG_MESSAGES } from '@/features/catalog';

/**
 * Hook for listing items with filters
 */
export const useItems = (params?: ListItemsParams) => {
  const filters = useCatalogStore((state) => state.filters);
  
  const queryParams: ListItemsParams = {
    ...params,
    category: filters.itemCategory,
    search: filters.searchQuery,
    active: filters.activeOnly,
  };
  
  return useQuery({
    ...getListItemsQueryOptions(queryParams),
    select: (data) => data.items,
  });
};

/**
 * Hook for getting single item by ID
 */
export const useItem = (itemId?: string) => {
  return useQuery({
    ...getGetItemByIdQueryOptions(itemId || ''),
    enabled: !!itemId,
  });
};

/**
 * Hook for creating new item
 */
export const useCreateItemMutation = () => {
  const queryClient = useQueryClient();
  const closeModal = useCatalogStore((state) => state.closeModal);
  
  return useCreateItem({
    mutation: {
      onSuccess: (data) => {
        toast.success(CATALOG_MESSAGES.ITEM.CREATE_SUCCESS);
        void queryClient.invalidateQueries({ queryKey: getListItemsQueryKey() });
        closeModal();
        return data;
      },
      onError: (error) => {
        const message = (error as any)?.response?.data?.message || CATALOG_MESSAGES.ITEM.CREATE_ERROR;
        toast.error(message);
      },
    },
  });
};

/**
 * Hook for updating item
 */
export const useUpdateItemMutation = () => {
  const queryClient = useQueryClient();
  const closeModal = useCatalogStore((state) => state.closeModal);
  
  return useUpdateItem({
    mutation: {
      onSuccess: (data, variables) => {
        toast.success(CATALOG_MESSAGES.ITEM.UPDATE_SUCCESS);
        // Invalidate both list and single item queries
        void queryClient.invalidateQueries({ queryKey: getListItemsQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getGetItemByIdQueryKey(variables.itemId) });
        closeModal();
        return data;
      },
      onError: (error) => {
        const message = (error as any)?.response?.data?.message || CATALOG_MESSAGES.ITEM.UPDATE_ERROR;
        toast.error(message);
      },
    },
  });
};