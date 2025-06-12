/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderWizardResponseDTO } from '../models/OrderWizardResponseDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StageTransitionsService {
    /**
     * Перехід до Stage4 з Stage3
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardCompleteStage3({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-wizard/session/{sessionId}/complete-stage3',
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
     * Перехід до Stage3 з Stage2
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardCompleteStage2({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-wizard/session/{sessionId}/complete-stage2',
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
     * Перехід до наступного етапу з Stage1 до Stage2
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardCompleteStage1({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-wizard/session/{sessionId}/complete-stage1',
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
