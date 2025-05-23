/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerSignatureRequest } from '../models/CustomerSignatureRequest';
import type { CustomerSignatureResponse } from '../models/CustomerSignatureResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderManagementCustomerSignatureService {
    /**
     * Зберегти підпис клієнта
     * Зберігає новий або оновлює існуючий підпис клієнта
     * @returns CustomerSignatureResponse Підпис успішно збережено
     * @throws ApiError
     */
    public static saveSignature({
        requestBody,
    }: {
        requestBody: CustomerSignatureRequest,
    }): CancelablePromise<CustomerSignatureResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/signatures',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Некоректний запит`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Отримати підпис за ID
     * Повертає підпис клієнта за його ID
     * @returns CustomerSignatureResponse Підпис знайдено
     * @throws ApiError
     */
    public static getSignatureById({
        id,
    }: {
        /**
         * ID підпису
         */
        id: string,
    }): CancelablePromise<CustomerSignatureResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/signatures/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Підпис не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Отримати всі підписи для замовлення
     * Повертає всі підписи для конкретного замовлення
     * @returns CustomerSignatureResponse Список підписів
     * @throws ApiError
     */
    public static getSignaturesByOrderId({
        orderId,
    }: {
        /**
         * ID замовлення
         */
        orderId: string,
    }): CancelablePromise<Array<CustomerSignatureResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/signatures/orders/{orderId}',
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
     * Отримати підпис за типом для замовлення
     * Повертає підпис конкретного типу для замовлення
     * @returns CustomerSignatureResponse Підпис знайдено
     * @throws ApiError
     */
    public static getSignatureByOrderIdAndType({
        orderId,
        signatureType,
    }: {
        /**
         * ID замовлення
         */
        orderId: string,
        /**
         * Тип підпису
         */
        signatureType: string,
    }): CancelablePromise<CustomerSignatureResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/signatures/orders/{orderId}/types/{signatureType}',
            path: {
                'orderId': orderId,
                'signatureType': signatureType,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Підпис не знайдено`,
                409: `Conflict`,
            },
        });
    }
}
