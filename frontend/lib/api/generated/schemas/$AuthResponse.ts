/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AuthResponse = {
    properties: {
        accessToken: {
            type: 'string',
        },
        email: {
            type: 'string',
        },
        expiresIn: {
            type: 'number',
            format: 'int64',
        },
        id: {
            type: 'string',
            format: 'uuid',
        },
        name: {
            type: 'string',
        },
        position: {
            type: 'string',
        },
        refreshToken: {
            type: 'string',
        },
        role: {
            type: 'Enum',
        },
        username: {
            type: 'string',
        },
    },
} as const;
