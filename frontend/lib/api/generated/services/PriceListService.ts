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
            url: '/price-list/category/{code}',
            path: {
                'code': code,
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
        });
    }
    /**
     * Отримати категорію послуг за ідентифікатором
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static getCategoryById({
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
        });
    }
}
