/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailReceiptRequest } from '../models/EmailReceiptRequest';
import type { OrderDTO } from '../models/OrderDTO';
import type { OrderFinalizationRequest } from '../models/OrderFinalizationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderFinalizationService {
    /**
     * Завершити оформлення замовлення
     * Фіналізує замовлення, зберігає підпис клієнта та змінює статус замовлення
     * @returns OrderDTO Замовлення успішно завершено
     * @throws ApiError
     */
    public static finalizeOrder({
        requestBody,
    }: {
        requestBody: OrderFinalizationRequest,
    }): CancelablePromise<OrderDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/finalization/complete',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Відправити чек на email
     * Відправляє PDF-чек замовлення на email клієнта
     * @returns any Чек успішно відправлено
     * @throws ApiError
     */
    public static emailReceipt({
        orderId,
        requestBody,
    }: {
        /**
         * ID замовлення
         */
        orderId: string,
        requestBody: EmailReceiptRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/finalization/{orderId}/email-receipt',
            path: {
                'orderId': orderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Отримати PDF-чек замовлення
     * Повертає PDF-файл з чеком для завантаження
     * @returns any PDF-чек успішно згенеровано
     * @throws ApiError
     */
    public static getOrderReceipt({
        orderId,
        includeSignature = true,
    }: {
        /**
         * ID замовлення
         */
        orderId: string,
        /**
         * Включати підпис клієнта
         */
        includeSignature?: boolean,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/finalization/{orderId}/receipt',
            path: {
                'orderId': orderId,
            },
            query: {
                'includeSignature': includeSignature,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
}
