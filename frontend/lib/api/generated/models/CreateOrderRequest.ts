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
    expediteType?: CreateOrderRequest.expediteType;
    internalNotes?: string;
    items?: Array<OrderItemDTO>;
    prepaymentAmount?: number;
    tagNumber?: string;
};
export namespace CreateOrderRequest {
    export enum expediteType {
        STANDARD = 'STANDARD',
        EXPRESS_48H = 'EXPRESS_48H',
        EXPRESS_24H = 'EXPRESS_24H',
    }
}

