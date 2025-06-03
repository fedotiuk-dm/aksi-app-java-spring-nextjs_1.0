/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderWizardDataResponse = {
    description: `Дані Order Wizard сесії`,
    properties: {
        session: {
            type: 'OrderWizardSessionResponse',
            description: `Інформація про сесію`,
        },
        data: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
        },
        availableActions: {
            type: 'dictionary',
            contains: {
                type: 'boolean',
            },
        },
        validationErrors: {
            type: 'dictionary',
            contains: {
                type: 'string',
            },
        },
    },
} as const;
