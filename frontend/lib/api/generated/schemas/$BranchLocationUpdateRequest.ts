/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BranchLocationUpdateRequest = {
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
            pattern: '^[A-Z0-9]{2,5}$',
        },
        name: {
            type: 'string',
            minLength: 1,
        },
        phone: {
            type: 'string',
            pattern: '^\\+ ? [0-9\\s-()]{10,15}$',
        },
    },
} as const;
