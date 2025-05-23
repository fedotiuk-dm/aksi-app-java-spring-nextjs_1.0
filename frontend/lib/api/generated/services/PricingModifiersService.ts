/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PriceModifierDTO } from '../models/PriceModifierDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PricingModifiersService {
    /**
     * Отримати модифікатори для категорії послуг
     * Повертає повні дані про модифікатори для вказаної категорії послуг
     * @returns PriceModifierDTO OK
     * @throws ApiError
     */
    public static getModifiersForServiceCategory({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Array<PriceModifierDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/modifiers/service-category/{categoryCode}',
            path: {
                'categoryCode': categoryCode,
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
     * Пошук модифікаторів з фільтрацією
     * Повертає список модифікаторів з можливістю фільтрації за назвою, категорією, типом та активністю з пагінацією
     * @returns PriceModifierDTO OK
     * @throws ApiError
     */
    public static searchModifiers({
        query,
        category,
        active,
        page,
        size = 20,
        sortBy = 'name',
        sortDirection = 'ASC',
    }: {
        query?: string,
        category?: 'GENERAL' | 'TEXTILE' | 'LEATHER',
        active?: boolean,
        page?: number,
        size?: number,
        sortBy?: string,
        sortDirection?: string,
    }): CancelablePromise<Array<PriceModifierDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/modifiers/search',
            query: {
                'query': query,
                'category': category,
                'active': active,
                'page': page,
                'size': size,
                'sortBy': sortBy,
                'sortDirection': sortDirection,
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
     * Отримати детальну інформацію про модифікатор
     * Повертає повну інформацію про модифікатор за його кодом
     * @returns PriceModifierDTO OK
     * @throws ApiError
     */
    public static getModifierByCode({
        code,
    }: {
        code: string,
    }): CancelablePromise<PriceModifierDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/modifiers/code/{code}',
            path: {
                'code': code,
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
     * Отримати модифікатори за типом
     * Повертає модифікатори за типом (загальні, текстильні, шкіряні)
     * @returns PriceModifierDTO OK
     * @throws ApiError
     */
    public static getModifiersByCategory({
        category,
    }: {
        category: 'GENERAL' | 'TEXTILE' | 'LEATHER',
    }): CancelablePromise<Array<PriceModifierDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/modifiers/category/{category}',
            path: {
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
     * Отримати доступні модифікатори для категорії
     * Повертає список кодів доступних модифікаторів для вказаної категорії
     * @returns string OK
     * @throws ApiError
     */
    public static getAvailableModifiersForCategory({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/modifiers/available',
            query: {
                'categoryCode': categoryCode,
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
