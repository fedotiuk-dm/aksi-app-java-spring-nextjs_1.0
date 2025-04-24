/**
 * Адаптери для конвертації між типами API та формами
 */
import { FullOrderFormValues } from '../schema/order.schema';
import { OrderCreateRequest } from '@/lib/api';
import { OrderDto } from '@/lib/api';
import dayjs from 'dayjs';

/**
 * Конвертує дані з форми базової інформації у частину OrderCreateRequest
 */
export const basicInfoToOrderCreateRequest = (
  formValues: {
    uniqueTag?: string;
    receptionPointId: string;
    receiptNumber?: string;
  }
): Partial<OrderCreateRequest> => {
  return {
    uniqueTag: formValues.uniqueTag,
    receptionPointId: formValues.receptionPointId,
    receiptNumber: formValues.receiptNumber,
  };
};

/**
 * Конвертує повні дані форми у OrderCreateRequest
 */
export const fullFormToOrderCreateRequest = (
  formValues: FullOrderFormValues
): OrderCreateRequest => {
  return {
    uniqueTag: formValues.uniqueTag,
    receptionPointId: formValues.receptionPointId,
    receiptNumber: formValues.receiptNumber,
    clientId: formValues.clientId,
    amountPaid: formValues.amountPaid,
    expectedCompletionDate: formValues.expectedCompletionDate,
    clientRequirements: formValues.clientRequirements,
    notes: formValues.notes,
    discountType: formValues.discountType,
    customDiscountPercentage: formValues.customDiscountPercentage,
    paymentMethod: formValues.paymentMethod,
    urgencyType: formValues.urgencyType,
  };
};

/**
 * Конвертує OrderDto у дані форми
 */
export const orderDtoToFormValues = (
  order: OrderDto
): FullOrderFormValues => {
  return {
    uniqueTag: order.uniqueTag,
    receptionPointId: order.receptionPoint || '',
    receiptNumber: order.receiptNumber,
    clientId: order.client?.id || '',
    amountPaid: order.amountPaid || 0,
    expectedCompletionDate: dayjs(order.expectedCompletionDate).format('YYYY-MM-DD'),
    clientRequirements: order.clientRequirements,
    notes: order.notes,
    discountType: order.discountType as OrderCreateRequest.discountType,
    customDiscountPercentage: order.customDiscountPercentage,
    paymentMethod: order.paymentMethod as OrderCreateRequest.paymentMethod,
    urgencyType: order.urgencyType as OrderCreateRequest.urgencyType,
  };
};
