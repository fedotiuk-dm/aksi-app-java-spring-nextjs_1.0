/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BranchLocationDTO } from './BranchLocationDTO';
import type { ClientResponse } from './ClientResponse';
import type { OrderItemDTO } from './OrderItemDTO';
export type OrderDTO = {
    balanceAmount?: number;
    branchLocation: BranchLocationDTO;
    branchLocationId?: string;
    client: ClientResponse;
    clientId?: string;
    completedDate?: string;
    createdDate?: string;
    customerNotes?: string;
    discountAmount?: number;
    draft?: boolean;
    expectedCompletionDate?: string;
    express?: boolean;
    finalAmount?: number;
    id?: string;
    internalNotes?: string;
    items?: Array<OrderItemDTO>;
    prepaymentAmount?: number;
    receiptNumber?: string;
    status: OrderDTO.status;
    tagNumber?: string;
    totalAmount?: number;
    updatedDate?: string;
};
export namespace OrderDTO {
    export enum status {
        DRAFT = 'DRAFT',
        NEW = 'NEW',
        IN_PROGRESS = 'IN_PROGRESS',
        COMPLETED = 'COMPLETED',
        DELIVERED = 'DELIVERED',
        CANCELLED = 'CANCELLED',
    }
}

