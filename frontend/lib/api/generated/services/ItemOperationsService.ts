/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemManagerDTO } from '../models/ItemManagerDTO';
import type { OrderItemDTO } from '../models/OrderItemDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemOperationsService {
    /**
     * Оновлює існуючий предмет замовлення (з підвізарда)
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static stage2UpdateItemInOrder({
        sessionId,
        itemId,
        requestBody,
    }: {
        sessionId: string,
        itemId: string,
        requestBody: OrderItemDTO,
    }): CancelablePromise<ItemManagerDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/order-wizard/stage2/items/{sessionId}/{itemId}',
            path: {
                'sessionId': sessionId,
                'itemId': itemId,
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
     * Видаляє предмет з замовлення
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static stage2DeleteItemFromOrder({
        sessionId,
        itemId,
    }: {
        sessionId: string,
        itemId: string,
    }): CancelablePromise<ItemManagerDTO> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage2/items/{sessionId}/{itemId}',
            path: {
                'sessionId': sessionId,
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
     * Додає новий предмет до замовлення (з підвізарда)
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static stage2AddItemToOrder({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: OrderItemDTO,
    }): CancelablePromise<ItemManagerDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/items/{sessionId}',
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
}
