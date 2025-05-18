/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderDiscountRequest } from '../models/OrderDiscountRequest';
import type { OrderDiscountResponse } from '../models/OrderDiscountResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderDiscountsService {
    /**
     * Застосувати знижку до замовлення
     * Застосовує знижку до замовлення з урахуванням обмежень на категорії
     * @returns OrderDiscountResponse OK
     * @throws ApiError
     */
    public static applyDiscount1({
        requestBody,
    }: {
        requestBody: OrderDiscountRequest,
    }): CancelablePromise<OrderDiscountResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/discounts/apply',
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
     * Скасувати знижку
     * Видаляє знижку з замовлення
     * @returns OrderDiscountResponse OK
     * @throws ApiError
     */
    public static removeDiscount({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<OrderDiscountResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orders/discounts/{orderId}',
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
     * Отримати інформацію про знижку
     * Повертає детальну інформацію про знижку до замовлення
     * @returns OrderDiscountResponse OK
     * @throws ApiError
     */
    public static getOrderDiscount({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<OrderDiscountResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/discounts/{orderId}',
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
}
