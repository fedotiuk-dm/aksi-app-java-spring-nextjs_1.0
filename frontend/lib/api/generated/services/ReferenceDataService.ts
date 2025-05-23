/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReferenceDataService {
    /**
     * Отримати ступені зносу
     * Повертає список доступних ступенів зносу
     * @returns string OK
     * @throws ApiError
     */
    public static getWearDegrees(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/wear-degrees',
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
     * Отримати список одиниць виміру
     * Повертає список доступних одиниць виміру
     * @returns string OK
     * @throws ApiError
     */
    public static getUnitsOfMeasure(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/units-of-measure',
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
     * Отримати типи плям
     * Повертає список доступних типів плям
     * @returns string Список типів плям успішно отримано
     * @throws ApiError
     */
    public static getStainTypes1(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/stain-types',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
                500: `Внутрішня помилка сервера`,
            },
        });
    }
    /**
     * Отримати типи ризиків
     * Повертає список доступних типів ризиків
     * @returns string OK
     * @throws ApiError
     */
    public static getRiskTypes(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/risk-types',
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
     * Отримати список типів модифікаторів цін
     * Повертає список типів модифікаторів з кодами та локалізованими назвами
     * @returns string OK
     * @throws ApiError
     */
    public static getModifierTypes(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/modifier-types',
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
     * Отримати список матеріалів предметів
     * Повертає список доступних матеріалів з константи CommonMaterials
     * @returns string OK
     * @throws ApiError
     */
    public static getMaterials(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/materials',
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
     * Отримати матеріали за категорією
     * Повертає список доступних матеріалів для вказаної категорії або всі матеріали
     * @returns string OK
     * @throws ApiError
     */
    public static getMaterialsByCategory({
        category,
    }: {
        /**
         * Категорія предмета
         */
        category?: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/materials-by-category',
            query: {
                'category': category,
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
     * Отримати список станів предметів
     * Повертає список можливих станів предметів
     * @returns string OK
     * @throws ApiError
     */
    public static getItemConditions(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/item-conditions',
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
     * Отримати типи наповнювачів
     * Повертає список доступних типів наповнювачів
     * @returns string OK
     * @throws ApiError
     */
    public static getFillerTypes(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/filler-types',
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
     * Отримати типи дефектів
     * Повертає список доступних типів дефектів
     * @returns string OK
     * @throws ApiError
     */
    public static getDefectTypes1(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/defect-types',
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
     * Отримати список кольорів предметів
     * Повертає список доступних кольорів з константи CommonColors
     * @returns string Список кольорів успішно отримано
     * @throws ApiError
     */
    public static getColors(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/colors',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
                500: `Внутрішня помилка сервера`,
            },
        });
    }
    /**
     * Отримати список розмірів одягу за типом
     * Повертає список розмірів одягу для вказаного типу (standard, numeric, shoe)
     * @returns string OK
     * @throws ApiError
     */
    public static getClothingSizes({
        type,
    }: {
        /**
         * Тип розміру: standard, numeric, shoe
         */
        type?: string,
    }): CancelablePromise<Record<string, Array<string>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/clothing-sizes',
            query: {
                'type': type,
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
     * Отримати список категорій предметів
     * Повертає список категорій з кодами та локалізованими назвами
     * @returns string OK
     * @throws ApiError
     */
    public static getCategories(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/categories',
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
     * Автокомпліт для типів плям
     * Пошук типів плям для автокомпліту з фільтрацією за запитом
     * @returns string OK
     * @throws ApiError
     */
    public static searchStainTypes({
        query,
        limit = 10,
    }: {
        /**
         * Запит для пошуку
         */
        query?: string,
        /**
         * Максимальна кількість результатів
         */
        limit?: number,
    }): CancelablePromise<Array<Record<string, string>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/autocomplete/stain-types',
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
    /**
     * Автокомпліт для типів ризиків
     * Пошук типів ризиків для автокомпліту з фільтрацією за запитом
     * @returns string OK
     * @throws ApiError
     */
    public static searchRiskTypes({
        query,
        limit = 10,
    }: {
        /**
         * Запит для пошуку
         */
        query?: string,
        /**
         * Максимальна кількість результатів
         */
        limit?: number,
    }): CancelablePromise<Array<Record<string, string>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/autocomplete/risk-types',
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
    /**
     * Автокомпліт для типів дефектів
     * Пошук типів дефектів для автокомпліту з фільтрацією за запитом
     * @returns string OK
     * @throws ApiError
     */
    public static searchDefectTypes({
        query,
        limit = 10,
    }: {
        /**
         * Запит для пошуку
         */
        query?: string,
        /**
         * Максимальна кількість результатів
         */
        limit?: number,
    }): CancelablePromise<Array<Record<string, string>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/autocomplete/defect-types',
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
    /**
     * Автокомпліт для матеріалів
     * Пошук матеріалів для автокомпліту з фільтрацією за запитом
     * @returns string OK
     * @throws ApiError
     */
    public static searchMaterials({
        query,
        limit = 10,
    }: {
        query?: string,
        limit?: number,
    }): CancelablePromise<Array<Record<string, string>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/api/autocomplete/materials',
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
    /**
     * Автокомпліт для кольорів
     * Пошук кольорів для автокомпліту з фільтрацією за запитом
     * @returns string OK
     * @throws ApiError
     */
    public static searchColors({
        query,
        limit = 10,
    }: {
        /**
         * Запит для пошуку
         */
        query?: string,
        /**
         * Максимальна кількість результатів
         */
        limit?: number,
    }): CancelablePromise<Array<Record<string, string>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/api/autocomplete/colors',
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
    /**
     * Отримати всі довідкові дані разом
     * Повертає всі довідкові дані в одному запиті для зручності фронтенду
     * @returns any OK
     * @throws ApiError
     */
    public static getAllReferenceData(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reference/all',
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
