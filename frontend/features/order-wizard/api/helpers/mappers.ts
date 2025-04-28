import { OrderDTO, OrderItemDTO } from '@/lib/api';
import { Order, OrderItem } from '../../model/types/types';
// Імпортуємо типи для правильної типізації при де/серіалізації JSON
// @ts-ignore
import { Defect, Stain } from '../../model/schema/item-defects.schema';
import type { UUID } from 'node:crypto';
import dayjs from 'dayjs';

/**
 * Безпечне отримання UUID з різних джерел (новий API або старий)
 */
const safeUUID = (value: string | undefined): UUID => {
  return value ? (String(value) as UUID) : ('' as UUID);
};

/**
 * Перетворення OrderDTO з API в модель Order
 */
export const mapApiOrderToModelOrder = (apiOrder: OrderDTO): Order => {
  if (!apiOrder) return {} as Order;

  // Отримуємо ID клієнта з прямого поля або з вкладеного об'єкта
  const clientId = apiOrder.clientId || apiOrder.client?.id;

  // Отримуємо ID філії з прямого поля або з вкладеного об'єкта
  const branchLocationId =
    apiOrder.branchLocationId || apiOrder.branchLocation?.id;

  return {
    id: apiOrder.id ? (String(apiOrder.id) as UUID) : undefined,
    receiptNumber: apiOrder.receiptNumber,
    tagNumber: apiOrder.tagNumber,
    clientId: safeUUID(clientId),
    items: apiOrder.items ? apiOrder.items.map(mapApiItemToModelItem) : [],
    totalAmount: apiOrder.totalAmount || 0,
    discountAmount: apiOrder.discountAmount || 0,
    finalAmount: apiOrder.finalAmount || 0,
    prepaymentAmount: apiOrder.prepaymentAmount || 0,
    balanceAmount: apiOrder.balanceAmount || 0,
    branchLocationId: safeUUID(branchLocationId),
    status: apiOrder.status
      ? (String(apiOrder.status) as Order['status'])
      : undefined,
    createdDate: apiOrder.createdDate
      ? new Date(apiOrder.createdDate)
      : undefined,
    updatedDate: apiOrder.updatedDate
      ? new Date(apiOrder.updatedDate)
      : undefined,
    expectedCompletionDate: apiOrder.expectedCompletionDate
      ? new Date(apiOrder.expectedCompletionDate)
      : undefined,
    completedDate: apiOrder.completedDate
      ? new Date(apiOrder.completedDate)
      : undefined,
    customerNotes: apiOrder.customerNotes,
    internalNotes: apiOrder.internalNotes,
    express: apiOrder.express || false,
    draft: apiOrder.draft || false,
  };
};

/**
 * Перетворення OrderItemDTO з API в модель OrderItem
 */
export const mapApiItemToModelItem = (apiItem: OrderItemDTO): OrderItem => {
  if (!apiItem) return {} as OrderItem;

  // Перетворюємо рядки JSON у відповідні типізовані масиви
  const defectsArray: Defect[] = apiItem.defects ? JSON.parse(apiItem.defects) : [];
  const stainsArray: Stain[] = apiItem.stains ? JSON.parse(apiItem.stains as string) : [];

  return {
    id: apiItem.id as UUID,
    name: apiItem.name || '',
    description: apiItem.description || '',
    quantity: apiItem.quantity || 1,
    unitPrice: apiItem.unitPrice || 0,
    totalPrice: apiItem.totalPrice || 0,
    category: apiItem.category || '',
    color: apiItem.color || '',
    material: apiItem.material || '',
    defects: defectsArray,
    stains: stainsArray,
    specialInstructions: apiItem.specialInstructions || '',
  };
};

/**
 * Перетворення моделі OrderItem в OrderItemDTO для API
 */
export const mapModelItemToApiItem = (item: OrderItem): OrderItemDTO => {
  return {
    id: item.id as string,
    name: item.name,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
    category: item.category,
    color: item.color,
    material: item.material,
    defects: item.defects ? JSON.stringify(item.defects) : undefined,
    stains: item.stains ? JSON.stringify(item.stains) : undefined,
    specialInstructions: item.specialInstructions,
  };
};

/**
 * Форматування дати для API
 */
export const formatDate = (date?: Date | null): string | undefined => {
  if (!date) return undefined;
  return dayjs(date).format('YYYY-MM-DD');
};
