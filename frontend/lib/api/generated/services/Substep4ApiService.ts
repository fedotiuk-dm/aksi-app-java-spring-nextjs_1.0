/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddModifierRequest } from '../models/AddModifierRequest';
import type { InitializeSubstepRequest } from '../models/InitializeSubstepRequest';
import type { PriceCalculationResponseDTO } from '../models/PriceCalculationResponseDTO';
import type { PriceDiscountDTO } from '../models/PriceDiscountDTO';
import type { PriceModifierDTO } from '../models/PriceModifierDTO';
import type { SubstepResultDTO } from '../models/SubstepResultDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Substep4ApiService {
    /**
     * Скидання розрахунку
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static resetCalculation({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep4/reset/{sessionId}',
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
     * Додавання модифікатора до розрахунку
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static addModifier({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: AddModifierRequest,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep4/modifiers/{sessionId}/add',
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
     * Ініціалізація підетапу 4
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static initializeSubstep4({
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
     * Підтвердження розрахунку та завершення підетапу
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static confirmCalculation({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep4/confirm/{sessionId}',
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
     * Розрахунок ціни
     * @returns PriceCalculationResponseDTO OK
     * @throws ApiError
     */
    public static calculatePrice({
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
    public static calculateFinalPrice({
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
    public static calculateBasePrice({
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
     * Валідація поточного стану
     * @returns boolean OK
     * @throws ApiError
     */
    public static validateCurrentState1({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep4/validate/{sessionId}',
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
     * Детальна валідація з результатом
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static validateDetailed({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep4/validate-detailed/{sessionId}',
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
     * Отримання поточного стану підетапу
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static getCurrentState1({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep4/state/{sessionId}',
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
     * Перевірка існування сесії
     * @returns boolean OK
     * @throws ApiError
     */
    public static sessionExists({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep4/session/{sessionId}/exists',
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
     * Отримання доступних модифікаторів для категорії
     * @returns PriceModifierDTO OK
     * @throws ApiError
     */
    public static getAvailableModifiers({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Array<PriceModifierDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep4/modifiers',
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
    /**
     * Отримання рекомендованих модифікаторів
     * @returns PriceModifierDTO OK
     * @throws ApiError
     */
    public static getRecommendedModifiers({
        categoryCode,
        itemName,
    }: {
        categoryCode: string,
        itemName: string,
    }): CancelablePromise<Array<PriceModifierDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep4/modifiers/recommended',
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
     * Отримання доступних подій для поточного стану
     * @returns string OK
     * @throws ApiError
     */
    public static getAvailableEvents({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Array<'INITIALIZE' | 'CALCULATE_BASE_PRICE' | 'SELECT_MODIFIERS' | 'ADD_MODIFIER' | 'REMOVE_MODIFIER' | 'CALCULATE_FINAL_PRICE' | 'CONFIRM_CALCULATION' | 'RESET_CALCULATION' | 'HANDLE_ERROR'>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep4/events/{sessionId}',
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
     * Отримання поточних даних сесії
     * @returns PriceDiscountDTO OK
     * @throws ApiError
     */
    public static getCurrentData({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<PriceDiscountDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep4/data/{sessionId}',
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
     * Видалення сесії
     * @returns any OK
     * @throws ApiError
     */
    public static removeSession({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage2/substep4/session/{sessionId}',
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
     * Видалення модифікатора з розрахунку
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static removeModifier({
        sessionId,
        modifierId,
    }: {
        sessionId: string,
        modifierId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage2/substep4/modifiers/{sessionId}/{modifierId}',
            path: {
                'sessionId': sessionId,
                'modifierId': modifierId,
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
