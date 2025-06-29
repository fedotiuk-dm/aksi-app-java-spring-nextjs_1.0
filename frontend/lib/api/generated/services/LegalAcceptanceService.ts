/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LegalAcceptanceDTO } from '../models/LegalAcceptanceDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LegalAcceptanceService {
    /**
     * Оновлення юридичного прийняття
     * @returns any OK
     * @throws ApiError
     */
    public static stage4UpdateLegalAcceptance({
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
}
