/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DefectTypeDTO = {
    description: `Інформація про тип дефекту`,
    properties: {
        id: {
            type: 'string',
            description: `Унікальний ідентифікатор`,
            format: 'uuid',
        },
        code: {
            type: 'string',
            description: `Код типу для програмного використання`,
        },
        name: {
            type: 'string',
            description: `Назва типу`,
        },
        description: {
            type: 'string',
            description: `Опис типу`,
        },
        riskLevel: {
            type: 'Enum',
        },
        active: {
            type: 'boolean',
            description: `Чи активний запис`,
        },
    },
} as const;
