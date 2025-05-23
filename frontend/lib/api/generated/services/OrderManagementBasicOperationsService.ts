/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrderRequest } from '../models/CreateOrderRequest';
import type { OrderDTO } from '../models/OrderDTO';
import type { OrderItemDTO } from '../models/OrderItemDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderManagementBasicOperationsService {
    /**
     * Отримати конкретний предмет замовлення
     * Повертає предмет замовлення за його ID
     * @returns OrderItemDTO Предмет замовлення знайдено
     * @throws ApiError
     */
    public static getOrderItem({
        orderId,
        itemId,
    }: {
        /**
         * ID замовлення
         */
        orderId: string,
        /**
         * ID предмета
         */
        itemId: string,
    }): CancelablePromise<OrderItemDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/{orderId}/items/{itemId}',
            path: {
                'orderId': orderId,
                'itemId': itemId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Предмет замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Оновити предмет замовлення
     * Оновлює існуючий предмет у замовленні
     * @returns OrderItemDTO Предмет замовлення успішно оновлено
     * @throws ApiError
     */
    public static updateOrderItem({
        orderId,
        itemId,
        requestBody,
    }: {
        /**
         * ID замовлення
         */
        orderId: string,
        /**
         * ID предмета
         */
        itemId: string,
        requestBody: OrderItemDTO,
    }): CancelablePromise<OrderItemDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/{orderId}/items/{itemId}',
            path: {
                'orderId': orderId,
                'itemId': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Предмет замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Видалити предмет замовлення
     * Видаляє предмет із замовлення
     * @returns void
     * @throws ApiError
     */
    public static deleteOrderItem({
        orderId,
        itemId,
    }: {
        /**
         * ID замовлення
         */
        orderId: string,
        /**
         * ID предмета
         */
        itemId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orders/{orderId}/items/{itemId}',
            path: {
                'orderId': orderId,
                'itemId': itemId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Предмет замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Оновити статус замовлення
     * Оновлює статус замовлення
     * @returns OrderDTO Статус замовлення успішно оновлено
     * @throws ApiError
     */
    public static updateOrderStatus({
        id,
        status,
    }: {
        /**
         * ID замовлення
         */
        id: string,
        /**
         * Новий статус замовлення
         */
        status: 'DRAFT' | 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED',
    }): CancelablePromise<OrderDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/{id}/status/{status}',
            path: {
                'id': id,
                'status': status,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Додати передоплату
     * Додає передоплату до замовлення
     * @returns OrderDTO Передоплату успішно додано
     * @throws ApiError
     */
    public static addPrepayment({
        id,
        amount,
    }: {
        /**
         * ID замовлення
         */
        id: string,
        /**
         * Сума передоплати
         */
        amount: number,
    }): CancelablePromise<OrderDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/{id}/prepayment/{amount}',
            path: {
                'id': id,
                'amount': amount,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Застосувати знижку
     * Застосовує знижку до замовлення
     * @returns OrderDTO Знижку успішно застосовано
     * @throws ApiError
     */
    public static applyDiscount({
        id,
        amount,
    }: {
        /**
         * ID замовлення
         */
        id: string,
        /**
         * Сума знижки
         */
        amount: number,
    }): CancelablePromise<OrderDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/{id}/discount/{amount}',
            path: {
                'id': id,
                'amount': amount,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Перетворити чернетку на замовлення
     * Перетворює чернетку на активне замовлення
     * @returns OrderDTO Чернетку успішно перетворено на замовлення
     * @throws ApiError
     */
    public static convertDraftToOrder({
        id,
    }: {
        /**
         * ID чернетки замовлення
         */
        id: string,
    }): CancelablePromise<OrderDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/{id}/convert-draft',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Відзначити замовлення як виконане
     * Відзначає замовлення як виконане
     * @returns OrderDTO Замовлення успішно відзначено як виконане
     * @throws ApiError
     */
    public static completeOrder({
        id,
    }: {
        /**
         * ID замовлення
         */
        id: string,
    }): CancelablePromise<OrderDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/{id}/complete',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Отримати всі замовлення
     * Повертає список всіх замовлень
     * @returns OrderDTO Успішно отримано список замовлень
     * @throws ApiError
     */
    public static getAllOrders(): CancelablePromise<Array<OrderDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders',
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
     * Створити нове замовлення
     * Створює нове замовлення
     * @returns OrderDTO Замовлення успішно створено
     * @throws ApiError
     */
    public static createOrder({
        requestBody,
    }: {
        requestBody: CreateOrderRequest,
    }): CancelablePromise<OrderDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders',
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
     * Отримати всі предмети замовлення
     * Повертає список всіх предметів для конкретного замовлення
     * @returns OrderItemDTO Успішно отримано список предметів замовлення
     * @throws ApiError
     */
    public static getOrderItems({
        orderId,
    }: {
        /**
         * ID замовлення
         */
        orderId: string,
    }): CancelablePromise<Array<OrderItemDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/{orderId}/items',
            path: {
                'orderId': orderId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Додати новий предмет до замовлення
     * Додає новий предмет до конкретного замовлення
     * @returns OrderItemDTO Предмет успішно додано до замовлення
     * @throws ApiError
     */
    public static addOrderItem({
        orderId,
        requestBody,
    }: {
        /**
         * ID замовлення
         */
        orderId: string,
        requestBody: OrderItemDTO,
    }): CancelablePromise<OrderItemDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/{orderId}/items',
            path: {
                'orderId': orderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Зберегти чернетку замовлення
     * Зберігає замовлення як чернетку
     * @returns OrderDTO Чернетку замовлення успішно збережено
     * @throws ApiError
     */
    public static saveOrderDraft({
        requestBody,
    }: {
        requestBody: CreateOrderRequest,
    }): CancelablePromise<OrderDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/draft',
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
     * Отримати замовлення за ID
     * Повертає замовлення за його ID
     * @returns OrderDTO Замовлення знайдено
     * @throws ApiError
     */
    public static getOrderById({
        id,
    }: {
        /**
         * ID замовлення
         */
        id: string,
    }): CancelablePromise<OrderDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Отримати чернетки замовлень
     * Повертає список чернеток замовлень
     * @returns OrderDTO Успішно отримано список чернеток замовлень
     * @throws ApiError
     */
    public static getDraftOrders(): CancelablePromise<Array<OrderDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/drafts',
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
     * Отримати активні замовлення
     * Повертає список активних замовлень
     * @returns OrderDTO Успішно отримано список активних замовлень
     * @throws ApiError
     */
    public static getActiveOrders(): CancelablePromise<Array<OrderDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/active',
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
     * Скасувати замовлення
     * Скасовує замовлення
     * @returns void
     * @throws ApiError
     */
    public static cancelOrder({
        id,
    }: {
        /**
         * ID замовлення
         */
        id: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orders/{id}/cancel',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Замовлення не знайдено`,
                409: `Conflict`,
            },
        });
    }
}
