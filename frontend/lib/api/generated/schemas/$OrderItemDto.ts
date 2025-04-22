/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderItemDto = {
    properties: {
        basePrice: {
            type: 'number',
        },
        childSized: {
            type: 'boolean',
        },
        clumpedFiller: {
            type: 'boolean',
        },
        color: {
            type: 'string',
        },
        defectNotes: {
            type: 'string',
        },
        defects: {
            type: 'array',
            contains: {
                type: 'OrderItemDefectDto',
            },
        },
        filler: {
            type: 'string',
        },
        finalPrice: {
            type: 'number',
        },
        heavilySoiled: {
            type: 'boolean',
        },
        heavilySoiledPercentage: {
            type: 'number',
            format: 'int32',
        },
        id: {
            type: 'string',
            format: 'uuid',
        },
        manualCleaning: {
            type: 'boolean',
        },
        material: {
            type: 'string',
        },
        modifiers: {
            type: 'array',
            contains: {
                type: 'OrderItemModifierDto',
            },
        },
        name: {
            type: 'string',
        },
        noWarranty: {
            type: 'boolean',
        },
        noWarrantyReason: {
            type: 'string',
        },
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        photos: {
            type: 'array',
            contains: {
                type: 'OrderItemPhotoDto',
            },
        },
        priceListItem: {
            type: 'PriceListItemDto',
        },
        quantity: {
            type: 'number',
        },
        serviceCategory: {
            type: 'ServiceCategoryDto',
        },
        stains: {
            type: 'array',
            contains: {
                type: 'OrderItemStainDto',
            },
        },
        unitOfMeasurement: {
            type: 'string',
        },
        wearPercentage: {
            type: 'number',
            format: 'int32',
        },
    },
} as const;
