/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderWizardResponseDTO } from '../models/OrderWizardResponseDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WorkflowOperationsService {
    /**
     * Запускає новий Order Wizard
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardStart(): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-wizard/start',
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
