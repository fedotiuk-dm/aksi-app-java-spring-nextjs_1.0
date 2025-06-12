/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddModifierRequest } from '../models/AddModifierRequest';
import type { PriceModifierDTO } from '../models/PriceModifierDTO';
import type { SubstepResultDTO } from '../models/SubstepResultDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PriceModifiersService {
    /**
     * Отримати модифікатор за ID
     * @returns any OK
     * @throws ApiError
     */
    public static getModifierById({
        id,
    }: {
        id: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-modifiers/{id}',
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
     * Оновити існуючий модифікатор ціни
     * @returns any OK
     * @throws ApiError
     */
    public static updateModifier({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: PriceModifierDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/price-modifiers/{id}',
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
     * Деактивувати модифікатор ціни
     * @returns any OK
     * @throws ApiError
     */
    public static deactivateModifier({
        id,
    }: {
        id: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/price-modifiers/{id}',
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
     * Додавання модифікатора до розрахунку
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static substep4AddModifier({
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
     * Отримати всі активні модифікатори
     * @returns any OK
     * @throws ApiError
     */
    public static getAllModifiers(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-modifiers',
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
     * Створити новий модифікатор ціни
     * @returns any OK
     * @throws ApiError
     */
    public static createModifier({
        requestBody,
    }: {
        requestBody: PriceModifierDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/price-modifiers',
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
     * Отримання доступних модифікаторів для категорії
     * @returns PriceModifierDTO OK
     * @throws ApiError
     */
    public static substep4GetAvailableModifiers({
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
    public static substep4GetRecommendedModifiers({
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
     * Отримати модифікатори для категорії послуг
     * @returns any OK
     * @throws ApiError
     */
    public static getModifiersForServiceCategory({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-modifiers/service-category/{categoryCode}',
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
     * Отримати модифікатор за кодом
     * @returns any OK
     * @throws ApiError
     */
    public static getModifierByCode({
        code,
    }: {
        code: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-modifiers/code/{code}',
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
     * Отримати модифікатори за категорією
     * @returns any OK
     * @throws ApiError
     */
    public static getModifiersByCategory({
        category,
    }: {
        category: 'GENERAL' | 'TEXTILE' | 'LEATHER',
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/price-modifiers/category',
            query: {
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
     * Видалення модифікатора з розрахунку
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static substep4RemoveModifier({
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
