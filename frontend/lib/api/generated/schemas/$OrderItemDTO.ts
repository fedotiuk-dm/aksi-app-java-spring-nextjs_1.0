/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderItemDTO = {
    properties: {
        category: {
            type: 'string',
        },
        color: {
            type: 'string',
        },
        defects: {
            type: 'string',
        },
        defectsAndRisks: {
            type: 'string',
        },
        defectsNotes: {
            type: 'string',
            maxLength: 1000,
        },
        description: {
            type: 'string',
            maxLength: 1000,
        },
        fillerCompressed: {
            type: 'boolean',
        },
        fillerType: {
            type: 'string',
        },
        id: {
            type: 'string',
            format: 'uuid',
        },
        material: {
            type: 'string',
        },
        name: {
            type: 'string',
            maxLength: 255,
        },
        noGuaranteeReason: {
            type: 'string',
        },
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        otherStains: {
            type: 'string',
        },
        quantity: {
            type: 'number',
            isRequired: true,
            format: 'int32',
            minimum: 1,
        },
        specialInstructions: {
            type: 'string',
            maxLength: 500,
        },
        stains: {
            type: 'string',
        },
        totalPrice: {
            type: 'number',
        },
        unitOfMeasure: {
            type: 'string',
        },
        unitPrice: {
            type: 'number',
            isRequired: true,
        },
        wearDegree: {
            type: 'string',
        },
    },
} as const;
