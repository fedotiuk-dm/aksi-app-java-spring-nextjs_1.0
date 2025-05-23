/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AutocompleteItem = {
    description: `Елемент автокомпліту`,
    properties: {
        id: {
            type: 'string',
            description: `Унікальний ідентифікатор`,
        },
        label: {
            type: 'string',
            description: `Значення для відображення`,
        },
        value: {
            type: 'string',
            description: `Значення для використання в коді`,
        },
        description: {
            type: 'string',
            description: `Додаткова інформація для відображення`,
        },
        type: {
            type: 'Enum',
        },
        metadata: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
        },
        active: {
            type: 'boolean',
            description: `Чи активний елемент`,
        },
        priority: {
            type: 'number',
            description: `Пріоритет для сортування (менше - вище)`,
            format: 'int32',
        },
    },
} as const;
