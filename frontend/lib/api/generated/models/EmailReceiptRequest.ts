/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Параметри відправки квитанції
 */
export type EmailReceiptRequest = {
    orderId: string;
    recipientEmail: string;
    subject?: string;
    message?: string;
    includeSignature?: boolean;
};

