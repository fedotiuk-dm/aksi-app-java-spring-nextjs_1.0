/**
 * @fileoverview Form hooks for service-item management
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { 
  createServiceItemBody,
  updateServiceItemBody,
  type ServiceItemInfo
} from '@/shared/api/generated/serviceItem';
import { useCreateServiceItemMutation, useUpdateServiceItemMutation } from './use-service-items';
import { CATALOG_DEFAULTS, PROCESSING_TIMES } from '@/features/catalog';

// Form schemas using generated zod schemas
type CreateServiceItemFormData = z.infer<typeof createServiceItemBody>;
type UpdateServiceItemFormData = z.infer<typeof updateServiceItemBody>;

/**
 * Hook for create service-item form
 */
export const useCreateServiceItemForm = () => {
  const createMutation = useCreateServiceItemMutation();
  
  const form = useForm<CreateServiceItemFormData>({
    resolver: zodResolver(createServiceItemBody),
    defaultValues: {
      serviceId: '',
      itemId: '',
      basePrice: 0,
      processingTime: CATALOG_DEFAULTS.SERVICE_ITEM.PROCESSING_TIME,
      expressAvailable: false,
      expressMultiplier: CATALOG_DEFAULTS.SERVICE_ITEM.EXPRESS_MULTIPLIER,
      minQuantity: CATALOG_DEFAULTS.SERVICE_ITEM.MIN_QUANTITY,
      maxQuantity: undefined,
      specialInstructions: '',
    },
  });
  
  const onSubmit = async (data: CreateServiceItemFormData) => {
    await createMutation.mutateAsync({ data });
  };
  
  return {
    form,
    onSubmit,
    isLoading: createMutation.isPending,
  };
};

/**
 * Hook for update service-item form
 */
export const useUpdateServiceItemForm = (serviceItem?: ServiceItemInfo) => {
  const updateMutation = useUpdateServiceItemMutation();
  
  const form = useForm<UpdateServiceItemFormData>({
    resolver: zodResolver(updateServiceItemBody),
    defaultValues: {
      basePrice: 0,
      processingTime: CATALOG_DEFAULTS.SERVICE_ITEM.PROCESSING_TIME,
      expressAvailable: false,
      expressMultiplier: CATALOG_DEFAULTS.SERVICE_ITEM.EXPRESS_MULTIPLIER,
      active: true,
      minQuantity: CATALOG_DEFAULTS.SERVICE_ITEM.MIN_QUANTITY,
      maxQuantity: undefined,
      specialInstructions: '',
      popularityScore: 0,
    },
  });
  
  // Populate form when service-item data is available
  useEffect(() => {
    if (serviceItem) {
      form.reset({
        basePrice: serviceItem.basePrice,
        processingTime: serviceItem.processingTime || CATALOG_DEFAULTS.SERVICE_ITEM.PROCESSING_TIME,
        expressAvailable: serviceItem.expressAvailable || false,
        expressMultiplier: serviceItem.expressMultiplier || CATALOG_DEFAULTS.SERVICE_ITEM.EXPRESS_MULTIPLIER,
        active: serviceItem.active,
        minQuantity: serviceItem.minQuantity || 1,
        maxQuantity: serviceItem.maxQuantity,
        specialInstructions: serviceItem.specialInstructions || '',
        popularityScore: serviceItem.popularityScore || 0,
      });
    }
  }, [serviceItem, form]);
  
  const onSubmit = async (data: UpdateServiceItemFormData) => {
    if (!serviceItem?.id) return;
    await updateMutation.mutateAsync({ 
      serviceItemId: serviceItem.id, 
      data 
    });
  };
  
  return {
    form,
    onSubmit,
    isLoading: updateMutation.isPending,
  };
};