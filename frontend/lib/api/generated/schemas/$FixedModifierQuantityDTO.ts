/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $FixedModifierQuantityDTO = {
    properties: {
        modifierId: {
            type: 'string',
            minLength: 1,
        },
        quantity: {
            type: 'number',
            isRequired: true,
            format: 'int32',
        },
    },
} as const;
