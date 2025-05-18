/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PriceModifierDTO = {
    description: `Модифікатор ціни предмета замовлення`,
    properties: {
        amount: {
            type: 'number',
            description: `Сума модифікатора`,
        },
        description: {
            type: 'string',
            description: `Опис модифікатора`,
        },
        name: {
            type: 'string',
            description: `Назва модифікатора`,
        },
        type: {
            type: 'Enum',
        },
        value: {
            type: 'number',
            description: `Значення модифікатора`,
        },
    },
} as const;
