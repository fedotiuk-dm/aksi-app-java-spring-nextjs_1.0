/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ItemManagerDTO = {
    properties: {
        sessionId: {
            type: 'string',
            format: 'uuid',
        },
        orderId: {
            type: 'string',
            format: 'uuid',
        },
        addedItems: {
            type: 'array',
            contains: {
                type: 'OrderItemDTO',
            },
        },
        totalAmount: {
            type: 'number',
        },
        itemCount: {
            type: 'number',
            format: 'int32',
        },
        canProceedToNextStage: {
            type: 'boolean',
        },
        activeWizardId: {
            type: 'string',
            format: 'uuid',
        },
        editingItemId: {
            type: 'string',
            format: 'uuid',
        },
        currentStatus: {
            type: 'string',
        },
        wizardActive: {
            type: 'boolean',
        },
        editMode: {
            type: 'boolean',
        },
    },
} as const;
