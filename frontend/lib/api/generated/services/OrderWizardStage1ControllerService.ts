/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientResponse } from '../models/ClientResponse';
import type { OrderBasicInfoRequest } from '../models/OrderBasicInfoRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderWizardStage1ControllerService {
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static submitOrderBasicInfo({
        wizardId,
        requestBody,
    }: {
        wizardId: string,
        requestBody: OrderBasicInfoRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/order-wizard/stage1/{wizardId}/order-info',
            path: {
                'wizardId': wizardId,
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
     * @returns any OK
     * @throws ApiError
     */
    public static submitClientData({
        wizardId,
        requestBody,
    }: {
        wizardId: string,
        requestBody: ClientResponse,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/order-wizard/stage1/{wizardId}/client',
            path: {
                'wizardId': wizardId,
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
     * @returns any OK
     * @throws ApiError
     */
    public static getStage1Data({
        wizardId,
    }: {
        wizardId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order-wizard/stage1/{wizardId}/data',
            path: {
                'wizardId': wizardId,
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
