/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Stage3Context = {
    properties: {
        sessionId: {
            type: 'string',
            format: 'uuid',
        },
        currentState: {
            type: 'Enum',
        },
        lastUpdated: {
            type: 'string',
            format: 'date-time',
        },
        executionParams: {
            type: 'ExecutionParamsDTO',
        },
        discountConfiguration: {
            type: 'DiscountConfigurationDTO',
        },
        paymentConfiguration: {
            type: 'PaymentConfigurationDTO',
        },
        additionalInfo: {
            type: 'AdditionalInfoDTO',
        },
        lastAction: {
            type: 'string',
        },
        lastError: {
            type: 'string',
        },
        valid: {
            type: 'boolean',
        },
        completedSubstepsCount: {
            type: 'number',
            format: 'int32',
        },
    },
} as const;
