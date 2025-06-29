/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompleteApiMap } from '../models/CompleteApiMap';
import type { StageMethods } from '../models/StageMethods';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApiDocumentationService {
    /**
     * Документація по методах конкретного етапу
     * @returns StageMethods OK
     * @throws ApiError
     */
    public static orderWizardGetStageMethods({
        stageNumber,
    }: {
        stageNumber: number,
    }): CancelablePromise<StageMethods> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/stages/{stageNumber}/methods',
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
    /**
     * Повна мапа всіх доступних API endpoints
     * @returns CompleteApiMap OK
     * @throws ApiError
     */
    public static orderWizardGetCompleteApiMap(): CancelablePromise<CompleteApiMap> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/api-map',
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
