/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdditionalInfoDTO } from '../models/AdditionalInfoDTO';
import type { DiscountConfigurationDTO } from '../models/DiscountConfigurationDTO';
import type { ExecutionParamsDTO } from '../models/ExecutionParamsDTO';
import type { PaymentConfigurationDTO } from '../models/PaymentConfigurationDTO';
import type { Stage3Context } from '../models/Stage3Context';
import type { ValidationResult } from '../models/ValidationResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderWizardStage3Service {
    /**
     * Оновити конфігурацію оплати
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static stage3UpdatePaymentConfig({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: PaymentConfigurationDTO,
    }): CancelablePromise<ValidationResult> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/payment-config',
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
     * Оновити параметри виконання
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static stage3UpdateExecutionParams({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: ExecutionParamsDTO,
    }): CancelablePromise<ValidationResult> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/execution-params',
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
     * Оновити конфігурацію знижок
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static stage3UpdateDiscountConfig({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: DiscountConfigurationDTO,
    }): CancelablePromise<ValidationResult> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/discount-config',
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
     * Оновити додаткову інформацію
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static stage3UpdateAdditionalInfo({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: AdditionalInfoDTO,
    }): CancelablePromise<ValidationResult> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/additional-info',
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
     * Створити нову сесію Stage3
     * @returns string OK
     * @throws ApiError
     */
    public static stage3CreateSession({
        requestBody,
    }: {
        requestBody: string,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage3/sessions',
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
     * Ініціалізувати Stage3 для сесії
     * @returns any OK
     * @throws ApiError
     */
    public static stage3InitializeStage({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/initialize',
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
     * Закрити сесію
     * @returns any OK
     * @throws ApiError
     */
    public static stage3CloseSession({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/close',
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
     * Валідувати всі підетапи
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static stage3ValidateAllSubsteps({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ValidationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/validate-all',
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
     * Отримати стан сесії
     * @returns string OK
     * @throws ApiError
     */
    public static stage3GetSessionState({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<'STAGE3_INIT' | 'EXECUTION_PARAMS_INIT' | 'DATE_SELECTION' | 'URGENCY_SELECTION' | 'EXECUTION_PARAMS_COMPLETED' | 'DISCOUNT_CONFIG_INIT' | 'DISCOUNT_TYPE_SELECTION' | 'DISCOUNT_VALIDATION' | 'DISCOUNT_CONFIG_COMPLETED' | 'PAYMENT_CONFIG_INIT' | 'PAYMENT_METHOD_SELECTION' | 'PAYMENT_AMOUNT_CALCULATION' | 'PAYMENT_CONFIG_COMPLETED' | 'ADDITIONAL_INFO_INIT' | 'NOTES_INPUT' | 'REQUIREMENTS_INPUT' | 'ADDITIONAL_INFO_COMPLETED' | 'STAGE3_COMPLETED' | 'STAGE3_ERROR'> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/state',
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
     * Перевірити готовність Stage3
     * @returns boolean OK
     * @throws ApiError
     */
    public static stage3IsStageReady({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/ready',
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
     * Отримати прогрес сесії
     * @returns number OK
     * @throws ApiError
     */
    public static stage3GetSessionProgress({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/progress',
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
     * Перевірити готовність конфігурації оплати
     * @returns boolean OK
     * @throws ApiError
     */
    public static stage3IsPaymentConfigReady({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/payment-config/ready',
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
     * Отримати наступний підетап
     * @returns string OK
     * @throws ApiError
     */
    public static stage3GetNextSubstep({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<'STAGE3_INIT' | 'EXECUTION_PARAMS_INIT' | 'DATE_SELECTION' | 'URGENCY_SELECTION' | 'EXECUTION_PARAMS_COMPLETED' | 'DISCOUNT_CONFIG_INIT' | 'DISCOUNT_TYPE_SELECTION' | 'DISCOUNT_VALIDATION' | 'DISCOUNT_CONFIG_COMPLETED' | 'PAYMENT_CONFIG_INIT' | 'PAYMENT_METHOD_SELECTION' | 'PAYMENT_AMOUNT_CALCULATION' | 'PAYMENT_CONFIG_COMPLETED' | 'ADDITIONAL_INFO_INIT' | 'NOTES_INPUT' | 'REQUIREMENTS_INPUT' | 'ADDITIONAL_INFO_COMPLETED' | 'STAGE3_COMPLETED' | 'STAGE3_ERROR'> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/next-substep',
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
     * Перевірити готовність параметрів виконання
     * @returns boolean OK
     * @throws ApiError
     */
    public static stage3IsExecutionParamsReady({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/execution-params/ready',
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
     * Перевірити готовність конфігурації знижок
     * @returns boolean OK
     * @throws ApiError
     */
    public static stage3IsDiscountConfigReady({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/discount-config/ready',
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
     * Отримати контекст сесії
     * @returns Stage3Context OK
     * @throws ApiError
     */
    public static stage3GetSessionContext({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Stage3Context> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/context',
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
     * Перевірити готовність додаткової інформації
     * @returns boolean OK
     * @throws ApiError
     */
    public static stage3IsAdditionalInfoReady({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/additional-info/ready',
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
