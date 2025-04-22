/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientCreateRequest = {
    properties: {
        additionalPhone: {
            type: 'string',
            pattern: '^\\+?[0-9]{10,15}$',
        },
        address: {
            type: 'string',
        },
        birthDate: {
            type: 'string',
            format: 'date',
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
            maxLength: 100,
            minLength: 2,
        },
        fullName: {
            type: 'string',
        },
        lastName: {
            type: 'string',
            maxLength: 100,
            minLength: 2,
        },
        loyaltyLevel: {
            type: 'Enum',
        },
        notes: {
            type: 'string',
        },
        phone: {
            type: 'string',
            minLength: 1,
            pattern: '^\\+?[0-9]{10,15}$',
        },
        source: {
            type: 'Enum',
        },
        status: {
            type: 'Enum',
        },
        tags: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
    },
} as const;
