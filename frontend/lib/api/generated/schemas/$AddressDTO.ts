/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AddressDTO = {
    properties: {
        city: {
            type: 'string',
            maxLength: 100,
            minLength: 2,
            pattern: '^[\\p{L}\\s.,\\-\']+$',
        },
        street: {
            type: 'string',
            maxLength: 150,
            minLength: 2,
            pattern: '^[\\p{L}\\s0-9.,\\-\']+$',
        },
        building: {
            type: 'string',
            maxLength: 20,
            pattern: '^[\\p{L}\\s0-9.,\\-\'/]+$',
        },
        apartment: {
            type: 'string',
            maxLength: 20,
            pattern: '^[\\p{L}\\s0-9.,\\-\'/]+$',
        },
        postalCode: {
            type: 'string',
            maxLength: 10,
            pattern: '^[0-9\\-]+$',
        },
        fullAddress: {
            type: 'string',
            maxLength: 500,
            minLength: 5,
        },
    },
} as const;
