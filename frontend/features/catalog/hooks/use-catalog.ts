/**
 * @fileoverview Composite hook for catalog functionality
 */

import { useCatalogStore } from '@/features/catalog';
import { useServices, useService, useCreateServiceMutation, useUpdateServiceMutation } from './use-services';
import { useItems, useItem, useCreateItemMutation, useUpdateItemMutation } from './use-items';
import { useServiceItems, useServiceItem, useCreateServiceItemMutation, useUpdateServiceItemMutation } from '@/features/catalog';

/**
 * Main hook for catalog functionality
 * Combines all catalog hooks for easier usage
 */
export const useCatalog = () => {
  // Store state and actions
  const store = useCatalogStore();
  
  // Services
  const services = useServices();
  const selectedService = store.selectedService;
  const serviceDetails = useService(selectedService?.id);
  const createService = useCreateServiceMutation();
  const updateService = useUpdateServiceMutation();
  
  // Items
  const items = useItems();
  const selectedItem = store.selectedItem;
  const itemDetails = useItem(selectedItem?.id);
  const createItem = useCreateItemMutation();
  const updateItem = useUpdateItemMutation();
  
  // Service Items
  const serviceItems = useServiceItems();
  const selectedServiceItem = store.selectedServiceItem;
  const serviceItemDetails = useServiceItem(selectedServiceItem?.id);
  const createServiceItem = useCreateServiceItemMutation();
  const updateServiceItem = useUpdateServiceItemMutation();
  
  return {
    // Store state
    filters: store.filters,
    selectedService,
    selectedItem,
    selectedServiceItem,
    isCreateModalOpen: store.isCreateModalOpen,
    isEditModalOpen: store.isEditModalOpen,
    modalType: store.modalType,
    
    // Store actions
    selectService: store.selectService,
    selectItem: store.selectItem,
    selectServiceItem: store.selectServiceItem,
    setFilters: store.setFilters,
    resetFilters: store.resetFilters,
    openCreateModal: store.openCreateModal,
    openEditModal: store.openEditModal,
    closeModal: store.closeModal,
    clearSelections: store.clearSelections,
    
    // Services data and mutations
    services: {
      data: services.data,
      isLoading: services.isLoading,
      error: services.error,
      refetch: services.refetch,
      details: serviceDetails.data,
      detailsLoading: serviceDetails.isLoading,
      create: createService,
      update: updateService,
    },
    
    // Items data and mutations
    items: {
      data: items.data,
      isLoading: items.isLoading,
      error: items.error,
      refetch: items.refetch,
      details: itemDetails.data,
      detailsLoading: itemDetails.isLoading,
      create: createItem,
      update: updateItem,
    },
    
    // Service Items data and mutations
    serviceItems: {
      data: serviceItems.data,
      isLoading: serviceItems.isLoading,
      error: serviceItems.error,
      refetch: serviceItems.refetch,
      details: serviceItemDetails.data,
      detailsLoading: serviceItemDetails.isLoading,
      create: createServiceItem,
      update: updateServiceItem,
    },
  };
};