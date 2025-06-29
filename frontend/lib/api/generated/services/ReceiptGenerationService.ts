/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReceiptGenerationRequest } from '../models/ReceiptGenerationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReceiptGenerationService {
    /**
     * Генерація квитанції
     * @returns any OK
     * @throws ApiError
     */
    public static stage4GenerateReceipt({
        requestBody,
    }: {
        requestBody: ReceiptGenerationRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/receipt/generate',
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
     * Генерація PDF квитанції
     * @returns any OK
     * @throws ApiError
     */
    public static stage4GeneratePdfReceipt({
        requestBody,
    }: {
        requestBody: ReceiptGenerationRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/receipt/generate-pdf',
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
