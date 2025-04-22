/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderCreateRequest = {
    properties: {
        amountPaid: {
            type: 'number',
            isRequired: true,
        },
        clientId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        clientRequirements: {
            type: 'string',
        },
        customDiscountPercentage: {
            type: 'number',
            format: 'int32',
        },
        discountType: {
            type: 'Enum',
            isRequired: true,
        },
        expectedCompletionDate: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        notes: {
            type: 'string',
        },
        paymentMethod: {
            type: 'Enum',
            isRequired: true,
        },
        receiptNumber: {
            type: 'string',
            minLength: 1,
        },
        receptionPointId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        uniqueTag: {
            type: 'string',
            minLength: 1,
        },
        urgencyType: {
            type: 'Enum',
            isRequired: true,
        },
    },
} as const;
