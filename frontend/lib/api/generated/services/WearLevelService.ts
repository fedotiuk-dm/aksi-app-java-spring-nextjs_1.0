/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ValidationResult } from '../models/ValidationResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WearLevelService {
    /**
     * Вибирає ступінь зносу
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static substep2SelectWearLevel({
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
}
