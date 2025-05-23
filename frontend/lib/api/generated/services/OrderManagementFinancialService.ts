/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderDiscountRequest } from '../models/OrderDiscountRequest';
import type { PaymentCalculationRequest } from '../models/PaymentCalculationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderManagementFinancialService {
    /**
     * Отримати інформацію про оплату замовлення
     * Повертає поточні дані про оплату замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static getOrderPayment(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/payment',
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
     * @returns any OK
     * @throws ApiError
     */
    public static applyPayment({
        requestBody,
    }: {
        requestBody: PaymentCalculationRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/payment',
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
     * @returns any OK
     * @throws ApiError
     */
    public static calculatePayment({
        requestBody,
    }: {
        requestBody: PaymentCalculationRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/payment/calculate',
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
     * Застосувати знижку до замовлення
     * Застосовує знижку до замовлення з урахуванням обмежень на категорії
     * @returns any OK
     * @throws ApiError
     */
    public static applyDiscount1({
        requestBody,
    }: {
        requestBody: OrderDiscountRequest,
    }): CancelablePromise<Record<string, any>> {
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
     * Отримати інформацію про знижку
     * Повертає детальну інформацію про знижку до замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static getOrderDiscount({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<Record<string, any>> {
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
    /**
     * Скасувати знижку
     * Видаляє знижку з замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static removeDiscount({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<Record<string, any>> {
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
}
