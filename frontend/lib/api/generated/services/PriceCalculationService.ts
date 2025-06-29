/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InitializeSubstepRequest } from '../models/InitializeSubstepRequest';
import type { PriceCalculationRequestDTO } from '../models/PriceCalculationRequestDTO';
import type { PriceCalculationResponseDTO } from '../models/PriceCalculationResponseDTO';
import type { PriceDiscountDTO } from '../models/PriceDiscountDTO';
import type { SubstepResultDTO } from '../models/SubstepResultDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PriceCalculationService {
    /**
     * Ініціалізація підетапу 4
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static substep4InitializeSubstep({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: InitializeSubstepRequest,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep4/initialize/{sessionId}',
            path: {
                'sessionId': sessionId,
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
     * Розрахунок ціни
     * @returns PriceCalculationResponseDTO OK
     * @throws ApiError
     */
    public static substep4CalculatePrice({
        requestBody,
    }: {
        requestBody: PriceDiscountDTO,
    }): CancelablePromise<PriceCalculationResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep4/calculate-price',
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
     * Розрахунок фінальної ціни з усіма модифікаторами
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static substep4CalculateFinalPrice({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep4/calculate-final-price/{sessionId}',
            path: {
                'sessionId': sessionId,
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
     * Розрахунок базової ціни предмета
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static substep4CalculateBasePrice({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep4/calculate-base-price/{sessionId}',
            path: {
                'sessionId': sessionId,
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
     * Отримати інформацію про кілька модифікаторів
     * Повертає інформацію про модифікатори за списком їх кодів
     * @returns any OK
     * @throws ApiError
     */
    public static getModifiersByCodes({
        requestBody,
    }: {
        requestBody: Array<string>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/price-calculation/modifiers/batch',
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
            url: '/price-calculation/calculate',
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
     * @returns any OK
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
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-calculation/risk-warnings',
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
     * @returns any OK
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
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-calculation/recommended-modifiers',
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
     * Отримати детальну інформацію про модифікатор
     * Повертає повну інформацію про модифікатор за його кодом
     * @returns any OK
     * @throws ApiError
     */
    public static getModifierByCode1({
        code,
    }: {
        code: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-calculation/modifiers/{code}',
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
     * Отримати модифікатори за типом
     * Повертає модифікатори за типом (загальні, текстильні, шкіряні)
     * @returns any OK
     * @throws ApiError
     */
    public static getModifiersByCategory1({
        category,
    }: {
        category: 'GENERAL' | 'TEXTILE' | 'LEATHER',
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-calculation/modifiers/by-type/{category}',
            path: {
                'category': category,
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
     * Отримати всі модифікатори для конкретної категорії послуг
     * Повертає повні дані про модифікатори для вказаної категорії послуг
     * @returns any OK
     * @throws ApiError
     */
    public static getModifiersForServiceCategory1({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-calculation/modifiers/by-category/{categoryCode}',
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
     * Отримати базову ціну для предмету з прайс-листа
     * @returns any OK
     * @throws ApiError
     */
    public static getBasePrice({
        categoryCode,
        itemName,
        color,
    }: {
        categoryCode: string,
        itemName: string,
        color?: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-calculation/base-price',
            query: {
                'categoryCode': categoryCode,
                'itemName': itemName,
                'color': color,
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
     * Отримати доступні модифікатори для категорії
     * @returns any OK
     * @throws ApiError
     */
    public static getAvailableModifiersForCategory({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-calculation/available-modifiers',
            query: {
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
}
