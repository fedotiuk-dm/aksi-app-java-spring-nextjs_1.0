/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompletionDateCalculationRequest } from '../models/CompletionDateCalculationRequest';
import type { OrderCompletionDTO } from '../models/OrderCompletionDTO';
import type { OrderCompletionUpdateRequest } from '../models/OrderCompletionUpdateRequest';
import type { OrderWizardResponseDTO } from '../models/OrderWizardResponseDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderCompletionService {
    /**
     * Оновити параметри виконання замовлення
     * Оновлює тип терміновості та очікувану дату завершення замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static updateOrderCompletion({
        requestBody,
    }: {
        requestBody: OrderCompletionUpdateRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/completion/update',
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
    public static stage4UpdateOrderCompletion({
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
     * Розрахувати очікувану дату завершення замовлення
     * Розраховує дату завершення на основі категорій послуг та типу терміновості
     * @returns any OK
     * @throws ApiError
     */
    public static calculateCompletionDate({
        requestBody,
    }: {
        requestBody: CompletionDateCalculationRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/completion/calculate',
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
     * Завершення Order Wizard
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardCompleteOrder({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-wizard/session/{sessionId}/complete-order',
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
}
