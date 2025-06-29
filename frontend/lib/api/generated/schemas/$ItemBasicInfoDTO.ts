/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ItemBasicInfoDTO = {
    properties: {
        itemId: {
            type: 'string',
            format: 'uuid',
        },
        serviceCategory: {
            type: 'ServiceCategoryDTO',
        },
        priceListItem: {
            type: 'PriceListItemDTO',
        },
        unitOfMeasure: {
            type: 'string',
        },
        quantity: {
            type: 'number',
        },
        totalBasePrice: {
            type: 'number',
        },
        valid: {
            type: 'boolean',
        },
        complete: {
            type: 'boolean',
        },
    },
} as const;
