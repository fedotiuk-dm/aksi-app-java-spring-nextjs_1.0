/**
 * Функції для конвертації між різними типами даних
 */
import type { OrderItemUI } from '../model/types/wizard.types';
import type { OrderItemDto } from '@/lib/api';

/**
 * Типи форми, з використанням zod-схеми
 */
export interface BasicItemFormValues {
  name: string;
  categoryId: string;
  priceListItemId: string;
  quantity: number;
  unitOfMeasurement: 'PIECE' | 'KILOGRAM';
  defectNotes?: string;
  id?: string;
  localId?: string;
}

/**
 * Конвертація з OrderItemUI в BasicItemFormValues
 */
export const orderItemUIToFormValues = (item: OrderItemUI): BasicItemFormValues => {
  return {
    name: item.name || '',
    categoryId: item.categoryId || '',
    priceListItemId: item.priceListItemId || '',
    quantity: item.quantity || 1,
    unitOfMeasurement: (item.unitOfMeasurement as 'PIECE' | 'KILOGRAM') || 'PIECE',
    defectNotes: item.defectNotes || '',
    id: item.id,
    localId: item.localId
  };
};

/**
 * Конвертація з BasicItemFormValues в OrderItemUI
 */
export const formValuesToOrderItemUI = (
  formValues: BasicItemFormValues,
  existingItem?: OrderItemUI
): OrderItemUI => {
  return {
    ...(existingItem || {}),
    name: formValues.name,
    categoryId: formValues.categoryId,
    priceListItemId: formValues.priceListItemId,
    quantity: formValues.quantity,
    unitOfMeasurement: formValues.unitOfMeasurement,
    defectNotes: formValues.defectNotes,
    id: formValues.id,
    localId: formValues.localId,
    isValid: true // Припускаємо, що дані від форми валідні
  };
};

/**
 * Конвертація з OrderItemDto в OrderItemUI
 */
export const orderItemDtoToUI = (dto: OrderItemDto): OrderItemUI => {
  return {
    ...dto,
    isValid: true,
    finalPrice: dto.finalPrice || 0
  };
};

/**
 * Конвертація з OrderItemUI в OrderItemDto
 */
export const orderItemUIToDto = (ui: OrderItemUI): OrderItemDto => {
  const dto: OrderItemDto = {
    name: ui.name || '',
    quantity: ui.quantity || 0,
    unitOfMeasurement: ui.unitOfMeasurement,
    serviceCategory: ui.categoryId ? { id: ui.categoryId } : undefined,
    defectNotes: ui.defectNotes
  };
  
  if (ui.id) dto.id = ui.id;
  
  return dto;
};
