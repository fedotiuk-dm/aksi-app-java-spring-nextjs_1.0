/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BranchLocationDTO } from './BranchLocationDTO';
import type { ClientResponse } from './ClientResponse';
import type { OrderItemDTO } from './OrderItemDTO';
export type OrderDTO = {
    id?: string;
    receiptNumber: string;
    tagNumber?: string;
    client: ClientResponse;
    clientId?: string;
    items?: Array<OrderItemDTO>;
    totalAmount?: number;
    discountAmount?: number;
    finalAmount?: number;
    prepaymentAmount?: number;
    balanceAmount?: number;
    branchLocation: BranchLocationDTO;
    branchLocationId?: string;
    status: OrderDTO.status;
    createdDate?: string;
    updatedDate?: string;
    expectedCompletionDate?: string;
    completedDate?: string;
    customerNotes?: string;
    internalNotes?: string;
    expediteType?: OrderDTO.expediteType;
    completionComments?: string;
    termsAccepted?: boolean;
    finalizedAt?: string;
    express?: boolean;
    draft?: boolean;
    emailed?: boolean;
    printed?: boolean;
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
    export enum expediteType {
        STANDARD = 'STANDARD',
        EXPRESS_48H = 'EXPRESS_48H',
        EXPRESS_24H = 'EXPRESS_24H',
    }
}

