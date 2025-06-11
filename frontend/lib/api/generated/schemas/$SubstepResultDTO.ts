/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SubstepResultDTO = {
    properties: {
        sessionId: {
            type: 'string',
            format: 'uuid',
        },
        currentState: {
            type: 'Enum',
        },
        previousState: {
            type: 'Enum',
        },
        success: {
            type: 'boolean',
        },
        message: {
            type: 'string',
        },
        details: {
            type: 'string',
        },
        data: {
            type: 'PhotoDocumentationDTO',
        },
        availableEvents: {
            type: 'array',
            contains: {
                type: 'Enum',
            },
        },
        validationErrors: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        timestamp: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
