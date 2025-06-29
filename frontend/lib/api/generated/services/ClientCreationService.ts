/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientResponse } from '../models/ClientResponse';
import type { NewClientFormDTO } from '../models/NewClientFormDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClientCreationService {
    /**
     * Отримує поточні дані форми
     * @returns NewClientFormDTO OK
     * @throws ApiError
     */
    public static stage1GetClientFormData({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<NewClientFormDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}/data',
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
     * Оновлює дані форми клієнта
     * @returns any OK
     * @throws ApiError
     */
    public static stage1UpdateClientData({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: NewClientFormDTO,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}/data',
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
     * Валідує форму клієнта
     * @returns any OK
     * @throws ApiError
     */
    public static stage1ValidateClientForm({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}/validate',
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
     * Створює нового клієнта
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static stage1CreateClient({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}/create',
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
     * Завершує створення клієнта
     * @returns any OK
     * @throws ApiError
     */
    public static stage1CompleteClientCreation({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}/complete',
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
     * Ініціалізує форму створення нового клієнта
     * @returns string OK
     * @throws ApiError
     */
    public static stage1InitializeNewClient(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/new-client/initialize',
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
     * Отримує поточний стан форми
     * @returns string OK
     * @throws ApiError
     */
    public static stage1GetClientFormState({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<'INIT' | 'FILLING_BASIC_INFO' | 'FILLING_CONTACT_INFO' | 'VALIDATING' | 'CHECKING_DUPLICATES' | 'DUPLICATES_FOUND' | 'SAVING' | 'COMPLETED' | 'ERROR' | 'CANCELLED'> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}/state',
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
     * Скасовує створення клієнта
     * @returns any OK
     * @throws ApiError
     */
    public static stage1CancelClientCreation({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}',
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
