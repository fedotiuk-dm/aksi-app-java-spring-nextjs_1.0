/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderSummaryDTO = {
    id?: string;
    receiptNumber?: string;
    status?: OrderSummaryDTO.status;
    totalAmount?: number;
    createdAt?: string;
    completionDate?: string;
    itemCount?: number;
};
export namespace OrderSummaryDTO {
    export enum status {
        DRAFT = 'DRAFT',
        NEW = 'NEW',
        IN_PROGRESS = 'IN_PROGRESS',
        COMPLETED = 'COMPLETED',
        DELIVERED = 'DELIVERED',
        CANCELLED = 'CANCELLED',
    }
}

