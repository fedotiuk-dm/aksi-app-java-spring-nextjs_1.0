/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ValidationResult = {
    properties: {
        valid: {
            type: 'boolean',
        },
        errors: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        warnings: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        message: {
            type: 'string',
        },
        firstError: {
            type: 'string',
        },
        errorCount: {
            type: 'number',
            format: 'int32',
        },
        firstWarning: {
            type: 'string',
        },
        fullMessage: {
            type: 'string',
        },
        warningCount: {
            type: 'number',
            format: 'int32',
        },
    },
} as const;
