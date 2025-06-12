/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderDetailedSummaryResponse } from '../models/OrderDetailedSummaryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderSummaryService {
    /**
     * Отримання детального підсумку замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static stage4GetOrderSummary({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage4/order/{orderId}/summary',
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
     * Отримати детальний підсумок замовлення
     * Повертає детальний підсумок замовлення з розрахунком вартості для перегляду та підтвердження. Включає інформацію про клієнта, список предметів з деталізацією вартості, загальні суми та дати.
     * @returns OrderDetailedSummaryResponse Успішне отримання детального підсумку замовлення
     * @throws ApiError
     */
    public static getOrderDetailedSummary({
        orderId,
    }: {
        /**
         * ID замовлення
         */
        orderId: string,
    }): CancelablePromise<OrderDetailedSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/{orderId}/detailed-summary',
            path: {
                'orderId': orderId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
                500: `Внутрішня помилка сервера`,
            },
        });
    }
}
