/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PriceListItemDto } from '../models/PriceListItemDto';
import type { ServiceCategoryDto } from '../models/ServiceCategoryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PriceListService {
    /**
     * Отримати всі категорії послуг
     * @returns ServiceCategoryDto OK
     * @throws ApiError
     */
    public static getAllCategories(): CancelablePromise<Array<ServiceCategoryDto>> {
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
     * @returns ServiceCategoryDto OK
     * @throws ApiError
     */
    public static createCategory({
        requestBody,
    }: {
        requestBody: ServiceCategoryDto,
    }): CancelablePromise<ServiceCategoryDto> {
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
     * Оновити категорію послуг
     * @returns ServiceCategoryDto OK
     * @throws ApiError
     */
    public static updateCategory({
        categoryId,
        requestBody,
    }: {
        categoryId: string,
        requestBody: ServiceCategoryDto,
    }): CancelablePromise<ServiceCategoryDto> {
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
     * Отримати категорію послуг за кодом
     * @returns ServiceCategoryDto OK
     * @throws ApiError
     */
    public static getCategoryByCode({
        code,
    }: {
        code: string,
    }): CancelablePromise<ServiceCategoryDto> {
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
     * Оновити елемент прайс-листа
     * @returns PriceListItemDto OK
     * @throws ApiError
     */
    public static updatePriceListItem({
        itemId,
        requestBody,
    }: {
        itemId: string,
        requestBody: PriceListItemDto,
    }): CancelablePromise<PriceListItemDto> {
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
     * @returns ServiceCategoryDto OK
     * @throws ApiError
     */
    public static getCategoryById({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<ServiceCategoryDto> {
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
     * @returns PriceListItemDto OK
     * @throws ApiError
     */
    public static createPriceListItem({
        categoryId,
        requestBody,
    }: {
        categoryId: string,
        requestBody: PriceListItemDto,
    }): CancelablePromise<PriceListItemDto> {
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
