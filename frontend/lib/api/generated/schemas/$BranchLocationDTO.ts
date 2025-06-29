/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BranchLocationDTO = {
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
        },
        name: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        address: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        phone: {
            type: 'string',
            pattern: '^\\+ ? [0-9\\s-()]{10,15}$',
        },
        code: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        active: {
            type: 'boolean',
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
