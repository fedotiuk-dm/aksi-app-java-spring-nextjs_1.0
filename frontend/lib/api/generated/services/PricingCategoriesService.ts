/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceCategoryDTO } from '../models/ServiceCategoryDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PricingCategoriesService {
    /**
     * Отримати всі категорії послуг
     * Повертає список всіх категорій послуг прайс-листа
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static getAllCategories(): CancelablePromise<Array<ServiceCategoryDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/categories',
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
     * Отримати категорію послуг за ID
     * Повертає категорію послуг за вказаним ідентифікатором
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static getCategoryById({
        id,
    }: {
        id: string,
    }): CancelablePromise<ServiceCategoryDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/categories/{id}',
            path: {
                'id': id,
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
     * Отримати категорію послуг за кодом
     * Повертає категорію послуг за вказаним кодом
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static getCategoryByCode({
        code,
    }: {
        code: string,
    }): CancelablePromise<ServiceCategoryDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/categories/code/{code}',
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
     * Отримати активні категорії послуг
     * Повертає список тільки активних категорій послуг
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static getActiveCategories(): CancelablePromise<Array<ServiceCategoryDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/categories/active',
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
