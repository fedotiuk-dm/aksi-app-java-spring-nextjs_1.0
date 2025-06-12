/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StainsDefectsContext } from '../models/StainsDefectsContext';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefectNotesService {
    /**
     * Обробка додавання приміток про дефекти
     * @returns StainsDefectsContext OK
     * @throws ApiError
     */
    public static substep3ProcessDefectNotes({
        sessionId,
        defectNotes,
    }: {
        sessionId: string,
        defectNotes?: string,
    }): CancelablePromise<StainsDefectsContext> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep3/notes/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'defectNotes': defectNotes,
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
