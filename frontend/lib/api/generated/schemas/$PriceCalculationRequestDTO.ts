/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PriceCalculationRequestDTO = {
    description: `Запит на розрахунок ціни для предмета`,
    properties: {
        categoryCode: {
            type: 'string',
            description: `Код категорії послуги`,
            isRequired: true,
        },
        itemName: {
            type: 'string',
            description: `Найменування предмету з прайс-листа`,
            isRequired: true,
        },
        color: {
            type: 'string',
            description: `Колір предмету`,
        },
        quantity: {
            type: 'number',
            description: `Кількість предметів`,
            isRequired: true,
            format: 'int32',
        },
        modifierCodes: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        rangeModifierValues: {
            type: 'array',
            contains: {
                type: 'RangeModifierValue',
            },
        },
        fixedModifierQuantities: {
            type: 'array',
            contains: {
                type: 'FixedModifierQuantity',
            },
        },
        expedited: {
            type: 'boolean',
            description: `Чи термінове замовлення`,
        },
        expeditePercent: {
            type: 'number',
            description: `Відсоток надбавки за терміновість`,
        },
        discountPercent: {
            type: 'number',
            description: `Відсоток знижки`,
        },
    },
} as const;
