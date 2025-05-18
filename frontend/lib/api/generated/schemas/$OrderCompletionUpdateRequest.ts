/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderCompletionUpdateRequest = {
    properties: {
        expectedCompletionDate: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        expediteType: {
            type: 'Enum',
            isRequired: true,
        },
        orderId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
    },
} as const;
