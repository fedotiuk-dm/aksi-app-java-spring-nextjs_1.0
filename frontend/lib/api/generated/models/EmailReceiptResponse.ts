/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EmailReceiptResponse = {
    orderId?: string;
    recipientEmail?: string;
    sentAt?: string;
    messageId?: string;
    status?: EmailReceiptResponse.status;
    subject?: string;
    message?: string;
};
export namespace EmailReceiptResponse {
    export enum status {
        SENT = 'SENT',
        FAILED = 'FAILED',
        PENDING = 'PENDING',
    }
}

