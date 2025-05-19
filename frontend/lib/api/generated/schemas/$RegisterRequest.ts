/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RegisterRequest = {
    properties: {
        name: {
            type: 'string',
            isRequired: true,
            maxLength: 50,
            minLength: 2,
        },
        username: {
            type: 'string',
            isRequired: true,
            maxLength: 20,
            minLength: 3,
            pattern: '^[a-zA-Z0-9._-]+$',
        },
        email: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        password: {
            type: 'string',
            isRequired: true,
            maxLength: 2147483647,
            minLength: 6,
        },
        role: {
            type: 'Enum',
        },
        position: {
            type: 'string',
        },
    },
} as const;
