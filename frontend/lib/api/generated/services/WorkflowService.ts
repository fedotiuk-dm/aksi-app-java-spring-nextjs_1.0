/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkflowMap } from '../models/WorkflowMap';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WorkflowService {
    /**
     * Флоу-карта Order Wizard для фронтенду
     * @returns WorkflowMap OK
     * @throws ApiError
     */
    public static orderWizardGetWorkflow(): CancelablePromise<WorkflowMap> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/workflow',
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
