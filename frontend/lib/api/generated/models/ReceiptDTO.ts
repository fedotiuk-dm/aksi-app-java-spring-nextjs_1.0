/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReceiptBranchInfoDTO } from './ReceiptBranchInfoDTO';
import type { ReceiptClientInfoDTO } from './ReceiptClientInfoDTO';
import type { ReceiptFinancialInfoDTO } from './ReceiptFinancialInfoDTO';
import type { ReceiptItemDTO } from './ReceiptItemDTO';
export type ReceiptDTO = {
    additionalNotes?: string;
    branchInfo?: ReceiptBranchInfoDTO;
    clientInfo?: ReceiptClientInfoDTO;
    createdDate?: string;
    customerSignatureData?: string;
    expectedCompletionDate?: string;
    expediteType?: ReceiptDTO.expediteType;
    financialInfo?: ReceiptFinancialInfoDTO;
    items?: Array<ReceiptItemDTO>;
    legalTerms?: string;
    orderId?: string;
    paymentMethod?: ReceiptDTO.paymentMethod;
    receiptNumber?: string;
    tagNumber?: string;
    termsAccepted?: boolean;
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

