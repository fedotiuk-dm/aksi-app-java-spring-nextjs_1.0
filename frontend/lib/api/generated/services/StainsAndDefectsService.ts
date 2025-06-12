/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemAddRequest } from '../models/OrderItemAddRequest';
import type { StainsDefectsContext } from '../models/StainsDefectsContext';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StainsAndDefectsService {
    /**
     * Ініціалізація підетапу 3
     * @returns StainsDefectsContext OK
     * @throws ApiError
     */
    public static substep3InitializeSubstep({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: OrderItemAddRequest,
    }): CancelablePromise<StainsDefectsContext> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep3/initialize/{sessionId}',
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
