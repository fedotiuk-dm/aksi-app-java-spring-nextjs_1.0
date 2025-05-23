/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutocompleteItem } from './AutocompleteItem';
/**
 * Результати автокомпліту для різних типів даних
 */
export type AutocompleteResponseDTO = {
    /**
     * Список варіантів для автокомпліту
     */
    items?: Array<AutocompleteItem>;
    /**
     * Загальна кількість знайдених варіантів
     */
    totalCount?: number;
    /**
     * Категорія результатів
     */
    category?: string;
};

