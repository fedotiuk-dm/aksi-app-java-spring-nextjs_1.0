/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderWizardResponseDTO } from '../models/OrderWizardResponseDTO';
import type { StainsDefectsContext } from '../models/StainsDefectsContext';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NavigationService {
    /**
     * Повернення до попереднього стану
     * @returns StainsDefectsContext OK
     * @throws ApiError
     */
    public static substep3GoBack({
        sessionId,
        targetState,
    }: {
        sessionId: string,
        targetState: 'NOT_STARTED' | 'SELECTING_STAINS' | 'SELECTING_DEFECTS' | 'ENTERING_NOTES' | 'VALIDATING_DATA' | 'COMPLETED' | 'ERROR',
    }): CancelablePromise<StainsDefectsContext> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep3/go-back/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'targetState': targetState,
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
     * Повернення на попередній етап
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardGoBack({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-wizard/session/{sessionId}/go-back',
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
}
