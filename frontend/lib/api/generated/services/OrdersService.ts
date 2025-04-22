/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderCreateRequest } from '../models/OrderCreateRequest';
import type { OrderDto } from '../models/OrderDto';
import type { OrderItemCreateRequest } from '../models/OrderItemCreateRequest';
import type { Pageable } from '../models/Pageable';
import type { PageOrderDto } from '../models/PageOrderDto';
import type { ReceptionPointDTO } from '../models/ReceptionPointDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrdersService {
    /**
     * Get all orders
     * Returns a page of orders
     * @returns PageOrderDto OK
     * @throws ApiError
     */
    public static getAllOrders({
        pageable,
    }: {
        pageable: Pageable,
    }): CancelablePromise<PageOrderDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders',
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
     * Create a new order
     * Creates a new order with the given details
     * @returns OrderDto OK
     * @throws ApiError
     */
    public static createOrder({
        requestBody,
    }: {
        requestBody: OrderCreateRequest,
    }): CancelablePromise<OrderDto> {
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
     * Get orders by client
     * Returns a page of orders for the given client
     * @returns PageOrderDto OK
     * @throws ApiError
     */
    public static getOrdersByClient({
        clientId,
        pageable,
    }: {
        /**
         * ID of the client
         */
        clientId: string,
        pageable: Pageable,
    }): CancelablePromise<PageOrderDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/client/{clientId}',
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
     * Get orders by client and status
     * Returns a page of orders for the given client with the given status
     * @returns PageOrderDto OK
     * @throws ApiError
     */
    public static getOrdersByClientAndStatus({
        clientId,
        status,
        pageable,
    }: {
        /**
         * ID of the client
         */
        clientId: string,
        /**
         * Status of the orders
         */
        status: 'CREATED' | 'IN_PROGRESS' | 'READY' | 'COMPLETED' | 'CANCELLED',
        pageable: Pageable,
    }): CancelablePromise<PageOrderDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/client/{clientId}/status/{status}',
            path: {
                'clientId': clientId,
                'status': status,
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
     * Get orders by expected completion date
     * Returns a page of orders expected to be completed on the given date
     * @returns PageOrderDto OK
     * @throws ApiError
     */
    public static getOrdersByExpectedCompletionDate({
        date,
        pageable,
    }: {
        /**
         * Expected completion date
         */
        date: string,
        pageable: Pageable,
    }): CancelablePromise<PageOrderDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/completion-date/{date}',
            path: {
                'date': date,
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
     * Генерувати номер квитанції
     * Генерує унікальний номер квитанції у форматі YYMMDD-XXXX
     * @returns string OK
     * @throws ApiError
     */
    public static generateReceiptNumber(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/generate-receipt-number',
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
     * Get orders by date range
     * Returns a page of orders created between the given dates
     * @returns PageOrderDto OK
     * @throws ApiError
     */
    public static getOrdersByPeriod({
        startDate,
        endDate,
        pageable,
    }: {
        /**
         * Start date
         */
        startDate: string,
        /**
         * End date
         */
        endDate: string,
        pageable: Pageable,
    }): CancelablePromise<PageOrderDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/period',
            query: {
                'startDate': startDate,
                'endDate': endDate,
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
     * Get order by receipt number
     * Returns the order with the given receipt number
     * @returns OrderDto OK
     * @throws ApiError
     */
    public static getOrderByReceiptNumber({
        receiptNumber,
    }: {
        /**
         * Receipt number of the order
         */
        receiptNumber: string,
    }): CancelablePromise<OrderDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/receipt/{receiptNumber}',
            path: {
                'receiptNumber': receiptNumber,
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
     * Отримати активні пункти прийому
     * Повертає список активних пунктів прийому замовлень
     * @returns ReceptionPointDTO OK
     * @throws ApiError
     */
    public static getActiveReceptionPoints1(): CancelablePromise<Array<ReceptionPointDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/reception-points',
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
     * Search for orders
     * Returns a page of orders matching the search term
     * @returns PageOrderDto OK
     * @throws ApiError
     */
    public static searchOrders({
        term,
        pageable,
    }: {
        /**
         * Search term
         */
        term: string,
        pageable: Pageable,
    }): CancelablePromise<PageOrderDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/search',
            query: {
                'term': term,
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
     * Get orders by status
     * Returns a page of orders with the given status
     * @returns PageOrderDto OK
     * @throws ApiError
     */
    public static getOrdersByStatus({
        status,
        pageable,
    }: {
        /**
         * Status of the orders
         */
        status: 'CREATED' | 'IN_PROGRESS' | 'READY' | 'COMPLETED' | 'CANCELLED',
        pageable: Pageable,
    }): CancelablePromise<PageOrderDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/status/{status}',
            path: {
                'status': status,
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
     * Get order by unique tag
     * Returns the order with the given unique tag
     * @returns OrderDto OK
     * @throws ApiError
     */
    public static getOrderByUniqueTag({
        uniqueTag,
    }: {
        /**
         * Unique tag of the order
         */
        uniqueTag: string,
    }): CancelablePromise<OrderDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/tag/{uniqueTag}',
            path: {
                'uniqueTag': uniqueTag,
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
     * Delete order
     * Deletes the order with the given ID
     * @returns any OK
     * @throws ApiError
     */
    public static deleteOrder({
        id,
    }: {
        /**
         * ID of the order
         */
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/orders/{id}',
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
     * Get order by ID
     * Returns the order with the given ID
     * @returns OrderDto OK
     * @throws ApiError
     */
    public static getOrderById({
        id,
    }: {
        /**
         * ID of the order
         */
        id: string,
    }): CancelablePromise<OrderDto> {
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
                404: `Not Found`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Update an order
     * Updates the order with the given ID
     * @returns OrderDto OK
     * @throws ApiError
     */
    public static updateOrder({
        id,
        requestBody,
    }: {
        /**
         * ID of the order
         */
        id: string,
        requestBody: OrderCreateRequest,
    }): CancelablePromise<OrderDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/{id}',
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
     * Update order discount
     * Updates the discount of the order with the given ID
     * @returns OrderDto OK
     * @throws ApiError
     */
    public static updateOrderDiscount({
        id,
        discountType,
        customDiscountPercentage,
    }: {
        /**
         * ID of the order
         */
        id: string,
        /**
         * New discount type
         */
        discountType: 'NONE' | 'EVERCARD' | 'SOCIAL_MEDIA' | 'MILITARY' | 'CUSTOM',
        /**
         * Custom discount percentage (only for CUSTOM discount type)
         */
        customDiscountPercentage?: number,
    }): CancelablePromise<OrderDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/{id}/discount/{discountType}',
            path: {
                'id': id,
                'discountType': discountType,
            },
            query: {
                'customDiscountPercentage': customDiscountPercentage,
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
     * Add item to order
     * Adds an item to the order with the given ID
     * @returns OrderDto OK
     * @throws ApiError
     */
    public static addItemToOrder({
        id,
        requestBody,
    }: {
        /**
         * ID of the order
         */
        id: string,
        requestBody: OrderItemCreateRequest,
    }): CancelablePromise<OrderDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/{id}/items',
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
     * Update order payment
     * Updates the amount paid for the order with the given ID
     * @returns OrderDto OK
     * @throws ApiError
     */
    public static updateOrderPayment({
        id,
        amountPaid,
    }: {
        /**
         * ID of the order
         */
        id: string,
        /**
         * New amount paid
         */
        amountPaid: number,
    }): CancelablePromise<OrderDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/{id}/payment/{amountPaid}',
            path: {
                'id': id,
                'amountPaid': amountPaid,
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
     * Add client signature
     * Adds a client signature to the order
     * @returns OrderDto OK
     * @throws ApiError
     */
    public static addClientSignature({
        id,
        requestBody,
    }: {
        /**
         * ID of the order
         */
        id: string,
        requestBody: string,
    }): CancelablePromise<OrderDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/{id}/signature',
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
     * Update order status
     * Updates the status of the order with the given ID
     * @returns OrderDto OK
     * @throws ApiError
     */
    public static updateOrderStatus({
        id,
        status,
    }: {
        /**
         * ID of the order
         */
        id: string,
        /**
         * New status
         */
        status: 'CREATED' | 'IN_PROGRESS' | 'READY' | 'COMPLETED' | 'CANCELLED',
    }): CancelablePromise<OrderDto> {
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
                404: `Not Found`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Update order urgency
     * Updates the urgency of the order with the given ID
     * @returns OrderDto OK
     * @throws ApiError
     */
    public static updateOrderUrgency({
        id,
        urgencyType,
    }: {
        /**
         * ID of the order
         */
        id: string,
        /**
         * New urgency type
         */
        urgencyType: 'STANDARD' | 'HOURS_48' | 'HOURS_24',
    }): CancelablePromise<OrderDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/orders/{id}/urgency/{urgencyType}',
            path: {
                'id': id,
                'urgencyType': urgencyType,
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
     * Remove item from order
     * Removes an item from the order
     * @returns OrderDto OK
     * @throws ApiError
     */
    public static removeItemFromOrder({
        orderId,
        itemId,
    }: {
        /**
         * ID of the order
         */
        orderId: string,
        /**
         * ID of the item
         */
        itemId: string,
    }): CancelablePromise<OrderDto> {
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
                404: `Not Found`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Update order item
     * Updates an item in the order
     * @returns OrderDto OK
     * @throws ApiError
     */
    public static updateOrderItem({
        orderId,
        itemId,
        requestBody,
    }: {
        /**
         * ID of the order
         */
        orderId: string,
        /**
         * ID of the item
         */
        itemId: string,
        requestBody: OrderItemCreateRequest,
    }): CancelablePromise<OrderDto> {
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
                404: `Not Found`,
                409: `Conflict`,
            },
        });
    }
}
