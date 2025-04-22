/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemPriceCalculationDto } from '../models/OrderItemPriceCalculationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PriceCalculationsApiService {
    /**
     * Отримати деталі розрахунку ціни для предмета
     * Повертає детальну інформацію про кроки розрахунку ціни для конкретного предмета замовлення
     * @returns OrderItemPriceCalculationDto OK
     * @throws ApiError
     */
    public static getItemPriceCalculation({
        itemId,
    }: {
        /**
         * ID предмета замовлення
         */
        itemId: string,
    }): CancelablePromise<OrderItemPriceCalculationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/price-calculations/items/{itemId}',
            path: {
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
     * Отримати деталі розрахунків цін для замовлення
     * Повертає детальну інформацію про кроки розрахунку цін для всіх предметів у замовленні
     * @returns OrderItemPriceCalculationDto OK
     * @throws ApiError
     */
    public static getOrderPriceCalculations({
        orderId,
    }: {
        /**
         * ID замовлення
         */
        orderId: string,
    }): CancelablePromise<Array<OrderItemPriceCalculationDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/price-calculations/orders/{orderId}',
            path: {
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
}
