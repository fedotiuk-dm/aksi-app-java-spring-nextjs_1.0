/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateClientRequest = {
    description: `Дані для оновлення клієнта`,
    properties: {
        address: {
            type: 'string',
        },
        communicationChannels: {
            type: 'array',
            contains: {
                type: 'Enum',
            },
        },
        email: {
            type: 'string',
        },
        firstName: {
            type: 'string',
        },
        lastName: {
            type: 'string',
        },
        phone: {
            type: 'string',
            pattern: '^\\+ ? [0-9]{10,15}$',
        },
        source: {
            type: 'Enum',
        },
        sourceDetails: {
            type: 'string',
        },
    },
} as const;
