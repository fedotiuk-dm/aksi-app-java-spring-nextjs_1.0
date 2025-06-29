/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderItemPhotoDTO = {
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
        },
        itemId: {
            type: 'string',
            format: 'uuid',
        },
        fileUrl: {
            type: 'string',
        },
        thumbnailUrl: {
            type: 'string',
        },
        annotations: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
