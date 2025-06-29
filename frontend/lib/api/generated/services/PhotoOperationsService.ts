/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubstepResultDTO } from '../models/SubstepResultDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PhotoOperationsService {
    /**
     * Додавання фотографії
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static substep5AddPhoto({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody?: {
            file: Blob;
        },
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep5/{sessionId}/photos',
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
     * Видалення фотографії
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static substep5RemovePhoto({
        sessionId,
        photoId,
    }: {
        sessionId: string,
        photoId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage2/substep5/{sessionId}/photos/{photoId}',
            path: {
                'sessionId': sessionId,
                'photoId': photoId,
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
