/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ReceiptDTO = {
    properties: {
        additionalNotes: {
            type: 'string',
        },
        branchInfo: {
            type: 'ReceiptBranchInfoDTO',
        },
        clientInfo: {
            type: 'ReceiptClientInfoDTO',
        },
        createdDate: {
            type: 'string',
            format: 'date-time',
        },
        customerSignatureData: {
            type: 'string',
        },
        expectedCompletionDate: {
            type: 'string',
            format: 'date-time',
        },
        expediteType: {
            type: 'Enum',
        },
        financialInfo: {
            type: 'ReceiptFinancialInfoDTO',
        },
        items: {
            type: 'array',
            contains: {
                type: 'ReceiptItemDTO',
            },
        },
        legalTerms: {
            type: 'string',
        },
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        paymentMethod: {
            type: 'Enum',
        },
        receiptNumber: {
            type: 'string',
        },
        tagNumber: {
            type: 'string',
        },
        termsAccepted: {
            type: 'boolean',
        },
    },
} as const;
