/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdaptersInfo } from '../models/AdaptersInfo';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemInformationService {
    /**
     * Повна інформація про всі адаптери
     * @returns AdaptersInfo OK
     * @throws ApiError
     */
    public static orderWizardGetAdaptersInfo(): CancelablePromise<AdaptersInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/adapters',
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
