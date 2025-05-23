/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DefectTypeDTO } from '../models/DefectTypeDTO';
import type { StainTypeDTO } from '../models/StainTypeDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PricingIssuesService {
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
            url: '/pricing/issues/stains',
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
     * Отримати тип плями за кодом
     * Повертає тип плями за вказаним кодом
     * @returns StainTypeDTO OK
     * @throws ApiError
     */
    public static getStainTypeByCode({
        code,
    }: {
        code: string,
    }): CancelablePromise<StainTypeDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/issues/stains/code/{code}',
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
            url: '/pricing/issues/defects',
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
     * Отримати тип дефекту за кодом
     * Повертає тип дефекту за вказаним кодом
     * @returns DefectTypeDTO OK
     * @throws ApiError
     */
    public static getDefectTypeByCode({
        code,
    }: {
        code: string,
    }): CancelablePromise<DefectTypeDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/issues/defects/code/{code}',
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
}
