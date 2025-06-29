/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PriceModifierDTO = {
    description: `Модифікатор ціни предмета замовлення`,
    properties: {
        name: {
            type: 'string',
            description: `Назва модифікатора`,
        },
        description: {
            type: 'string',
            description: `Опис модифікатора`,
        },
        type: {
            type: 'Enum',
        },
        value: {
            type: 'number',
            description: `Значення модифікатора`,
        },
        amount: {
            type: 'number',
            description: `Сума модифікатора`,
        },
    },
} as const;
