/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReceptionPointDTO } from '../models/ReceptionPointDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReceptionPointsService {
    /**
     * Отримати всі активні пункти прийому
     * Повертає список всіх активних пунктів прийому замовлень
     * @returns ReceptionPointDTO OK
     * @throws ApiError
     */
    public static getActiveReceptionPoints(): CancelablePromise<Array<ReceptionPointDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reception-points',
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
     * @returns ReceptionPointDTO OK
     * @throws ApiError
     */
    public static createReceptionPoint({
        requestBody,
    }: {
        requestBody: ReceptionPointDTO,
    }): CancelablePromise<ReceptionPointDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reception-points',
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
     * Отримати всі пункти прийому
     * Повертає список всіх пунктів прийому замовлень (активних та неактивних)
     * @returns ReceptionPointDTO OK
     * @throws ApiError
     */
    public static getAllReceptionPoints(): CancelablePromise<Array<ReceptionPointDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reception-points/all',
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
     * Отримати пункт прийому за ідентифікатором
     * Повертає дані пункту прийому за його ідентифікатором
     * @returns ReceptionPointDTO OK
     * @throws ApiError
     */
    public static getReceptionPointById({
        id,
    }: {
        /**
         * Ідентифікатор пункту прийому
         */
        id: string,
    }): CancelablePromise<ReceptionPointDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reception-points/{id}',
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
     * Оновити пункт прийому
     * Оновлює дані існуючого пункту прийому замовлень
     * @returns ReceptionPointDTO OK
     * @throws ApiError
     */
    public static updateReceptionPoint({
        id,
        requestBody,
    }: {
        /**
         * Ідентифікатор пункту прийому
         */
        id: string,
        requestBody: ReceptionPointDTO,
    }): CancelablePromise<ReceptionPointDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/reception-points/{id}',
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
    /**
     * Змінити статус активності пункту прийому
     * Змінює статус активності (активний/неактивний) пункту прийому замовлень
     * @returns ReceptionPointDTO OK
     * @throws ApiError
     */
    public static setReceptionPointStatus({
        id,
        active,
    }: {
        /**
         * Ідентифікатор пункту прийому
         */
        id: string,
        /**
         * Статус активності (true - активний, false - неактивний)
         */
        active: boolean,
    }): CancelablePromise<ReceptionPointDTO> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/reception-points/{id}/status',
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
                404: `Not Found`,
                409: `Conflict`,
            },
        });
    }
}
