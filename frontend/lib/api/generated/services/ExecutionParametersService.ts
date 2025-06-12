/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExecutionParamsDTO } from '../models/ExecutionParamsDTO';
import type { ValidationResult } from '../models/ValidationResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExecutionParametersService {
    /**
     * Оновити параметри виконання
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static stage3UpdateExecutionParams({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: ExecutionParamsDTO,
    }): CancelablePromise<ValidationResult> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/execution-params',
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
     * Перевірити готовність параметрів виконання
     * @returns boolean OK
     * @throws ApiError
     */
    public static stage3IsExecutionParamsReady({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/execution-params/ready',
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
