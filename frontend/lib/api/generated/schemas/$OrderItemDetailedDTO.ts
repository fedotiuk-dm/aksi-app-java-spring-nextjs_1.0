/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderItemDetailedDTO = {
    description: `Детальна інформація про предмет замовлення з розрахунком вартості`,
    properties: {
        id: {
            type: 'string',
            description: `ID предмета замовлення`,
            format: 'uuid',
        },
        name: {
            type: 'string',
            description: `Найменування предмета`,
        },
        category: {
            type: 'string',
            description: `Категорія послуги`,
        },
        quantity: {
            type: 'number',
            description: `Кількість`,
        },
        unitOfMeasure: {
            type: 'string',
            description: `Одиниця виміру`,
        },
        material: {
            type: 'string',
            description: `Матеріал предмета`,
        },
        color: {
            type: 'string',
            description: `Колір предмета`,
        },
        filler: {
            type: 'string',
            description: `Наповнювач предмета`,
        },
        fillerClumped: {
            type: 'boolean',
            description: `Прапорець, що вказує, чи є наповнювач збитим`,
        },
        wearPercentage: {
            type: 'number',
            description: `Ступінь зносу (у відсотках)`,
            format: 'int32',
        },
        stains: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        defects: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        defectNotes: {
            type: 'string',
            description: `Примітки щодо дефектів`,
        },
        basePrice: {
            type: 'number',
            description: `Базова ціна предмета`,
        },
        priceModifiers: {
            type: 'array',
            contains: {
                type: 'PriceModifierDTO',
            },
        },
        finalPrice: {
            type: 'number',
            description: `Фінальна ціна предмета`,
        },
        photos: {
            type: 'array',
            contains: {
                type: 'OrderItemPhotoDTO',
            },
        },
    },
} as const;
