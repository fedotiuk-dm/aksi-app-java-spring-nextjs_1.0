/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PriceListItemDTO = {
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
        },
        categoryId: {
            type: 'string',
            format: 'uuid',
        },
        catalogNumber: {
            type: 'number',
            format: 'int32',
        },
        name: {
            type: 'string',
        },
        unitOfMeasure: {
            type: 'string',
        },
        basePrice: {
            type: 'number',
        },
        priceBlack: {
            type: 'number',
        },
        priceColor: {
            type: 'number',
        },
        active: {
            type: 'boolean',
        },
    },
} as const;
