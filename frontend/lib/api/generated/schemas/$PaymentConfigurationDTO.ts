/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PaymentConfigurationDTO = {
    properties: {
        sessionId: {
            type: 'string',
            format: 'uuid',
        },
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        paymentRequest: {
            type: 'PaymentCalculationRequest',
        },
        paymentResponse: {
            type: 'PaymentCalculationResponse',
        },
        totalAmount: {
            type: 'number',
        },
        paidAmount: {
            type: 'number',
        },
        remainingAmount: {
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
        fullyPaid: {
            type: 'boolean',
        },
        prepaymentAmount: {
            type: 'number',
        },
        paymentMethod: {
            type: 'Enum',
        },
        readyForCompletion: {
            type: 'boolean',
        },
        paymentConfigComplete: {
            type: 'boolean',
        },
    },
} as const;
