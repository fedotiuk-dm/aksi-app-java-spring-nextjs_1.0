/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TestResponse } from '../models/TestResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TestService {
    /**
     * Тестовий ендпоінт
     * Повертає тестове привітання
     * @returns TestResponse Успішна відповідь
     * @throws ApiError
     */
    public static hello(): CancelablePromise<TestResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/test/hello',
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
