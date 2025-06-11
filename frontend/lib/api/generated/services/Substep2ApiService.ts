/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemCharacteristicsDTO } from '../models/ItemCharacteristicsDTO';
import type { ValidationResult } from '../models/ValidationResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Substep2ApiService {
    /**
     * Валідує всі вибрані характеристики
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static validateCharacteristics({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ValidationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep2/validate/{sessionId}',
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
     * Вибирає ступінь зносу
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static selectWearLevel({
        sessionId,
        wearPercentage,
    }: {
        sessionId: string,
        wearPercentage: number,
    }): CancelablePromise<ValidationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep2/select-wear-level/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'wearPercentage': wearPercentage,
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
     * Вибирає матеріал предмета
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static selectMaterial({
        sessionId,
        materialId,
    }: {
        sessionId: string,
        materialId: string,
    }): CancelablePromise<ValidationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep2/select-material/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'materialId': materialId,
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
     * Вибирає наповнювач
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static selectFiller({
        sessionId,
        fillerType,
        isFillerDamaged = false,
    }: {
        sessionId: string,
        fillerType?: string,
        isFillerDamaged?: boolean,
    }): CancelablePromise<ValidationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep2/select-filler/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'fillerType': fillerType,
                'isFillerDamaged': isFillerDamaged,
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
     * Вибирає колір предмета
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static selectColor({
        sessionId,
        color,
    }: {
        sessionId: string,
        color: string,
    }): CancelablePromise<ValidationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep2/select-color/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
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
     * Ініціалізує підетап 2 - Характеристики
     * @returns ItemCharacteristicsDTO OK
     * @throws ApiError
     */
    public static initializeSubstep2({
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
     * Завершує підетап 2
     * @returns any OK
     * @throws ApiError
     */
    public static completeSubstep2({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep2/complete/{sessionId}',
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
     * Скасовує підетап 2
     * @returns any OK
     * @throws ApiError
     */
    public static cancelSubstep2({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep2/cancel/{sessionId}',
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
     * Отримує список доступних матеріалів
     * @returns string OK
     * @throws ApiError
     */
    public static getAvailableMaterials({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep2/materials/{sessionId}',
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
    public static getCurrentCharacteristics({
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
}
