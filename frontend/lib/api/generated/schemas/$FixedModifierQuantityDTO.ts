/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $FixedModifierQuantityDTO = {
    description: `Кількість для модифікатора з фіксованою ціною`,
    properties: {
        modifierId: {
            type: 'string',
            description: `ID модифікатора`,
            isRequired: true,
            minLength: 1,
            pattern: '^MOD_[A-Z_]+$',
        },
        quantity: {
            type: 'number',
            description: `Кількість одиниць для модифікатора`,
            isRequired: true,
            format: 'int32',
            maximum: 100,
            minimum: 1,
        },
    },
} as const;
