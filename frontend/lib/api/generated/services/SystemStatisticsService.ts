/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SystemStats } from '../models/SystemStats';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemStatisticsService {
    /**
     * Загальна статистика системи
     * @returns SystemStats OK
     * @throws ApiError
     */
    public static orderWizardGetSystemStats(): CancelablePromise<SystemStats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/stats',
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
