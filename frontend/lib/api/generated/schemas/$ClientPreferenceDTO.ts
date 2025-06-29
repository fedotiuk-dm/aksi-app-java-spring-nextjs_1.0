/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientPreferenceDTO = {
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
        },
        key: {
            type: 'string',
            isRequired: true,
            maxLength: 100,
        },
        value: {
            type: 'string',
            maxLength: 255,
        },
    },
} as const;
