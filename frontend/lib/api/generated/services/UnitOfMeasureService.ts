/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UnitOfMeasureService {
    /**
     * Отримати всі доступні одиниці виміру для категорії
     * @returns string OK
     * @throws ApiError
     */
    public static getAvailableUnitsForCategory({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/units-of-measure/category/{categoryId}',
            path: {
                'categoryId': categoryId,
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
     * Перевірити підтримку одиниці виміру для предмета
     * @returns boolean OK
     * @throws ApiError
     */
    public static isUnitSupportedForItem({
        categoryId,
        itemName,
        unitOfMeasure,
    }: {
        categoryId: string,
        itemName: string,
        unitOfMeasure: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/units-of-measure/check-support',
            query: {
                'categoryId': categoryId,
                'itemName': itemName,
                'unitOfMeasure': unitOfMeasure,
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
     * Отримати рекомендовану одиницю виміру для предмета
     * @returns string OK
     * @throws ApiError
     */
    public static getRecommendedUnitOfMeasure({
        categoryId,
        itemName,
    }: {
        categoryId: string,
        itemName: string,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/units-of-measure/recommend',
            query: {
                'categoryId': categoryId,
                'itemName': itemName,
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
