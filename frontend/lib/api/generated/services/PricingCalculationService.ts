/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PriceCalculationRequestDTO } from '../models/PriceCalculationRequestDTO';
import type { PriceCalculationResponseDTO } from '../models/PriceCalculationResponseDTO';
import type { PriceModifierDTO } from '../models/PriceModifierDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PricingCalculationService {
    /**
     * Розрахувати ціну з урахуванням вибраних модифікаторів
     * Детальний розрахунок ціни з урахуванням базової ціни, модифікаторів, знижок та терміновості
     * @returns PriceCalculationResponseDTO Успішний розрахунок ціни
     * @throws ApiError
     */
    public static calculatePrice({
        requestBody,
    }: {
        requestBody: PriceCalculationRequestDTO,
    }): CancelablePromise<PriceCalculationResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pricing/calculation/calculate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Неправильні вхідні дані`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Не знайдено предмет або категорію в прайс-листі`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Отримати попередження про ризики
     * Повертає список попереджень про ризики для предмета на основі його плям, дефектів, категорії та матеріалу
     * @returns string OK
     * @throws ApiError
     */
    public static getRiskWarnings({
        stains,
        defects,
        categoryCode,
        materialType,
    }: {
        stains?: Array<string>,
        defects?: Array<string>,
        categoryCode?: string,
        materialType?: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/calculation/risk-warnings',
            query: {
                'stains': stains,
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
     * Отримати рекомендовані модифікатори на основі плям та дефектів
     * Повертає список рекомендованих модифікаторів для предмета на основі його плям, дефектів, категорії та матеріалу
     * @returns PriceModifierDTO OK
     * @throws ApiError
     */
    public static getRecommendedModifiers({
        stains,
        defects,
        categoryCode,
        materialType,
    }: {
        stains?: Array<string>,
        defects?: Array<string>,
        categoryCode?: string,
        materialType?: string,
    }): CancelablePromise<Array<PriceModifierDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/calculation/recommended-modifiers',
            query: {
                'stains': stains,
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
     * Отримати базову ціну для предмету
     * Повертає базову ціну з прайс-листа для вказаної категорії та предмету
     * @returns number Успішно отримано базову ціну
     * @throws ApiError
     */
    public static getBasePrice({
        categoryCode,
        itemName,
        color,
    }: {
        /**
         * Код категорії послуги
         */
        categoryCode: string,
        /**
         * Назва предмету з прайс-листа
         */
        itemName: string,
        /**
         * Колір предмету
         */
        color?: string,
    }): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/calculation/base-price',
            query: {
                'categoryCode': categoryCode,
                'itemName': itemName,
                'color': color,
            },
            errors: {
                400: `Некоректні параметри запиту`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Предмет не знайдено в прайс-листі`,
                409: `Conflict`,
            },
        });
    }
}
