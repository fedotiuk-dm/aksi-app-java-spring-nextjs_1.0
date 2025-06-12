/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemCharacteristicsDTO } from '../models/ItemCharacteristicsDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemCharacteristicsService {
    /**
     * Ініціалізує підетап 2 - Характеристики
     * @returns ItemCharacteristicsDTO OK
     * @throws ApiError
     */
    public static substep2InitializeSubstep({
        sessionId,
        itemId,
    }: {
        sessionId: string,
        itemId: string,
    }): CancelablePromise<ItemCharacteristicsDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep2/initialize/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'itemId': itemId,
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
     * Отримати ступені зносу для предметів
     * @returns string OK
     * @throws ApiError
     */
    public static getWearDegrees(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-characteristics/wear-degrees',
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
     * Отримати типи плям для предметів
     * @returns string OK
     * @throws ApiError
     */
    public static getStainTypes1(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-characteristics/stain-types',
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
     * Отримати тільки ризики для предметів
     * @returns string OK
     * @throws ApiError
     */
    public static getRisks(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-characteristics/risks',
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
     * Отримати доступні матеріали для предметів
     * @returns string OK
     * @throws ApiError
     */
    public static getMaterials({
        category,
    }: {
        category?: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-characteristics/materials',
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
     * Отримати типи наповнювачів для предметів
     * @returns string OK
     * @throws ApiError
     */
    public static getFillerTypes(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-characteristics/filler-types',
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
     * Отримати тільки дефекти для предметів
     * @returns string OK
     * @throws ApiError
     */
    public static getDefects(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-characteristics/defects',
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
     * Отримати дефекти та ризики для предметів
     * @returns string OK
     * @throws ApiError
     */
    public static getDefectsAndRisks(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-characteristics/defects-and-risks',
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
     * Отримати базові кольори для предметів
     * @returns string OK
     * @throws ApiError
     */
    public static getColors(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-characteristics/colors',
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
