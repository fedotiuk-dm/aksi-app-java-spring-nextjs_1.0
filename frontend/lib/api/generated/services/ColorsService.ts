/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ValidationResult } from '../models/ValidationResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ColorsService {
    /**
     * Вибирає колір предмета
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static substep2SelectColor({
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
}
