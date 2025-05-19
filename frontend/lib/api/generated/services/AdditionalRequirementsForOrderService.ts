/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdditionalRequirementsRequest } from '../models/AdditionalRequirementsRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdditionalRequirementsForOrderService {
    /**
     * Отримати додаткові вимоги та примітки до замовлення
     * Повертає поточні додаткові вимоги та примітки клієнта до замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static getRequirements({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/{orderId}/requirements',
            path: {
                'orderId': orderId,
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
     * Оновити додаткові вимоги та примітки до замовлення
     * Зберігає додаткові вимоги та примітки клієнта до замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static updateRequirements({
        orderId,
        requestBody,
    }: {
        orderId: string,
        requestBody: AdditionalRequirementsRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/{orderId}/requirements',
            path: {
                'orderId': orderId,
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
