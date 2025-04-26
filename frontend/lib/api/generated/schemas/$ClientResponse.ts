/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientResponse = {
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
        createdAt: {
            type: 'string',
            format: 'date-time',
        },
        email: {
            type: 'string',
        },
        firstName: {
            type: 'string',
        },
        fullName: {
            type: 'string',
        },
        id: {
            type: 'string',
            format: 'uuid',
        },
        lastName: {
            type: 'string',
        },
        phone: {
            type: 'string',
        },
        source: {
            type: 'Enum',
        },
        sourceDetails: {
            type: 'string',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
