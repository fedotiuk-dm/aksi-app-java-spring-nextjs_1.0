/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BranchLocationDTO = {
    properties: {
        active: {
            type: 'boolean',
        },
        address: {
            type: 'string',
            minLength: 1,
        },
        code: {
            type: 'string',
            minLength: 1,
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
        },
        id: {
            type: 'string',
            format: 'uuid',
        },
        name: {
            type: 'string',
            minLength: 1,
        },
        phone: {
            type: 'string',
            pattern: '^\\+ ? [0-9\\s-()]{10,15}$',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
