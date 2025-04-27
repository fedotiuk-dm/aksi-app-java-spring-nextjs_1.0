/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BranchLocationCreateRequest } from '../models/BranchLocationCreateRequest';
import type { BranchLocationDTO } from '../models/BranchLocationDTO';
import type { BranchLocationUpdateRequest } from '../models/BranchLocationUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BranchLocationsApiService {
    /**
     * Отримати всі пункти прийому замовлень
     * Повертає список всіх пунктів прийому, якщо active=true - тільки активні
     * @returns BranchLocationDTO Успішно отримано список пунктів прийому
     * @throws ApiError
     */
    public static getAllBranchLocations({
        active,
    }: {
        active?: boolean,
    }): CancelablePromise<BranchLocationDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/branch-locations',
            query: {
                'active': active,
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
     * Створити новий пункт прийому
     * Створює новий пункт прийому замовлень
     * @returns BranchLocationDTO Пункт прийому успішно створено
     * @throws ApiError
     */
    public static createBranchLocation({
        requestBody,
    }: {
        requestBody: BranchLocationCreateRequest,
    }): CancelablePromise<BranchLocationDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/branch-locations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Некоректні дані запиту`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Пункт прийому з таким кодом вже існує`,
            },
        });
    }
    /**
     * Отримати пункт прийому за кодом
     * Повертає пункт прийому за вказаним кодом
     * @returns BranchLocationDTO Успішно отримано пункт прийому
     * @throws ApiError
     */
    public static getBranchLocationByCode({
        code,
    }: {
        code: string,
    }): CancelablePromise<BranchLocationDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/branch-locations/code/{code}',
            path: {
                'code': code,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Пункт прийому не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Видалити пункт прийому
     * Видаляє пункт прийому замовлень
     * @returns void
     * @throws ApiError
     */
    public static deleteBranchLocation({
        id,
    }: {
        id: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/branch-locations/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Пункт прийому не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Отримати пункт прийому за ID
     * Повертає пункт прийому за вказаним ідентифікатором
     * @returns BranchLocationDTO Успішно отримано пункт прийому
     * @throws ApiError
     */
    public static getBranchLocationById({
        id,
    }: {
        id: string,
    }): CancelablePromise<BranchLocationDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/branch-locations/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Пункт прийому не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Оновити пункт прийому
     * Оновлює існуючий пункт прийому замовлень
     * @returns BranchLocationDTO Пункт прийому успішно оновлено
     * @throws ApiError
     */
    public static updateBranchLocation({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: BranchLocationUpdateRequest,
    }): CancelablePromise<BranchLocationDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/branch-locations/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Некоректні дані запиту`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Пункт прийому не знайдено`,
                409: `Пункт прийому з таким кодом вже існує`,
            },
        });
    }
    /**
     * Змінити статус активності
     * Змінює статус активності пункту прийому
     * @returns BranchLocationDTO Статус активності успішно змінено
     * @throws ApiError
     */
    public static setActiveStatus({
        id,
        active,
    }: {
        id: string,
        active: boolean,
    }): CancelablePromise<BranchLocationDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/branch-locations/{id}/active',
            path: {
                'id': id,
            },
            query: {
                'active': active,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Пункт прийому не знайдено`,
                409: `Conflict`,
            },
        });
    }
}
