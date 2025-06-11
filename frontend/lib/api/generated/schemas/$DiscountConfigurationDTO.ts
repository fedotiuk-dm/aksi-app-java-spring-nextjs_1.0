/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DiscountConfigurationDTO = {
    properties: {
        sessionId: {
            type: 'string',
            format: 'uuid',
        },
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        discountRequest: {
            type: 'OrderDiscountRequest',
        },
        discountResponse: {
            type: 'OrderDiscountResponse',
        },
        excludedCategoryIds: {
            type: 'array',
            contains: {
                type: 'string',
                format: 'uuid',
            },
        },
        originalAmount: {
            type: 'number',
        },
        discountAmount: {
            type: 'number',
        },
        finalAmount: {
            type: 'number',
        },
        isValid: {
            type: 'boolean',
        },
        validationMessage: {
            type: 'string',
        },
        lastUpdated: {
            type: 'string',
            format: 'date-time',
        },
        discountType: {
            type: 'Enum',
        },
        discountPercentage: {
            type: 'number',
            format: 'int32',
        },
        discountDescription: {
            type: 'string',
        },
        readyForCompletion: {
            type: 'boolean',
        },
        discountConfigComplete: {
            type: 'boolean',
        },
    },
} as const;
