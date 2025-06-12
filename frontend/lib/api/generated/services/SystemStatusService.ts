/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StagesStatus } from '../models/StagesStatus';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemStatusService {
    /**
     * Статуси готовності всіх етапів
     * @returns StagesStatus OK
     * @throws ApiError
     */
    public static orderWizardGetStagesStatus(): CancelablePromise<StagesStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/stages/status',
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
