/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StainTypeDTO } from '../models/StainTypeDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StainTypeService {
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
