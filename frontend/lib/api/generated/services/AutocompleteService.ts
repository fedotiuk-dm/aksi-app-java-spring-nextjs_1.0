/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutocompleteResponseDTO } from '../models/AutocompleteResponseDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AutocompleteService {
    /**
     * Автокомпліт для модифікаторів
     * Повертає список варіантів модифікаторів для автокомпліту
     * @returns any OK
     * @throws ApiError
     */
    public static autocompleteModifiers({
        query,
        category,
        limit = 10,
    }: {
        /**
         * Текст для пошуку
         */
        query: string,
        /**
         * Категорія модифікаторів
         */
        category?: 'GENERAL' | 'TEXTILE' | 'LEATHER',
        /**
         * Максимальна кількість результатів
         */
        limit?: number,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/autocomplete/modifiers',
            query: {
                'query': query,
                'category': category,
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Автокомпліт для назв предметів
     * Повертає список варіантів назв предметів для автокомпліту на основі введеного тексту
     * @returns AutocompleteResponseDTO Успішно отримано варіанти автокомпліту
     * @throws ApiError
     */
    public static autocompleteItems({
        query,
        categoryCode,
        limit = 10,
    }: {
        /**
         * Текст для пошуку
         */
        query: string,
        /**
         * Код категорії для фільтрації
         */
        categoryCode?: string,
        /**
         * Максимальна кількість результатів
         */
        limit?: number,
    }): CancelablePromise<AutocompleteResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/autocomplete/items',
            query: {
                'query': query,
                'categoryCode': categoryCode,
                'limit': limit,
            },
            errors: {
                400: `Некоректні параметри запиту`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Автокомпліт для категорій послуг
     * Повертає список варіантів категорій послуг для автокомпліту
     * @returns any OK
     * @throws ApiError
     */
    public static autocompleteCategories({
        query,
        limit = 10,
    }: {
        /**
         * Текст для пошуку
         */
        query: string,
        /**
         * Максимальна кількість результатів
         */
        limit?: number,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/autocomplete/categories',
            query: {
                'query': query,
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
            },
        });
    }
}
