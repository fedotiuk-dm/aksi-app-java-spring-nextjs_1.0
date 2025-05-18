/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderItemDetailedDTO = {
    description: `Детальна інформація про предмет замовлення з розрахунком вартості`,
    properties: {
        basePrice: {
            type: 'number',
            description: `Базова ціна предмета`,
        },
        category: {
            type: 'string',
            description: `Категорія послуги`,
        },
        color: {
            type: 'string',
            description: `Колір предмета`,
        },
        defectNotes: {
            type: 'string',
            description: `Примітки щодо дефектів`,
        },
        defects: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        filler: {
            type: 'string',
            description: `Наповнювач предмета`,
        },
        fillerClumped: {
            type: 'boolean',
            description: `Прапорець, що вказує, чи є наповнювач збитим`,
        },
        finalPrice: {
            type: 'number',
            description: `Фінальна ціна предмета`,
        },
        id: {
            type: 'string',
            description: `ID предмета замовлення`,
            format: 'uuid',
        },
        material: {
            type: 'string',
            description: `Матеріал предмета`,
        },
        name: {
            type: 'string',
            description: `Найменування предмета`,
        },
        photos: {
            type: 'array',
            contains: {
                type: 'OrderItemPhotoDTO',
            },
        },
        priceModifiers: {
            type: 'array',
            contains: {
                type: 'PriceModifierDTO',
            },
        },
        quantity: {
            type: 'number',
            description: `Кількість`,
        },
        stains: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        unitOfMeasure: {
            type: 'string',
            description: `Одиниця виміру`,
        },
        wearPercentage: {
            type: 'number',
            description: `Ступінь зносу (у відсотках)`,
            format: 'int32',
        },
    },
} as const;
