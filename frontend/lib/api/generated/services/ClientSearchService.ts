/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientResponse } from '../models/ClientResponse';
import type { ClientSearchCriteriaDTO } from '../models/ClientSearchCriteriaDTO';
import type { ClientSearchResultDTO } from '../models/ClientSearchResultDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClientSearchService {
    /**
     * Вибирає клієнта зі списку результатів
     * @returns any OK
     * @throws ApiError
     */
    public static stage1SelectClient({
        sessionId,
        clientId,
    }: {
        sessionId: string,
        clientId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/select-client',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'clientId': clientId,
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
     * Виконує пошук клієнтів з критеріями
     * @returns ClientSearchResultDTO OK
     * @throws ApiError
     */
    public static stage1SearchClients({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: ClientSearchCriteriaDTO,
    }): CancelablePromise<ClientSearchResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/search',
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
     * Пошук клієнтів за телефоном
     * @returns ClientSearchResultDTO OK
     * @throws ApiError
     */
    public static stage1SearchClientsByPhone({
        sessionId,
        phone,
    }: {
        sessionId: string,
        phone: string,
    }): CancelablePromise<ClientSearchResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/search-by-phone',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'phone': phone,
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
     * Завершує пошук клієнта
     * @returns any OK
     * @throws ApiError
     */
    public static stage1CompleteClientSearch({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/complete',
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
     * Очищує результати пошуку
     * @returns any OK
     * @throws ApiError
     */
    public static stage1ClearClientSearch({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/clear',
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
     * Ініціалізує новий контекст пошуку клієнтів
     * @returns string OK
     * @throws ApiError
     */
    public static stage1InitializeClientSearch(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/client-search/initialize',
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
     * Отримує поточний стан пошуку
     * @returns string OK
     * @throws ApiError
     */
    public static stage1GetClientSearchState({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<'INIT' | 'READY_TO_SEARCH' | 'SEARCHING' | 'RESULTS_FOUND' | 'RESULTS_DISPLAYED' | 'NO_RESULTS' | 'CLIENT_SELECTED' | 'CREATE_NEW_CLIENT_MODE' | 'COMPLETED' | 'SEARCH_ERROR' | 'CANCELLED'> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/state',
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
     * Отримує обраного клієнта
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static stage1GetSelectedClient({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/selected-client',
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
     * Скасовує пошук клієнта
     * @returns any OK
     * @throws ApiError
     */
    public static stage1CancelClientSearch({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}',
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
