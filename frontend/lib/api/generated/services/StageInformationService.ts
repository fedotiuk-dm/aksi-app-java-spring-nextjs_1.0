/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StageInfo } from '../models/StageInfo';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StageInformationService {
    /**
     * Детальна інформація про конкретний етап
     * @returns StageInfo OK
     * @throws ApiError
     */
    public static orderWizardGetStageInfo({
        stageNumber,
    }: {
        stageNumber: number,
    }): CancelablePromise<StageInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/stages/{stageNumber}/info',
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
