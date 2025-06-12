/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ValidationResult } from '../models/ValidationResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FillersService {
    /**
     * Вибирає наповнювач
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static substep2SelectFiller({
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
}
