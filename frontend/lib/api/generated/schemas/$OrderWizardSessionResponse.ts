/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OrderWizardSessionResponse = {
    description: `Інформація про сесію Order Wizard`,
    properties: {
        wizardId: {
            type: 'string',
            description: `Унікальний ідентифікатор wizard`,
        },
        currentState: {
            type: 'Enum',
        },
        clientId: {
            type: 'string',
            description: `ID клієнта (якщо вибрано)`,
            format: 'uuid',
        },
        branchId: {
            type: 'string',
            description: `ID філії`,
            format: 'uuid',
        },
        receiptNumber: {
            type: 'string',
            description: `Номер квитанції`,
        },
        uniqueTag: {
            type: 'string',
            description: `Унікальна мітка`,
        },
        orderCreationTime: {
            type: 'string',
            description: `Час створення замовлення`,
            format: 'date-time',
        },
        createdAt: {
            type: 'string',
            description: `Час створення сесії`,
            format: 'date-time',
        },
        updatedAt: {
            type: 'string',
            description: `Час останнього оновлення`,
            format: 'date-time',
        },
        expiresAt: {
            type: 'string',
            description: `Час закінчення сесії`,
            format: 'date-time',
        },
        isActive: {
            type: 'boolean',
            description: `Чи активна сесія`,
        },
        isExpired: {
            type: 'boolean',
            description: `Чи закінчилася сесія`,
        },
    },
} as const;
