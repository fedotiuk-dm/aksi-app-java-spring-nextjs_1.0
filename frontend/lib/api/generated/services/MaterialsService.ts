/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ValidationResult } from '../models/ValidationResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MaterialsService {
    /**
     * Вибирає матеріал предмета
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static substep2SelectMaterial({
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
     * Отримує список доступних матеріалів
     * @returns string OK
     * @throws ApiError
     */
    public static substep2GetAvailableMaterials({
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
}
