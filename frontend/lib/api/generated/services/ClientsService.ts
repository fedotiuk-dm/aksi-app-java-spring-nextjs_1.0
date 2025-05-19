/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientResponse } from '../models/ClientResponse';
import type { CreateClientRequest } from '../models/CreateClientRequest';
import type { UpdateClientRequest } from '../models/UpdateClientRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClientsService {
    /**
     * Отримати клієнта за ID
     * Повертає дані клієнта за його ID
     * @returns ClientResponse Успішно отримано дані клієнта
     * @throws ApiError
     */
    public static getClientById({
        id,
    }: {
        /**
         * ID клієнта
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
                404: `Клієнта не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Оновити клієнта
     * Оновлює дані існуючого клієнта
     * @returns ClientResponse Клієнта успішно оновлено
     * @throws ApiError
     */
    public static updateClient({
        id,
        requestBody,
    }: {
        /**
         * ID клієнта
         */
        id: string,
        requestBody: UpdateClientRequest,
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
                400: `Невірні дані`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Клієнта не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Видалити клієнта
     * Видаляє клієнта за його ID
     * @returns void
     * @throws ApiError
     */
    public static deleteClient({
        id,
    }: {
        /**
         * ID клієнта
         */
        id: string,
    }): CancelablePromise<void> {
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
                404: `Клієнта не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Отримати всіх клієнтів
     * Повертає список всіх клієнтів
     * @returns ClientResponse Успішно отримано список клієнтів
     * @throws ApiError
     */
    public static getAllClients(): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/clients',
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
     * Створити нового клієнта
     * Створює нового клієнта з наданими даними
     * @returns ClientResponse Клієнта успішно створено
     * @throws ApiError
     */
    public static createClient({
        requestBody,
    }: {
        requestBody: CreateClientRequest,
    }): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/clients',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Невірні дані`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Пошук клієнтів
     * Пошук клієнтів за ключовим словом
     * @returns ClientResponse Успішно отримано результати пошуку
     * @throws ApiError
     */
    public static searchClients({
        keyword,
    }: {
        /**
         * Ключове слово для пошуку
         */
        keyword: string,
    }): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/clients/search',
            query: {
                'keyword': keyword,
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
