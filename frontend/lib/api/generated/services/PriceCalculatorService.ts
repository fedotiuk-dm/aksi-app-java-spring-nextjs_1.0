/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModifierDTO } from '../models/ModifierDTO';
import type { PriceCalculationRequestDTO } from '../models/PriceCalculationRequestDTO';
import type { PriceCalculationResponseDTO } from '../models/PriceCalculationResponseDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PriceCalculatorService {
    /**
     * Отримати базову ціну для предмету з прайс-листа
     * @returns PriceCalculationResponseDTO OK
     * @throws ApiError
     */
    public static getBasePrice({
        categoryCode,
        itemName,
    }: {
        categoryCode: string,
        itemName: string,
    }): CancelablePromise<PriceCalculationResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-calculation/base-price',
            query: {
                'categoryCode': categoryCode,
                'itemName': itemName,
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
     * Розрахувати ціну з урахуванням вибраних модифікаторів
     * @returns PriceCalculationResponseDTO OK
     * @throws ApiError
     */
    public static calculatePrice({
        requestBody,
    }: {
        requestBody: PriceCalculationRequestDTO,
    }): CancelablePromise<PriceCalculationResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/price-calculation/calculate',
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
     * Отримати усі доступні модифікатори ціни
     * @returns ModifierDTO OK
     * @throws ApiError
     */
    public static getAllModifiers(): CancelablePromise<Array<ModifierDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-calculation/modifiers',
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
     * Отримати модифікатори ціни для конкретної категорії
     * @returns ModifierDTO OK
     * @throws ApiError
     */
    public static getModifiersForCategory({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Array<ModifierDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-calculation/modifiers/category/{categoryCode}',
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
     * Отримати модифікатори ціни згруповані за типами
     * @returns ModifierDTO OK
     * @throws ApiError
     */
    public static getModifiersGroupedByType(): CancelablePromise<Record<string, Array<ModifierDTO>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-calculation/modifiers/grouped',
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
