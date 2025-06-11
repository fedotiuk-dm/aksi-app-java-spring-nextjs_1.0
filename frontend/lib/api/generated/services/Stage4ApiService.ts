/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerSignatureRequest } from '../models/CustomerSignatureRequest';
import type { LegalAcceptanceDTO } from '../models/LegalAcceptanceDTO';
import type { OrderCompletionDTO } from '../models/OrderCompletionDTO';
import type { OrderConfirmationDTO } from '../models/OrderConfirmationDTO';
import type { OrderFinalizationRequest } from '../models/OrderFinalizationRequest';
import type { ReceiptConfigurationDTO } from '../models/ReceiptConfigurationDTO';
import type { ReceiptGenerationRequest } from '../models/ReceiptGenerationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Stage4ApiService {
    /**
     * Валідація конфігурації квитанції
     * @returns any OK
     * @throws ApiError
     */
    public static validateReceiptConfiguration({
        requestBody,
    }: {
        requestBody: ReceiptConfigurationDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/validate/receipt-configuration',
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
     * Валідація підтвердження замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static validateOrderConfirmation({
        requestBody,
    }: {
        requestBody: OrderConfirmationDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/validate/order-confirmation',
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
     * Валідація завершення замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static validateOrderCompletion({
        requestBody,
    }: {
        requestBody: OrderCompletionDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/validate/order-completion',
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
     * Валідація юридичного прийняття
     * @returns any OK
     * @throws ApiError
     */
    public static validateLegalAcceptance({
        requestBody,
    }: {
        requestBody: LegalAcceptanceDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/validate/legal-acceptance',
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
     * Збереження підпису клієнта
     * @returns any OK
     * @throws ApiError
     */
    public static saveSignature({
        requestBody,
    }: {
        requestBody: CustomerSignatureRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/signature/save',
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
     * Оновлення конфігурації квитанції
     * @returns any OK
     * @throws ApiError
     */
    public static updateReceiptConfiguration({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: ReceiptConfigurationDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/session/{sessionId}/receipt-configuration',
            path: {
                'sessionId': sessionId,
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
     * Оновлення підтвердження замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static updateOrderConfirmation({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: OrderConfirmationDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/session/{sessionId}/order-confirmation',
            path: {
                'sessionId': sessionId,
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
     * Оновлення завершення замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static updateOrderCompletion1({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: OrderCompletionDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/session/{sessionId}/order-completion',
            path: {
                'sessionId': sessionId,
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
     * Оновлення юридичного прийняття
     * @returns any OK
     * @throws ApiError
     */
    public static updateLegalAcceptance({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: LegalAcceptanceDTO,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/session/{sessionId}/legal-acceptance',
            path: {
                'sessionId': sessionId,
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
     * Закриття сесії
     * @returns any OK
     * @throws ApiError
     */
    public static closeSession({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/session/{sessionId}/close',
            path: {
                'sessionId': sessionId,
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
     * Генерація квитанції
     * @returns any OK
     * @throws ApiError
     */
    public static generateReceipt({
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
    public static generatePdfReceipt({
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
    /**
     * Ініціалізація Stage4 для замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static initializeStage4({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/initialize/{orderId}',
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
     * Фіналізація замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static finalizeOrder({
        requestBody,
    }: {
        requestBody: OrderFinalizationRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/finalize',
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
     * Повна валідація Stage4
     * @returns any OK
     * @throws ApiError
     */
    public static validateComplete({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage4/validate/complete/{sessionId}',
            path: {
                'sessionId': sessionId,
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
     * Отримання поточного контексту сесії
     * @returns any OK
     * @throws ApiError
     */
    public static getSessionContext({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage4/session/{sessionId}',
            path: {
                'sessionId': sessionId,
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
     * Отримання поточного стану Stage4
     * @returns any OK
     * @throws ApiError
     */
    public static getCurrentState({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage4/session/{sessionId}/state',
            path: {
                'sessionId': sessionId,
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
     * Отримання детального підсумку замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static getOrderSummary({
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
}
