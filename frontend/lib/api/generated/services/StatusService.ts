/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemCharacteristicsDTO } from '../models/ItemCharacteristicsDTO';
import type { PhotoDocumentationDTO } from '../models/PhotoDocumentationDTO';
import type { PriceDiscountDTO } from '../models/PriceDiscountDTO';
import type { StainsDefectsContext } from '../models/StainsDefectsContext';
import type { SubstepResultDTO } from '../models/SubstepResultDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StatusService {
    /**
     * Отримання статусу фотодокументації
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static substep5GetDocumentationStatus({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep5/{sessionId}/status',
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
     * Отримання даних фотодокументації
     * @returns PhotoDocumentationDTO OK
     * @throws ApiError
     */
    public static substep5GetDocumentationData({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<PhotoDocumentationDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep5/{sessionId}/data',
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
    public static substep4GetCurrentState({
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
     * Отримання доступних подій для поточного стану
     * @returns string OK
     * @throws ApiError
     */
    public static substep4GetAvailableEvents({
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
    public static substep4GetCurrentData({
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
     * Отримання поточного контексту
     * @returns StainsDefectsContext OK
     * @throws ApiError
     */
    public static substep3GetContext({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<StainsDefectsContext> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep3/context/{sessionId}',
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
     * Отримує поточний стан підетапу 2
     * @returns ItemCharacteristicsDTO OK
     * @throws ApiError
     */
    public static substep2GetCurrentCharacteristics({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ItemCharacteristicsDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep2/current-state/{sessionId}',
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
     * Отримує поточний стан підетапу 1
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static substep1GetStatus({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep1/{sessionId}/status',
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
}
