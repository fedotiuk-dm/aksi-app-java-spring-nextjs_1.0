/**
 * @fileoverview Form hooks for service management
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { 
  createServiceBody,
  updateServiceBody,
  type ServiceInfo
} from '@/shared/api/generated/serviceItem';
import { useCreateServiceMutation, useUpdateServiceMutation } from './use-services';
import { CATALOG_DEFAULTS } from '@/features/catalog';

// Form schemas using generated zod schemas
type CreateServiceFormData = z.infer<typeof createServiceBody>;
type UpdateServiceFormData = z.infer<typeof updateServiceBody>;

/**
 * Hook for create service form
 */
export const useCreateServiceForm = () => {
  const createMutation = useCreateServiceMutation();
  
  const form = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceBody),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      category: CATALOG_DEFAULTS.SERVICE.CATEGORY,
      icon: '',
      color: CATALOG_DEFAULTS.SERVICE.COLOR,
      sortOrder: 0,
      allowedProcessingTimes: [],
      requiresSpecialHandling: false,
      tags: [],
    },
  });
  
  const onSubmit = async (data: CreateServiceFormData) => {
    await createMutation.mutateAsync({ data });
  };
  
  return {
    form,
    onSubmit,
    isLoading: createMutation.isPending,
  };
};

/**
 * Hook for update service form
 */
export const useUpdateServiceForm = (service?: ServiceInfo) => {
  const updateMutation = useUpdateServiceMutation();
  
  const form = useForm<UpdateServiceFormData>({
    resolver: zodResolver(updateServiceBody),
    defaultValues: {
      name: '',
      description: '',
      icon: '',
      color: CATALOG_DEFAULTS.SERVICE.COLOR,
      active: true,
      sortOrder: 0,
      allowedProcessingTimes: [],
      requiresSpecialHandling: false,
      tags: [],
    },
  });
  
  // Populate form when service data is available
  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        description: service.description || '',
        icon: service.icon || '',
        color: service.color || CATALOG_DEFAULTS.SERVICE.COLOR,
        active: service.active,
        sortOrder: service.sortOrder,
        allowedProcessingTimes: service.allowedProcessingTimes || [],
        requiresSpecialHandling: service.requiresSpecialHandling || false,
        tags: service.tags || [],
      });
    }
  }, [service, form]);
  
  const onSubmit = async (data: UpdateServiceFormData) => {
    if (!service?.id) return;
    await updateMutation.mutateAsync({ 
      serviceId: service.id, 
      data 
    });
  };
  
  return {
    form,
    onSubmit,
    isLoading: updateMutation.isPending,
  };
};