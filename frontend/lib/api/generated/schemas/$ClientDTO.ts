/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientDTO = {
    properties: {
        active: {
            type: 'boolean',
        },
        additionalPhone: {
            type: 'string',
        },
        address: {
            type: 'string',
        },
        birthDate: {
            type: 'string',
            format: 'date-time',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
        },
        email: {
            type: 'string',
        },
        id: {
            type: 'string',
            format: 'uuid',
        },
        lastOrderDate: {
            type: 'string',
            format: 'date-time',
        },
        loyaltyLevel: {
            type: 'number',
            format: 'int32',
        },
        loyaltyPoints: {
            type: 'number',
            format: 'int32',
        },
        name: {
            type: 'string',
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
            type: 'string',
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
