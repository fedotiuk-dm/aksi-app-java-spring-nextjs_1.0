/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModifierRecommendationService {
    /**
     * Отримати рекомендовані модифікатори на основі дефектів
     * Повертає список рекомендованих модифікаторів цін на основі вказаних типів дефектів, категорії та матеріалу
     * @returns any OK
     * @throws ApiError
     */
    public static getRecommendedModifiersForDefects({
        defects,
        categoryCode,
        materialType,
    }: {
        defects: Array<string>,
        categoryCode?: string,
        materialType?: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/modifier-recommendations/defects',
            query: {
                'defects': defects,
                'categoryCode': categoryCode,
                'materialType': materialType,
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
     * Отримати попередження про ризики
     * Повертає список попереджень про ризики на основі вказаних плям, дефектів, матеріалу та категорії
     * @returns any OK
     * @throws ApiError
     */
    public static getRiskWarningsForItem({
        stains,
        defects,
        materialType,
        categoryCode,
    }: {
        stains?: Array<string>,
        defects?: Array<string>,
        materialType?: string,
        categoryCode?: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/modifier-recommendations/risks',
            query: {
                'stains': stains,
                'defects': defects,
                'materialType': materialType,
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
     * Отримати рекомендовані модифікатори на основі плям
     * Повертає список рекомендованих модифікаторів цін на основі вказаних типів плям, категорії та матеріалу
     * @returns any OK
     * @throws ApiError
     */
    public static getRecommendedModifiersForStains({
        stains,
        categoryCode,
        materialType,
    }: {
        stains: Array<string>,
        categoryCode?: string,
        materialType?: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/modifier-recommendations/stains',
            query: {
                'stains': stains,
                'categoryCode': categoryCode,
                'materialType': materialType,
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
