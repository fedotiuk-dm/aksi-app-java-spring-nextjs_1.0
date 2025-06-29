/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PriceCalculationResponseDTO = {
    description: `Результат розрахунку ціни для предмета`,
    properties: {
        baseUnitPrice: {
            type: 'number',
            description: `Початкова базова ціна за одиницю з прайс-листа`,
        },
        quantity: {
            type: 'number',
            description: `Кількість предметів`,
            format: 'int32',
            minimum: 1,
        },
        baseTotalPrice: {
            type: 'number',
            description: `Сума базових цін за всі предмети без модифікаторів`,
        },
        unitOfMeasure: {
            type: 'Enum',
        },
        finalUnitPrice: {
            type: 'number',
            description: `Кінцева ціна за одиницю з урахуванням всіх модифікаторів`,
        },
        finalTotalPrice: {
            type: 'number',
            description: `Загальна кінцева ціна за всі предмети з урахуванням всіх модифікаторів`,
        },
        calculationDetails: {
            type: 'array',
            contains: {
                type: 'CalculationDetailsDTO',
            },
        },
    },
} as const;
