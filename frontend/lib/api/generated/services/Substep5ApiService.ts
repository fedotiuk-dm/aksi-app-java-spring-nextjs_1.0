/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PhotoDocumentationDTO } from '../models/PhotoDocumentationDTO';
import type { SubstepResultDTO } from '../models/SubstepResultDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Substep5ApiService {
    /**
     * Додавання фотографії
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static addPhoto({
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
     * Завершення фотодокументації
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static completePhotoDocumentation({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep5/{sessionId}/complete',
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
     * Ініціалізація підетапу 5 - Фотодокументація
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static initializeSubstep5({
        itemId,
    }: {
        itemId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep5/initialize/{itemId}',
            path: {
                'itemId': itemId,
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
     * Отримання статусу фотодокументації
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static getDocumentationStatus({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep5/{sessionId}/status',
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
     * Отримання даних фотодокументації
     * @returns PhotoDocumentationDTO OK
     * @throws ApiError
     */
    public static getDocumentationData({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<PhotoDocumentationDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep5/{sessionId}/data',
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
     * Закриття сесії фотодокументації
     * @returns any OK
     * @throws ApiError
     */
    public static closeSession2({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage2/substep5/{sessionId}',
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
     * Видалення фотографії
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static removePhoto({
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
