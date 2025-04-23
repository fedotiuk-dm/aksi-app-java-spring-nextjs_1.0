/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderDraftRequest = {
    properties: {
        clientId: {
            type: 'string',
            format: 'uuid',
        },
        draftData: {
            type: 'string',
            isRequired: true,
        },
        draftName: {
            type: 'string',
        },
    },
} as const;
