/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemBasicInfoDTO } from '../models/ItemBasicInfoDTO';
import type { PriceListItemDTO } from '../models/PriceListItemDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PriceListItemsService {
    /**
     * Вибирає предмет з прайс-листа
     * @returns ItemBasicInfoDTO OK
     * @throws ApiError
     */
    public static substep1SelectPriceListItem({
        sessionId,
        itemId,
    }: {
        sessionId: string,
        itemId: string,
    }): CancelablePromise<ItemBasicInfoDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep1/{sessionId}/select-item',
            path: {
                'sessionId': sessionId,
            },
            query: {
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
     * Отримує список предметів для категорії
     * @returns PriceListItemDTO OK
     * @throws ApiError
     */
    public static substep1GetItemsForCategory({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<Array<PriceListItemDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep1/categories/{categoryId}/items',
            path: {
                'categoryId': categoryId,
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
