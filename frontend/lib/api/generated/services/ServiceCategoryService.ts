/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceCategoryDTO } from '../models/ServiceCategoryDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServiceCategoryService {
    /**
     * Отримати список всіх активних категорій послуг
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static getAllActiveCategories(): CancelablePromise<Array<ServiceCategoryDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/service-categories',
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
            url: '/service-categories/code/{code}',
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
     * Отримати категорію послуг за ID
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
            url: '/service-categories/{id}',
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
}
