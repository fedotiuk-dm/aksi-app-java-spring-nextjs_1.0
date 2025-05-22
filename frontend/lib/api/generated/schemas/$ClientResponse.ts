/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientResponse = {
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
        },
        lastName: {
            type: 'string',
        },
        firstName: {
            type: 'string',
        },
        fullName: {
            type: 'string',
        },
        phone: {
            type: 'string',
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
        createdAt: {
            type: 'string',
            format: 'date-time',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
