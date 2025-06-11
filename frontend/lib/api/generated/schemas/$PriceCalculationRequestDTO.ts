/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PriceCalculationRequestDTO = {
    description: `Запит на розрахунок ціни предмету з модифікаторами`,
    properties: {
        categoryCode: {
            type: 'string',
            description: `Код категорії послуги`,
            isRequired: true,
            minLength: 1,
            pattern: '^[A-Z_]+$',
        },
        itemName: {
            type: 'string',
            description: `Найменування предмету з прайс-листа`,
            isRequired: true,
            maxLength: 255,
        },
        color: {
            type: 'string',
            description: `Колір предмету`,
            maxLength: 100,
        },
        quantity: {
            type: 'number',
            description: `Кількість предметів`,
            isRequired: true,
            format: 'int32',
            maximum: 1000,
            minimum: 1,
        },
        modifierCodes: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        modifierIds: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        rangeModifierValues: {
            type: 'array',
            contains: {
                type: 'RangeModifierValueDTO',
            },
        },
        fixedModifierQuantities: {
            type: 'array',
            contains: {
                type: 'FixedModifierQuantityDTO',
            },
        },
        expedited: {
            type: 'boolean',
            description: `Чи термінове замовлення`,
        },
        expeditePercent: {
            type: 'number',
            description: `Відсоток надбавки за терміновість`,
            maximum: 200,
        },
        discountPercent: {
            type: 'number',
            description: `Відсоток знижки`,
            maximum: 50,
        },
    },
} as const;
