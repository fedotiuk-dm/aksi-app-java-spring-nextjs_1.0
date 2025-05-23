/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemDTO } from '../models/OrderItemDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderManagementItemsService {
    /**
     * Отримати всі предмети замовлення
     * Повертає список всіх предметів для конкретного замовлення
     * @returns OrderItemDTO Успішно отримано список предметів замовлення
     * @throws ApiError
     */
    public static getOrderItems({
        orderId,
    }: {
        /**
         * ID замовлення
         */
        orderId: string,
    }): CancelablePromise<Array<OrderItemDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/{orderId}/items',
            path: {
                'orderId': orderId,
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
