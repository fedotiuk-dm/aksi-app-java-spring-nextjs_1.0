/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrderRequest } from '../models/CreateOrderRequest';
import type { OrderWizardDataResponse } from '../models/OrderWizardDataResponse';
import type { OrderWizardSessionResponse } from '../models/OrderWizardSessionResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderWizardService {
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static completeWizard({
        wizardId,
        requestBody,
    }: {
        wizardId: string,
        requestBody: CreateOrderRequest,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/order-wizard/{wizardId}/complete',
            path: {
                'wizardId': wizardId,
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
     * Виконати дію в Order Wizard
     * Виконує певну дію в wizard на основі OrderWizardAction enum
     * @returns any Дія виконана успішно
     * @throws ApiError
     */
    public static executeAction({
        wizardId,
        actionName,
        requestBody,
    }: {
        wizardId: string,
        actionName: string,
        requestBody?: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/order-wizard/{wizardId}/action/{actionName}',
            path: {
                'wizardId': wizardId,
                'actionName': actionName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Недопустима дія`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Wizard не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Створити новий Order Wizard
     * Створює нову сесію Order Wizard для оформлення замовлення
     * @returns OrderWizardSessionResponse Wizard успішно створено
     * @throws ApiError
     */
    public static createWizard(): CancelablePromise<OrderWizardSessionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/order-wizard/create',
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
     * Отримати стан Order Wizard
     * Повертає поточний стан wizard та всі збережені дані
     * @returns OrderWizardDataResponse Стан wizard успішно отримано
     * @throws ApiError
     */
    public static getWizardState({
        wizardId,
    }: {
        wizardId: string,
    }): CancelablePromise<OrderWizardDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order-wizard/{wizardId}/state',
            path: {
                'wizardId': wizardId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Wizard не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Отримати доступні дії для Order Wizard
     * Повертає список доступних дій для поточного стану wizard
     * @returns boolean Дії успішно отримані
     * @throws ApiError
     */
    public static getAvailableActions({
        wizardId,
    }: {
        wizardId: string,
    }): CancelablePromise<Record<string, boolean>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order-wizard/{wizardId}/actions',
            path: {
                'wizardId': wizardId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Wizard не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Отримати всі можливі дії Order Wizard
     * Повертає повний список всіх дій, які можуть бути виконані в wizard
     * @returns string Список дій успішно отримано
     * @throws ApiError
     */
    public static getAllAvailableActions(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order-wizard/available-actions',
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
     * @returns string OK
     * @throws ApiError
     */
    public static getActiveWizards(): CancelablePromise<Record<string, 'INITIAL' | 'CLIENT_SELECTION' | 'ORDER_INITIALIZATION' | 'ITEM_MANAGEMENT' | 'ITEM_WIZARD_ACTIVE' | 'ITEM_BASIC_INFO' | 'ITEM_CHARACTERISTICS' | 'ITEM_DEFECTS_STAINS' | 'ITEM_PRICING' | 'ITEM_PHOTOS' | 'ITEM_COMPLETED' | 'EXECUTION_PARAMS' | 'GLOBAL_DISCOUNTS' | 'PAYMENT_PROCESSING' | 'ADDITIONAL_INFO' | 'ORDER_CONFIRMATION' | 'ORDER_REVIEW' | 'LEGAL_ASPECTS' | 'RECEIPT_GENERATION' | 'COMPLETED' | 'CANCELLED'>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order-wizard/active',
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
     * @returns any OK
     * @throws ApiError
     */
    public static cancelWizard({
        wizardId,
    }: {
        wizardId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/order-wizard/{wizardId}',
            path: {
                'wizardId': wizardId,
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
