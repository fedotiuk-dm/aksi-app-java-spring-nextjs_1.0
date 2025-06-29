/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PhotoDocumentationDTO = {
    properties: {
        sessionId: {
            type: 'string',
            format: 'uuid',
        },
        itemId: {
            type: 'string',
            format: 'uuid',
        },
        photos: {
            type: 'array',
            contains: {
                type: 'OrderItemPhotoDTO',
            },
        },
        maxPhotosAllowed: {
            type: 'number',
            format: 'int32',
        },
        maxFileSizeMB: {
            type: 'number',
            format: 'int64',
        },
        documentationCompleted: {
            type: 'boolean',
        },
        startTime: {
            type: 'string',
            format: 'date-time',
        },
        completionTime: {
            type: 'string',
            format: 'date-time',
        },
        notes: {
            type: 'string',
        },
    },
} as const;
