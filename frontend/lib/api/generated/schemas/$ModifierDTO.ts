/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ModifierDTO = {
    properties: {
        category: {
            type: 'string',
        },
        changeDescription: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        discount: {
            type: 'boolean',
            description: `Чи є модифікатор знижкою`,
        },
        id: {
            type: 'string',
        },
        maxValue: {
            type: 'number',
            description: `Максимальне значення для модифікаторів з діапазоном`,
            format: 'double',
        },
        minValue: {
            type: 'number',
            description: `Мінімальне значення для модифікаторів з діапазоном`,
            format: 'double',
        },
        name: {
            type: 'string',
        },
        percentage: {
            type: 'boolean',
            description: `Чи є модифікатор відсотковим`,
        },
        type: {
            type: 'string',
        },
        value: {
            type: 'number',
            description: `Значення модифікатора (відсоток або фіксована вартість)`,
            format: 'double',
        },
    },
} as const;
