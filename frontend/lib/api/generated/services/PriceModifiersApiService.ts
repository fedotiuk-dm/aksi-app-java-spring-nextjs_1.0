/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PriceModifierDto } from '../models/PriceModifierDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PriceModifiersApiService {
    /**
     * Отримати всі модифікатори цін
     * Повертає повний список всіх доступних модифікаторів цін
     * @returns PriceModifierDto OK
     * @throws ApiError
     */
    public static getAllPriceModifiers(): CancelablePromise<Array<PriceModifierDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-modifiers',
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
     * Отримати модифікатори цін для категорії
     * Повертає список модифікаторів цін, застосовних до вказаної категорії товарів
     * @returns PriceModifierDto OK
     * @throws ApiError
     */
    public static getPriceModifiersForCategory({
        categoryId,
    }: {
        /**
         * ID категорії товарів
         */
        categoryId: string,
    }): CancelablePromise<Array<PriceModifierDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-modifiers/category/{categoryId}',
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
     * Отримати загальні модифікатори цін
     * Повертає список загальних модифікаторів цін, застосовних до всіх категорій
     * @returns PriceModifierDto OK
     * @throws ApiError
     */
    public static getGeneralPriceModifiers(): CancelablePromise<Array<PriceModifierDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-modifiers/general',
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
     * Отримати модифікатори цін для шкіряних виробів
     * Повертає список модифікаторів цін, застосовних до шкіряних виробів
     * @returns PriceModifierDto OK
     * @throws ApiError
     */
    public static getLeatherPriceModifiers(): CancelablePromise<Array<PriceModifierDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-modifiers/leather',
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
     * Отримати модифікатори цін для текстильних виробів
     * Повертає список модифікаторів цін, застосовних до текстильних виробів
     * @returns PriceModifierDto OK
     * @throws ApiError
     */
    public static getTextilePriceModifiers(): CancelablePromise<Array<PriceModifierDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-modifiers/textile',
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
