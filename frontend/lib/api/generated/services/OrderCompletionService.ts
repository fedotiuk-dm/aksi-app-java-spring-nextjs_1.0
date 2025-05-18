/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompletionDateCalculationRequest } from '../models/CompletionDateCalculationRequest';
import type { CompletionDateResponse } from '../models/CompletionDateResponse';
import type { OrderCompletionUpdateRequest } from '../models/OrderCompletionUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderCompletionService {
    /**
     * Розрахувати очікувану дату завершення замовлення
     * Розраховує дату завершення на основі категорій послуг та типу терміновості
     * @returns CompletionDateResponse OK
     * @throws ApiError
     */
    public static calculateCompletionDate({
        requestBody,
    }: {
        requestBody: CompletionDateCalculationRequest,
    }): CancelablePromise<CompletionDateResponse> {
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
     * Оновити параметри виконання замовлення
     * Оновлює тип терміновості та очікувану дату завершення замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static updateOrderCompletion({
        requestBody,
    }: {
        requestBody: OrderCompletionUpdateRequest,
    }): CancelablePromise<any> {
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
}
