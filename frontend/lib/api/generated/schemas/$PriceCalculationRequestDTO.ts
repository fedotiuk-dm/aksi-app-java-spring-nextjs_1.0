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
        color: {
            type: 'string',
            description: `Колір предмету`,
        },
        discountPercent: {
            type: 'number',
            description: `Відсоток знижки`,
        },
        expeditePercent: {
            type: 'number',
            description: `Відсоток надбавки за терміновість`,
        },
        expedited: {
            type: 'boolean',
            description: `Чи термінове замовлення`,
        },
        fixedModifierQuantities: {
            type: 'array',
            contains: {
                type: 'FixedModifierQuantity',
            },
        },
        itemName: {
            type: 'string',
            description: `Найменування предмету з прайс-листа`,
            isRequired: true,
        },
        modifierCodes: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        quantity: {
            type: 'number',
            description: `Кількість предметів`,
            isRequired: true,
            format: 'int32',
        },
        rangeModifierValues: {
            type: 'array',
            contains: {
                type: 'RangeModifierValue',
            },
        },
    },
} as const;
