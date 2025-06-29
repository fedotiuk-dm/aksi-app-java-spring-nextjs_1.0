/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RangeModifierValueDTO = {
    description: `Значення відсотка для модифікатора діапазону`,
    properties: {
        modifierId: {
            type: 'string',
            description: `ID модифікатора`,
            isRequired: true,
            minLength: 1,
            pattern: '^MOD_[A-Z_]+$',
        },
        percentage: {
            type: 'number',
            description: `Вибраний відсоток для модифікатора`,
            isRequired: true,
            maximum: 200,
        },
    },
} as const;
