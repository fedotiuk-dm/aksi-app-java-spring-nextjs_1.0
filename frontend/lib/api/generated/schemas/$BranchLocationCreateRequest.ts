/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BranchLocationCreateRequest = {
    properties: {
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
            pattern: '^[A-Z0-9]{2,5}$',
        },
        active: {
            type: 'boolean',
        },
    },
} as const;
