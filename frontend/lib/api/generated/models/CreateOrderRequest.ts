/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemDTO } from './OrderItemDTO';
/**
 * Дані для чернетки замовлення
 */
export type CreateOrderRequest = {
    branchLocationId: string;
    clientId: string;
    customerNotes?: string;
    discountAmount?: number;
    draft?: boolean;
    expectedCompletionDate?: string;
    express?: boolean;
    internalNotes?: string;
    items?: Array<OrderItemDTO>;
    prepaymentAmount?: number;
    tagNumber?: string;
};

