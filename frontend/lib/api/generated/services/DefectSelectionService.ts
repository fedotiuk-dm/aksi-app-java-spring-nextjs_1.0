/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StainsDefectsContext } from '../models/StainsDefectsContext';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefectSelectionService {
    /**
     * Обробка вибору дефектів та ризиків
     * @returns StainsDefectsContext OK
     * @throws ApiError
     */
    public static substep3ProcessDefectSelection({
        sessionId,
        selectedDefects,
        noGuaranteeReason,
    }: {
        sessionId: string,
        selectedDefects?: string,
        noGuaranteeReason?: string,
    }): CancelablePromise<StainsDefectsContext> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep3/defects/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'selectedDefects': selectedDefects,
                'noGuaranteeReason': noGuaranteeReason,
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
