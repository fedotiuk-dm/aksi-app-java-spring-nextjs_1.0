/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DefectTypeDTO } from '../models/DefectTypeDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefectTypeService {
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
}
