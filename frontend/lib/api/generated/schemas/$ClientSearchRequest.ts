/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientSearchRequest = {
    description: `Параметри пошуку та пагінації`,
    properties: {
        query: {
            type: 'string',
            isRequired: true,
            minLength: 1,
        },
        page: {
            type: 'number',
            format: 'int32',
        },
        size: {
            type: 'number',
            format: 'int32',
            minimum: 1,
        },
    },
} as const;
