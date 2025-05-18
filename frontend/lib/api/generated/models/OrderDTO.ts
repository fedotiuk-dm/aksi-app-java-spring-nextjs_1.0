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
    completionComments?: string;
    createdDate?: string;
    customerNotes?: string;
    discountAmount?: number;
    draft?: boolean;
    emailed?: boolean;
    expectedCompletionDate?: string;
    expediteType?: OrderDTO.expediteType;
    express?: boolean;
    finalAmount?: number;
    finalizedAt?: string;
    id?: string;
    internalNotes?: string;
    items?: Array<OrderItemDTO>;
    prepaymentAmount?: number;
    printed?: boolean;
    receiptNumber?: string;
    status: OrderDTO.status;
    tagNumber?: string;
    termsAccepted?: boolean;
    totalAmount?: number;
    updatedDate?: string;
};
export namespace OrderDTO {
    export enum expediteType {
        STANDARD = 'STANDARD',
        EXPRESS_48H = 'EXPRESS_48H',
        EXPRESS_24H = 'EXPRESS_24H',
    }
    export enum status {
        DRAFT = 'DRAFT',
        NEW = 'NEW',
        IN_PROGRESS = 'IN_PROGRESS',
        COMPLETED = 'COMPLETED',
        DELIVERED = 'DELIVERED',
        CANCELLED = 'CANCELLED',
    }
}

