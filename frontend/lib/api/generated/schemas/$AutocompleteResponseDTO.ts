/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AutocompleteResponseDTO = {
    description: `Результати автокомпліту для різних типів даних`,
    properties: {
        items: {
            type: 'array',
            contains: {
                type: 'AutocompleteItem',
            },
        },
        totalCount: {
            type: 'number',
            description: `Загальна кількість знайдених варіантів`,
            format: 'int64',
        },
        category: {
            type: 'string',
            description: `Категорія результатів`,
        },
    },
} as const;
