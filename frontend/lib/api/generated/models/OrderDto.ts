/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientDTO } from './ClientDTO';
import type { OrderItemDto } from './OrderItemDto';
export type OrderDto = {
    amountDue?: number;
    amountPaid?: number;
    basePrice?: number;
    client?: ClientDTO;
    clientRequirements?: string;
    clientSignature?: string;
    createdAt?: string;
    customDiscountPercentage?: number;
    discountType?: OrderDto.discountType;
    expectedCompletionDate?: string;
    id?: string;
    items?: Array<OrderItemDto>;
    notes?: string;
    paymentMethod?: OrderDto.paymentMethod;
    receiptNumber?: string;
    receptionPoint?: string;
    status?: OrderDto.status;
    totalPrice?: number;
    uniqueTag?: string;
    urgencyType?: OrderDto.urgencyType;
};
export namespace OrderDto {
    export enum discountType {
        NONE = 'NONE',
        EVERCARD = 'EVERCARD',
        SOCIAL_MEDIA = 'SOCIAL_MEDIA',
        MILITARY = 'MILITARY',
        CUSTOM = 'CUSTOM',
    }
    export enum paymentMethod {
        TERMINAL = 'TERMINAL',
        CASH = 'CASH',
        BANK_TRANSFER = 'BANK_TRANSFER',
    }
    export enum status {
        CREATED = 'CREATED',
        IN_PROGRESS = 'IN_PROGRESS',
        READY = 'READY',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }
    export enum urgencyType {
        STANDARD = 'STANDARD',
        HOURS_48 = 'HOURS_48',
        HOURS_24 = 'HOURS_24',
    }
}

