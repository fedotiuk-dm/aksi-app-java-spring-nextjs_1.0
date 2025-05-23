/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PriceListItemDTO } from '../models/PriceListItemDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PricingPriceListService {
    /**
     * Отримати елемент прайс-листа за ID
     * Повертає елемент прайс-листа за вказаним ідентифікатором
     * @returns PriceListItemDTO OK
     * @throws ApiError
     */
    public static getItemById({
        itemId,
    }: {
        itemId: string,
    }): CancelablePromise<PriceListItemDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/price-list/item/{itemId}',
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
     * Отримати всі елементи прайс-листа за кодом категорії
     * Повертає список елементів прайс-листа для вказаної категорії
     * @returns PriceListItemDTO OK
     * @throws ApiError
     */
    public static getItemsByCategoryCode({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Array<PriceListItemDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/price-list/category/{categoryCode}/items',
            path: {
                'categoryCode': categoryCode,
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
