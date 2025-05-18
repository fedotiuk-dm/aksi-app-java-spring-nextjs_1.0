/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdditionalRequirementsRequest } from '../models/AdditionalRequirementsRequest';
import type { AdditionalRequirementsResponse } from '../models/AdditionalRequirementsResponse';
import type { PaymentCalculationRequest } from '../models/PaymentCalculationRequest';
import type { PaymentCalculationResponse } from '../models/PaymentCalculationResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * Отримати інформацію про оплату замовлення
     * Повертає поточні дані про оплату замовлення
     * @returns PaymentCalculationResponse OK
     * @throws ApiError
     */
    public static getOrderPayment({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<PaymentCalculationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/{orderId}/payment',
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
     * Застосувати інформацію про оплату до замовлення
     * Зберігає інформацію про оплату та розраховує фінальні суми
     * @returns PaymentCalculationResponse OK
     * @throws ApiError
     */
    public static applyPayment({
        orderId,
        requestBody,
    }: {
        orderId: string,
        requestBody: PaymentCalculationRequest,
    }): CancelablePromise<PaymentCalculationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/{orderId}/payment',
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
    /**
     * Розрахувати деталі оплати замовлення
     * Розраховує суми оплати на основі вказаних параметрів без збереження у базі даних
     * @returns PaymentCalculationResponse OK
     * @throws ApiError
     */
    public static calculatePayment({
        orderId,
        requestBody,
    }: {
        orderId: string,
        requestBody: PaymentCalculationRequest,
    }): CancelablePromise<PaymentCalculationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/{orderId}/payment/calculate',
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
    /**
     * Отримати додаткові вимоги та примітки до замовлення
     * Повертає поточні додаткові вимоги та примітки клієнта до замовлення
     * @returns AdditionalRequirementsResponse OK
     * @throws ApiError
     */
    public static getRequirements({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<AdditionalRequirementsResponse> {
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
     * @returns AdditionalRequirementsResponse OK
     * @throws ApiError
     */
    public static updateRequirements({
        orderId,
        requestBody,
    }: {
        orderId: string,
        requestBody: AdditionalRequirementsRequest,
    }): CancelablePromise<AdditionalRequirementsResponse> {
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
