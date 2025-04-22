/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderItemCreateRequest = {
    properties: {
        childSized: {
            type: 'boolean',
        },
        clumpedFiller: {
            type: 'boolean',
        },
        color: {
            type: 'string',
            minLength: 1,
        },
        defectNotes: {
            type: 'string',
        },
        defects: {
            type: 'array',
            contains: {
                type: 'OrderItemDefectCreateRequest',
            },
        },
        filler: {
            type: 'string',
        },
        heavilySoiled: {
            type: 'boolean',
        },
        heavilySoiledPercentage: {
            type: 'number',
            format: 'int32',
        },
        manualCleaning: {
            type: 'boolean',
        },
        material: {
            type: 'string',
            minLength: 1,
        },
        modifiers: {
            type: 'array',
            contains: {
                type: 'OrderItemModifierCreateRequest',
            },
        },
        name: {
            type: 'string',
            minLength: 1,
        },
        noWarranty: {
            type: 'boolean',
        },
        noWarrantyReason: {
            type: 'string',
        },
        priceListItemId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        quantity: {
            type: 'number',
            isRequired: true,
        },
        serviceCategoryId: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        stains: {
            type: 'array',
            contains: {
                type: 'OrderItemStainCreateRequest',
            },
        },
        unitOfMeasurement: {
            type: 'string',
            minLength: 1,
        },
        wearPercentage: {
            type: 'number',
            format: 'int32',
        },
    },
} as const;
