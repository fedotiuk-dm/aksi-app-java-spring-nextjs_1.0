/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemBasicInfoDTO } from '../models/ItemBasicInfoDTO';
import type { LegalAcceptanceDTO } from '../models/LegalAcceptanceDTO';
import type { OrderCompletionDTO } from '../models/OrderCompletionDTO';
import type { OrderConfirmationDTO } from '../models/OrderConfirmationDTO';
import type { ReceiptConfigurationDTO } from '../models/ReceiptConfigurationDTO';
import type { SubstepResultDTO } from '../models/SubstepResultDTO';
import type { ValidationResult } from '../models/ValidationResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ValidationService {
    /**
     * Валідація конфігурації квитанції
     * @returns any OK
     * @throws ApiError
     */
    public static stage4ValidateReceiptConfiguration({
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
    public static stage4ValidateOrderConfirmation({
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
    public static stage4ValidateOrderCompletion({
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
    public static stage4ValidateLegalAcceptance({
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
     * Валідує всі вибрані характеристики
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static substep2ValidateCharacteristics({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ValidationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep2/validate/{sessionId}',
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
     * Валідує та завершує підетап 1
     * @returns ItemBasicInfoDTO OK
     * @throws ApiError
     */
    public static substep1ValidateAndComplete({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ItemBasicInfoDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep1/{sessionId}/validate-and-complete',
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
     * Повна валідація Stage4
     * @returns any OK
     * @throws ApiError
     */
    public static stage4ValidateComplete({
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
     * Валідація поточного стану
     * @returns boolean OK
     * @throws ApiError
     */
    public static substep4ValidateCurrentState({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep4/validate/{sessionId}',
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
     * Детальна валідація з результатом
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static substep4ValidateDetailed({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep4/validate-detailed/{sessionId}',
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
