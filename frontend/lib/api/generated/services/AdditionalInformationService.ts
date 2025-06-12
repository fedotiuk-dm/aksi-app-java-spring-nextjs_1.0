/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdditionalInfoDTO } from '../models/AdditionalInfoDTO';
import type { ValidationResult } from '../models/ValidationResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdditionalInformationService {
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
