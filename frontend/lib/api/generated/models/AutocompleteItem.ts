/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Елемент автокомпліту
 */
export type AutocompleteItem = {
    /**
     * Унікальний ідентифікатор
     */
    id?: string;
    /**
     * Значення для відображення
     */
    label?: string;
    /**
     * Значення для використання в коді
     */
    value?: string;
    /**
     * Додаткова інформація для відображення
     */
    description?: string;
    /**
     * Тип елемента
     */
    type?: AutocompleteItem.type;
    /**
     * Додаткові метадані
     */
    metadata?: Record<string, any>;
    /**
     * Чи активний елемент
     */
    active?: boolean;
    /**
     * Пріоритет для сортування (менше - вище)
     */
    priority?: number;
};
export namespace AutocompleteItem {
    /**
     * Тип елемента
     */
    export enum type {
        ITEM = 'ITEM',
        CATEGORY = 'CATEGORY',
        MODIFIER = 'MODIFIER',
    }
}

