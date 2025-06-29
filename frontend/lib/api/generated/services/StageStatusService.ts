/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StageStatus } from '../models/StageStatus';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StageStatusService {
    /**
     * Детальний статус конкретного етапу
     * @returns StageStatus OK
     * @throws ApiError
     */
    public static orderWizardGetStageStatus({
        stageNumber,
    }: {
        stageNumber: number,
    }): CancelablePromise<StageStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/stages/{stageNumber}/status',
            path: {
                'stageNumber': stageNumber,
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
