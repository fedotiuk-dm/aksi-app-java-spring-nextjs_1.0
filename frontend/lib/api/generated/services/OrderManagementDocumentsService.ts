/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailReceiptRequest } from '../models/EmailReceiptRequest';
import type { ReceiptDTO } from '../models/ReceiptDTO';
import type { ReceiptGenerationRequest } from '../models/ReceiptGenerationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderManagementDocumentsService {
    /**
     * Згенерувати PDF-квитанцію
     * Генерує PDF-квитанцію для замовлення з вказаними параметрами
     * @returns any PDF-квитанція успішно згенерована
     * @throws ApiError
     */
    public static generatePdfReceipt({
        requestBody,
    }: {
        requestBody: ReceiptGenerationRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/receipts/pdf',
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
     * Відправити квитанцію на email
     * Відправляє PDF-квитанцію на вказаний email
     * @returns any Квитанція успішно відправлена
     * @throws ApiError
     */
    public static sendReceiptByEmail({
        requestBody,
    }: {
        requestBody: EmailReceiptRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/receipts/email',
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
     * Отримати дані для квитанції
     * Повертає структуровані дані для формування квитанції за ID замовлення
     * @returns ReceiptDTO Дані квитанції успішно отримано
     * @throws ApiError
     */
    public static getReceiptData({
        orderId,
    }: {
        /**
         * ID замовлення
         */
        orderId: string,
    }): CancelablePromise<ReceiptDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/receipts/{orderId}',
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
