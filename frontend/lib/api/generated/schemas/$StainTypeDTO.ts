/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $StainTypeDTO = {
    description: `Інформація про тип плями`,
    properties: {
        active: {
            type: 'boolean',
            description: `Чи активний запис`,
        },
        code: {
            type: 'string',
            description: `Код типу для програмного використання`,
        },
        description: {
            type: 'string',
            description: `Опис типу`,
        },
        id: {
            type: 'string',
            description: `Унікальний ідентифікатор`,
            format: 'uuid',
        },
        name: {
            type: 'string',
            description: `Назва типу`,
        },
        riskLevel: {
            type: 'Enum',
        },
    },
} as const;
