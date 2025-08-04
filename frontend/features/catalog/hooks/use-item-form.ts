'use client';

/**
 * @fileoverview Form hooks for item management
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { 
  createItemBody,
  updateItemBody,
  type ItemInfo
} from '@/shared/api/generated/serviceItem';
import { useCreateItem, useUpdateItem } from '@/shared/api/generated/serviceItem';
import { CATALOG_DEFAULTS } from '@/features/catalog';

// Form schemas using generated zod schemas
type CreateItemFormData = z.infer<typeof createItemBody>;
type UpdateItemFormData = z.infer<typeof updateItemBody>;

/**
 * Hook for create item form
 */
export const useCreateItemForm = () => {
  const createMutation = useCreateItem();
  
  const form = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemBody),
    defaultValues: {
      code: '',
      name: '',
      pluralName: '',
      description: '',
      category: CATALOG_DEFAULTS.ITEM.CATEGORY,
      icon: '',
      sortOrder: 0,
      attributes: [],
      tags: [],
    },
  });
  
  const onSubmit = async (data: CreateItemFormData) => {
    await createMutation.mutateAsync({ data });
  };
  
  return {
    form,
    onSubmit,
    isLoading: createMutation.isPending,
  };
};

/**
 * Hook for update item form
 */
export const useUpdateItemForm = (item?: ItemInfo) => {
  const updateMutation = useUpdateItem();
  
  const form = useForm<UpdateItemFormData>({
    resolver: zodResolver(updateItemBody),
    defaultValues: {
      name: '',
      pluralName: '',
      description: '',
      icon: '',
      active: true,
      sortOrder: 0,
      attributes: [],
      tags: [],
    },
  });
  
  // Populate form when item data is available
  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        pluralName: item.pluralName || '',
        description: item.description || '',
        icon: item.icon || '',
        active: item.active,
        sortOrder: item.sortOrder,
        attributes: item.attributes || [],
        tags: item.tags || [],
      });
    }
  }, [item, form]);
  
  const onSubmit = async (data: UpdateItemFormData) => {
    if (!item?.id) return;
    await updateMutation.mutateAsync({ 
      itemId: item.id, 
      data 
    });
  };
  
  return {
    form,
    onSubmit,
    isLoading: updateMutation.isPending,
  };
};