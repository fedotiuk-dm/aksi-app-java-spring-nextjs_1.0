/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderDraftDto } from '../models/OrderDraftDto';
import type { OrderDraftRequest } from '../models/OrderDraftRequest';
import type { Pageable } from '../models/Pageable';
import type { PageOrderDraftDto } from '../models/PageOrderDraftDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderDraftsService {
    /**
     * Створити чернетку замовлення
     * Створює нову чернетку замовлення з переданими даними
     * @returns OrderDraftDto OK
     * @throws ApiError
     */
    public static createDraft({
        requestBody,
    }: {
        requestBody: OrderDraftRequest,
    }): CancelablePromise<OrderDraftDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/drafts',
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
     * Отримати чернетки для клієнта
     * Повертає сторінку з чернетками замовлень для заданого клієнта
     * @returns PageOrderDraftDto OK
     * @throws ApiError
     */
    public static getDraftsByClient({
        clientId,
        pageable,
    }: {
        /**
         * ID клієнта
         */
        clientId: string,
        pageable: Pageable,
    }): CancelablePromise<PageOrderDraftDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/drafts/client/{clientId}',
            path: {
                'clientId': clientId,
            },
            query: {
                'pageable': pageable,
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
     * Отримати чернетки поточного користувача
     * Повертає сторінку з чернетками замовлень, створеними поточним користувачем
     * @returns PageOrderDraftDto OK
     * @throws ApiError
     */
    public static getCurrentUserDrafts({
        pageable,
    }: {
        pageable: Pageable,
    }): CancelablePromise<PageOrderDraftDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/drafts/user',
            query: {
                'pageable': pageable,
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
     * Позначити чернетку як конвертовану
     * Позначає чернетку як конвертовану в замовлення
     * @returns OrderDraftDto OK
     * @throws ApiError
     */
    public static markAsConverted({
        draftId,
        orderId,
    }: {
        /**
         * ID чернетки
         */
        draftId: string,
        /**
         * ID замовлення
         */
        orderId: string,
    }): CancelablePromise<OrderDraftDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/drafts/{draftId}/convert/{orderId}',
            path: {
                'draftId': draftId,
                'orderId': orderId,
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
     * Видалити чернетку
     * Видаляє чернетку замовлення з заданим ID
     * @returns any OK
     * @throws ApiError
     */
    public static deleteDraft({
        id,
    }: {
        /**
         * ID чернетки
         */
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orders/drafts/{id}',
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
     * Отримати чернетку за ID
     * Повертає чернетку замовлення з заданим ID
     * @returns OrderDraftDto OK
     * @throws ApiError
     */
    public static getDraftById({
        id,
    }: {
        /**
         * ID чернетки
         */
        id: string,
    }): CancelablePromise<OrderDraftDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/drafts/{id}',
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
     * Оновити чернетку замовлення
     * Оновлює існуючу чернетку замовлення за заданим ID
     * @returns OrderDraftDto OK
     * @throws ApiError
     */
    public static updateDraft({
        id,
        requestBody,
    }: {
        /**
         * ID чернетки
         */
        id: string,
        requestBody: OrderDraftRequest,
    }): CancelablePromise<OrderDraftDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/drafts/{id}',
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
