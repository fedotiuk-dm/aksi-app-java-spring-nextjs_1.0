/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientResponse = {
    properties: {
        address: {
            type: 'string',
        },
        birthDate: {
            type: 'string',
            format: 'date',
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
        lastOrderDate: {
            type: 'string',
            format: 'date-time',
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
        orderCount: {
            type: 'number',
            format: 'int32',
        },
        phone: {
            type: 'string',
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
        totalSpent: {
            type: 'number',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
