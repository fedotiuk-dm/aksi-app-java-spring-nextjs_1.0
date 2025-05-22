/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateClientRequest = {
    description: `Дані нового клієнта`,
    properties: {
        lastName: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        firstName: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        phone: {
            type: 'string',
            isRequired: true,
            minLength: 1,
            pattern: '^\\+ ? [0-9]{10,15}$',
        },
        email: {
            type: 'string',
        },
        address: {
            type: 'string',
        },
        structuredAddress: {
            type: 'AddressDTO',
        },
        communicationChannels: {
            type: 'array',
            contains: {
                type: 'Enum',
            },
        },
        source: {
            type: 'Enum',
        },
        sourceDetails: {
            type: 'string',
        },
    },
} as const;
