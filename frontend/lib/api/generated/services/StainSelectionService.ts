/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StainsDefectsContext } from '../models/StainsDefectsContext';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StainSelectionService {
    /**
     * Обробка вибору плям
     * @returns StainsDefectsContext OK
     * @throws ApiError
     */
    public static substep3ProcessStainSelection({
        sessionId,
        selectedStains,
        otherStains,
    }: {
        sessionId: string,
        selectedStains?: string,
        otherStains?: string,
    }): CancelablePromise<StainsDefectsContext> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep3/stains/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'selectedStains': selectedStains,
                'otherStains': otherStains,
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
