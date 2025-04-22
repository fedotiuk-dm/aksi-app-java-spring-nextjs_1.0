/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RegisterRequest = {
    properties: {
        email: {
            type: 'string',
            minLength: 1,
        },
        name: {
            type: 'string',
            maxLength: 50,
            minLength: 2,
        },
        password: {
            type: 'string',
            maxLength: 2147483647,
            minLength: 6,
        },
        position: {
            type: 'string',
        },
        role: {
            type: 'Enum',
        },
        username: {
            type: 'string',
            maxLength: 20,
            minLength: 3,
            pattern: '^[a-zA-Z0-9._-]+$',
        },
    },
} as const;
