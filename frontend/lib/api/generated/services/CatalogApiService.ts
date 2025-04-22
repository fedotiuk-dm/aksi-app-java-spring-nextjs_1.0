/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MaterialWarningDto } from '../models/MaterialWarningDto';
import type { ModifierRecommendationDto } from '../models/ModifierRecommendationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CatalogApiService {
    /**
     * Отримати доступні матеріали для категорії за кодом
     * Повертає список матеріалів, доступних для обраної категорії за її кодом
     * @returns string OK
     * @throws ApiError
     */
    public static getMaterialsForCategoryByCode({
        categoryCode,
    }: {
        /**
         * Код категорії
         */
        categoryCode: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/catalog/categories/code/{categoryCode}/materials',
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
     * Отримати доступні матеріали для категорії
     * Повертає список матеріалів, доступних для обраної категорії
     * @returns string OK
     * @throws ApiError
     */
    public static getMaterialsForCategory({
        categoryId,
    }: {
        /**
         * ID категорії
         */
        categoryId: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/catalog/categories/{categoryId}/materials',
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
     * Додати матеріал до категорії
     * Додає новий матеріал до вказаної категорії
     * @returns boolean OK
     * @throws ApiError
     */
    public static addMaterialToCategory({
        categoryId,
        material,
        sortOrder,
    }: {
        /**
         * ID категорії
         */
        categoryId: string,
        /**
         * Назва матеріалу
         */
        material: string,
        /**
         * Порядок сортування
         */
        sortOrder?: number,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/catalog/categories/{categoryId}/materials',
            path: {
                'categoryId': categoryId,
            },
            query: {
                'material': material,
                'sortOrder': sortOrder,
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
     * Отримати попередження для матеріалу та забруднень
     * Повертає список попереджень для вказаної комбінації матеріалу та типів забруднень
     * @returns MaterialWarningDto OK
     * @throws ApiError
     */
    public static getWarningsForMaterialAndStains({
        material,
        stainTypes,
    }: {
        /**
         * Назва матеріалу
         */
        material: string,
        /**
         * Типи забруднень
         */
        stainTypes?: Array<'GREASE' | 'BLOOD' | 'PROTEIN' | 'WINE' | 'COFFEE' | 'GRASS' | 'INK' | 'COSMETICS' | 'OTHER'>,
    }): CancelablePromise<Array<MaterialWarningDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/catalog/materials/{material}/warnings',
            path: {
                'material': material,
            },
            query: {
                'stainTypes': stainTypes,
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
     * Отримати рекомендовані модифікатори для забруднень
     * Повертає список рекомендованих модифікаторів для вказаних типів забруднень
     * @returns ModifierRecommendationDto OK
     * @throws ApiError
     */
    public static getRecommendedModifiersForStains({
        stainTypes,
    }: {
        /**
         * Типи забруднень
         */
        stainTypes: Array<'GREASE' | 'BLOOD' | 'PROTEIN' | 'WINE' | 'COFFEE' | 'GRASS' | 'INK' | 'COSMETICS' | 'OTHER'>,
    }): CancelablePromise<Array<ModifierRecommendationDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/catalog/stains/modifiers',
            query: {
                'stainTypes': stainTypes,
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
