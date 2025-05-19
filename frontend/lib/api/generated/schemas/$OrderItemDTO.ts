/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderItemDTO = {
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
        },
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        name: {
            type: 'string',
            isRequired: true,
            maxLength: 255,
        },
        description: {
            type: 'string',
            maxLength: 1000,
        },
        quantity: {
            type: 'number',
            isRequired: true,
            format: 'int32',
            minimum: 1,
        },
        unitPrice: {
            type: 'number',
            isRequired: true,
        },
        totalPrice: {
            type: 'number',
        },
        category: {
            type: 'string',
        },
        color: {
            type: 'string',
        },
        material: {
            type: 'string',
        },
        unitOfMeasure: {
            type: 'string',
        },
        defects: {
            type: 'string',
        },
        specialInstructions: {
            type: 'string',
            maxLength: 500,
        },
        fillerType: {
            type: 'string',
        },
        fillerCompressed: {
            type: 'boolean',
        },
        wearDegree: {
            type: 'string',
        },
        stains: {
            type: 'string',
        },
        otherStains: {
            type: 'string',
        },
        defectsAndRisks: {
            type: 'string',
        },
        noGuaranteeReason: {
            type: 'string',
        },
        defectsNotes: {
            type: 'string',
            maxLength: 1000,
        },
    },
} as const;
