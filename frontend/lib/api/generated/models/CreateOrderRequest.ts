/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemDTO } from './OrderItemDTO';
/**
 * Дані для чернетки замовлення
 */
export type CreateOrderRequest = {
    tagNumber?: string;
    clientId: string;
    items?: Array<OrderItemDTO>;
    discountAmount?: number;
    prepaymentAmount?: number;
    branchLocationId: string;
    expectedCompletionDate?: string;
    customerNotes?: string;
    internalNotes?: string;
    expediteType?: CreateOrderRequest.expediteType;
    draft?: boolean;
};
export namespace CreateOrderRequest {
    export enum expediteType {
        STANDARD = 'STANDARD',
        EXPRESS_48H = 'EXPRESS_48H',
        EXPRESS_24H = 'EXPRESS_24H',
    }
}

