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
     * Отримати всі категорії послуг
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static getAllCategories(): CancelablePromise<Array<ServiceCategoryDTO>> {
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
     * Створити нову категорію послуг
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static createCategory({
        requestBody,
    }: {
        requestBody: ServiceCategoryDTO,
    }): CancelablePromise<ServiceCategoryDTO> {
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
     * Отримати всі елементи прайс-листа за кодом категорії
     * @returns PriceListItemDTO OK
     * @throws ApiError
     */
    public static getItemsByCategoryCode({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Array<PriceListItemDTO>> {
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
    /**
     * Оновити категорію послуг
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static updateCategory({
        categoryId,
        requestBody,
    }: {
        categoryId: string,
        requestBody: ServiceCategoryDTO,
    }): CancelablePromise<ServiceCategoryDTO> {
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
     * Отримати список найменувань виробів за категорією
     * @returns string OK
     * @throws ApiError
     */
    public static getItemNamesByCategory({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<Array<string>> {
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
     * Отримати всі елементи прайс-листа за категорією
     * @returns PriceListItemDTO OK
     * @throws ApiError
     */
    public static getItemsByCategory({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<Array<PriceListItemDTO>> {
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
     * Отримати доступні одиниці виміру для категорії
     * @returns string OK
     * @throws ApiError
     */
    public static getAvailableUnitsOfMeasure({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<Array<string>> {
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
     * Отримати категорію послуг за кодом
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static getCategoryByCode1({
        code,
    }: {
        code: string,
    }): CancelablePromise<ServiceCategoryDTO> {
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
     * Отримати елемент прайс-листа за ID
     * @returns PriceListItemDTO OK
     * @throws ApiError
     */
    public static getItemById({
        itemId,
    }: {
        itemId: string,
    }): CancelablePromise<PriceListItemDTO> {
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
     * @returns PriceListItemDTO OK
     * @throws ApiError
     */
    public static updatePriceListItem({
        itemId,
        requestBody,
    }: {
        itemId: string,
        requestBody: PriceListItemDTO,
    }): CancelablePromise<PriceListItemDTO> {
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
     * Отримати категорію послуг за ідентифікатором
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static getCategoryById1({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<ServiceCategoryDTO> {
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
     * Створити новий елемент прайс-листа в категорії
     * @returns PriceListItemDTO OK
     * @throws ApiError
     */
    public static createPriceListItem({
        categoryId,
        requestBody,
    }: {
        categoryId: string,
        requestBody: PriceListItemDTO,
    }): CancelablePromise<PriceListItemDTO> {
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
}
