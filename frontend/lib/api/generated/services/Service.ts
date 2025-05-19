/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DefectTypeDTO } from '../models/DefectTypeDTO';
import type { StainTypeDTO } from '../models/StainTypeDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * Отримати типи дефектів
     * Повертає список всіх або тільки активних типів дефектів з можливістю фільтрації за рівнем ризику
     * @returns DefectTypeDTO OK
     * @throws ApiError
     */
    public static getDefectTypes({
        activeOnly = true,
        riskLevel,
    }: {
        activeOnly?: boolean,
        riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH',
    }): CancelablePromise<Array<DefectTypeDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/defect-types',
            query: {
                'activeOnly': activeOnly,
                'riskLevel': riskLevel,
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
     * Створити тип дефекту
     * Створює новий тип дефекту з вказаними даними
     * @returns DefectTypeDTO OK
     * @throws ApiError
     */
    public static createDefectType({
        requestBody,
    }: {
        requestBody: DefectTypeDTO,
    }): CancelablePromise<DefectTypeDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/defect-types',
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
     * Отримати тип дефекту за кодом
     * Повертає тип дефекту за вказаним кодом
     * @returns any OK
     * @throws ApiError
     */
    public static getDefectTypeByCode({
        code,
    }: {
        code: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/defect-types/by-code/{code}',
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
     * Видалити тип дефекту
     * Видаляє тип дефекту за вказаним ідентифікатором
     * @returns any OK
     * @throws ApiError
     */
    public static deleteDefectType({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/defect-types/{id}',
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
     * Отримати тип дефекту за ID
     * Повертає тип дефекту за вказаним ідентифікатором
     * @returns any OK
     * @throws ApiError
     */
    public static getDefectTypeById({
        id,
    }: {
        id: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/defect-types/{id}',
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
     * Оновити тип дефекту
     * Оновлює існуючий тип дефекту за вказаним ідентифікатором
     * @returns DefectTypeDTO OK
     * @throws ApiError
     */
    public static updateDefectType({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: DefectTypeDTO,
    }): CancelablePromise<DefectTypeDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/defect-types/{id}',
            path: {
                'id': id,
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
    /**
     * Отримати типи плям
     * Повертає список всіх або тільки активних типів плям з можливістю фільтрації за рівнем ризику
     * @returns StainTypeDTO OK
     * @throws ApiError
     */
    public static getStainTypes({
        activeOnly = true,
        riskLevel,
    }: {
        activeOnly?: boolean,
        riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH',
    }): CancelablePromise<Array<StainTypeDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/stain-types',
            query: {
                'activeOnly': activeOnly,
                'riskLevel': riskLevel,
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
     * Створити тип плями
     * Створює новий тип плями з вказаними даними
     * @returns any OK
     * @throws ApiError
     */
    public static createStainType({
        requestBody,
    }: {
        requestBody: StainTypeDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/stain-types',
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
     * Отримати тип плями за кодом
     * Повертає тип плями за вказаним кодом
     * @returns any OK
     * @throws ApiError
     */
    public static getStainTypeByCode({
        code,
    }: {
        code: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/stain-types/by-code/{code}',
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
     * Видалити тип плями
     * Видаляє тип плями за вказаним ідентифікатором
     * @returns any OK
     * @throws ApiError
     */
    public static deleteStainType({
        id,
    }: {
        id: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/stain-types/{id}',
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
     * Отримати тип плями за ID
     * Повертає тип плями за вказаним ідентифікатором
     * @returns any OK
     * @throws ApiError
     */
    public static getStainTypeById({
        id,
    }: {
        id: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/stain-types/{id}',
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
     * Оновити тип плями
     * Оновлює існуючий тип плями за вказаним ідентифікатором
     * @returns any OK
     * @throws ApiError
     */
    public static updateStainType({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: StainTypeDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/stain-types/{id}',
            path: {
                'id': id,
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
