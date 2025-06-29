/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PriceListItemDTO } from '../models/PriceListItemDTO';
import type { ServiceCategoryDTO } from '../models/ServiceCategoryDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PriceListService {
    /**
     * Отримати елемент прайс-листа за ID
     * @returns any OK
     * @throws ApiError
     */
    public static getItemById({
        itemId,
    }: {
        itemId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-list/item/{itemId}',
            path: {
                'itemId': itemId,
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
     * Оновити елемент прайс-листа
     * @returns any OK
     * @throws ApiError
     */
    public static updatePriceListItem({
        itemId,
        requestBody,
    }: {
        itemId: string,
        requestBody: PriceListItemDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/price-list/item/{itemId}',
            path: {
                'itemId': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
     * Оновити категорію послуг
     * @returns any OK
     * @throws ApiError
     */
    public static updateCategory({
        categoryId,
        requestBody,
    }: {
        categoryId: string,
        requestBody: ServiceCategoryDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/price-list/category/{categoryId}',
            path: {
                'categoryId': categoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
     * Створити новий елемент прайс-листа в категорії
     * @returns any OK
     * @throws ApiError
     */
    public static createPriceListItem({
        categoryId,
        requestBody,
    }: {
        categoryId: string,
        requestBody: PriceListItemDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/price-list/{categoryId}/item',
            path: {
                'categoryId': categoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
     * Створити нову категорію послуг
     * @returns any OK
     * @throws ApiError
     */
    public static createCategory({
        requestBody,
    }: {
        requestBody: ServiceCategoryDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/price-list/category',
            body: requestBody,
            mediaType: 'application/json',
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
     * Отримати всі категорії послуг
     * @returns any OK
     * @throws ApiError
     */
    public static getAllCategories(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-list',
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
     * Отримати категорію послуг за ідентифікатором
     * @returns any OK
     * @throws ApiError
     */
    public static getCategoryById1({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-list/{categoryId}',
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
     * Отримати категорію послуг за кодом
     * @returns any OK
     * @throws ApiError
     */
    public static getCategoryByCode1({
        code,
    }: {
        code: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-list/category/{code}',
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
     * Отримати доступні одиниці виміру для категорії
     * @returns any OK
     * @throws ApiError
     */
    public static getAvailableUnitsOfMeasure({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-list/category/{categoryId}/units-of-measure',
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
     * Отримати всі елементи прайс-листа за категорією
     * @returns any OK
     * @throws ApiError
     */
    public static getItemsByCategory({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-list/category/{categoryId}/items',
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
     * Отримати список найменувань виробів за категорією
     * @returns any OK
     * @throws ApiError
     */
    public static getItemNamesByCategory({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-list/category/{categoryId}/item-names',
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
     * Отримати всі елементи прайс-листа за кодом категорії
     * @returns any OK
     * @throws ApiError
     */
    public static getItemsByCategoryCode({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-list/category/code/{categoryCode}/items',
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
}
