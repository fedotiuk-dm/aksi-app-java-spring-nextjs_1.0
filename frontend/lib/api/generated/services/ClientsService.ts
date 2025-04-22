/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientCreateRequest } from '../models/ClientCreateRequest';
import type { ClientResponse } from '../models/ClientResponse';
import type { ClientSearchRequest } from '../models/ClientSearchRequest';
import type { ClientUpdateRequest } from '../models/ClientUpdateRequest';
import type { PageClientResponse } from '../models/PageClientResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClientsService {
    /**
     * Створення клієнта
     * Створює нового клієнта з переданими даними
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static createClient({
        requestBody,
    }: {
        requestBody: ClientCreateRequest,
    }): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/clients',
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
     * Пошук клієнтів
     * Повертає список клієнтів з пагінацією, сортуванням та фільтрацією
     * @returns PageClientResponse OK
     * @throws ApiError
     */
    public static searchClients({
        requestBody,
    }: {
        requestBody: ClientSearchRequest,
    }): CancelablePromise<PageClientResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/clients/search',
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
     * Найбільш лояльні клієнти
     * Повертає список найбільш лояльних клієнтів
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static getTopLoyalClients({
        limit = 10,
    }: {
        /**
         * Кількість клієнтів
         */
        limit?: number,
    }): CancelablePromise<Array<ClientResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/clients/top/loyal',
            query: {
                'limit': limit,
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
     * Клієнти з найбільшою сумою замовлень
     * Повертає список клієнтів з найбільшою сумою замовлень
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static getTopSpendingClients({
        limit = 10,
    }: {
        /**
         * Кількість клієнтів
         */
        limit?: number,
    }): CancelablePromise<Array<ClientResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/clients/top/spending',
            query: {
                'limit': limit,
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
     * Видалення клієнта
     * Видаляє клієнта за ідентифікатором
     * @returns any OK
     * @throws ApiError
     */
    public static deleteClient({
        id,
    }: {
        /**
         * Ідентифікатор клієнта
         */
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/clients/{id}',
            path: {
                'id': id,
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
     * Отримання клієнта
     * Повертає клієнта за ідентифікатором
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static getClientById({
        id,
    }: {
        /**
         * Ідентифікатор клієнта
         */
        id: string,
    }): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/clients/{id}',
            path: {
                'id': id,
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
     * Оновлення клієнта
     * Оновлює існуючого клієнта за ідентифікатором
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static updateClient({
        id,
        requestBody,
    }: {
        /**
         * Ідентифікатор клієнта
         */
        id: string,
        requestBody: ClientUpdateRequest,
    }): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/clients/{id}',
            path: {
                'id': id,
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
