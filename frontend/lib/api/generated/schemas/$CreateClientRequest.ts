/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateClientRequest = {
    description: `Дані нового клієнта`,
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
            minLength: 1,
        },
        lastName: {
            type: 'string',
            minLength: 1,
        },
        phone: {
            type: 'string',
            minLength: 1,
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
