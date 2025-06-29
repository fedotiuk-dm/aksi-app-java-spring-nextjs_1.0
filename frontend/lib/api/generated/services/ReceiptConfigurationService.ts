/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReceiptConfigurationDTO } from '../models/ReceiptConfigurationDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReceiptConfigurationService {
    /**
     * Оновлення конфігурації квитанції
     * @returns any OK
     * @throws ApiError
     */
    public static stage4UpdateReceiptConfiguration({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: ReceiptConfigurationDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/session/{sessionId}/receipt-configuration',
            path: {
                'sessionId': sessionId,
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
}
