/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderFinalizationRequest = {
    orderId: string;
    signatureData?: string;
    termsAccepted?: boolean;
    sendReceiptByEmail?: boolean;
    generatePrintableReceipt?: boolean;
    comments?: string;
};

