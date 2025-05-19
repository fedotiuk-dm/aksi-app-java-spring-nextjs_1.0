/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReceiptBranchInfoDTO } from './ReceiptBranchInfoDTO';
import type { ReceiptClientInfoDTO } from './ReceiptClientInfoDTO';
import type { ReceiptFinancialInfoDTO } from './ReceiptFinancialInfoDTO';
import type { ReceiptItemDTO } from './ReceiptItemDTO';
export type ReceiptDTO = {
    orderId?: string;
    receiptNumber?: string;
    tagNumber?: string;
    createdDate?: string;
    expectedCompletionDate?: string;
    expediteType?: ReceiptDTO.expediteType;
    branchInfo?: ReceiptBranchInfoDTO;
    clientInfo?: ReceiptClientInfoDTO;
    items?: Array<ReceiptItemDTO>;
    financialInfo?: ReceiptFinancialInfoDTO;
    legalTerms?: string;
    customerSignatureData?: string;
    termsAccepted?: boolean;
    additionalNotes?: string;
    paymentMethod?: ReceiptDTO.paymentMethod;
};
export namespace ReceiptDTO {
    export enum expediteType {
        STANDARD = 'STANDARD',
        EXPRESS_48H = 'EXPRESS_48H',
        EXPRESS_24H = 'EXPRESS_24H',
    }
    export enum paymentMethod {
        TERMINAL = 'TERMINAL',
        CASH = 'CASH',
        BANK_TRANSFER = 'BANK_TRANSFER',
    }
}

