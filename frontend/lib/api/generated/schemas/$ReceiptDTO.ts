/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ReceiptDTO = {
    properties: {
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        receiptNumber: {
            type: 'string',
        },
        tagNumber: {
            type: 'string',
        },
        createdDate: {
            type: 'string',
            format: 'date-time',
        },
        expectedCompletionDate: {
            type: 'string',
            format: 'date-time',
        },
        expediteType: {
            type: 'Enum',
        },
        branchInfo: {
            type: 'ReceiptBranchInfoDTO',
        },
        clientInfo: {
            type: 'ReceiptClientInfoDTO',
        },
        items: {
            type: 'array',
            contains: {
                type: 'ReceiptItemDTO',
            },
        },
        financialInfo: {
            type: 'ReceiptFinancialInfoDTO',
        },
        legalTerms: {
            type: 'string',
        },
        customerSignatureData: {
            type: 'string',
        },
        termsAccepted: {
            type: 'boolean',
        },
        additionalNotes: {
            type: 'string',
        },
        paymentMethod: {
            type: 'Enum',
        },
    },
} as const;
