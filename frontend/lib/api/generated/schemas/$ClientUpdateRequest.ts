/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientUpdateRequest = {
    properties: {
        address: {
            type: 'string',
        },
        birthDate: {
            type: 'string',
            format: 'date',
        },
        email: {
            type: 'string',
        },
        firstName: {
            type: 'string',
            maxLength: 100,
            minLength: 2,
        },
        lastName: {
            type: 'string',
            maxLength: 100,
            minLength: 2,
        },
        loyaltyLevel: {
            type: 'Enum',
        },
        loyaltyPoints: {
            type: 'number',
            format: 'int32',
        },
        notes: {
            type: 'string',
        },
        phone: {
            type: 'string',
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
