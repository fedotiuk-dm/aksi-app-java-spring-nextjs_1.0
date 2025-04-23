/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemDefectDto } from '../models/OrderItemDefectDto';
import type { OrderItemStainDto } from '../models/OrderItemStainDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderItemDetailsService {
    /**
     * @returns string OK
     * @throws ApiError
     */
    public static getAllDefectTypes(): CancelablePromise<Array<Record<string, string>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-items/defect-types',
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
     * @returns string OK
     * @throws ApiError
     */
    public static getAllStainTypes(): CancelablePromise<Array<Record<string, string>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-items/stain-types',
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
     * @returns any OK
     * @throws ApiError
     */
    public static updateDefectNotes({
        itemId,
        requestBody,
    }: {
        itemId: string,
        requestBody: Record<string, string>,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/order-items/{itemId}/defect-notes',
            path: {
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
     * @returns OrderItemDefectDto OK
     * @throws ApiError
     */
    public static addDefectToItem({
        itemId,
        requestBody,
    }: {
        itemId: string,
        requestBody: OrderItemDefectDto,
    }): CancelablePromise<OrderItemDefectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-items/{itemId}/defects',
            path: {
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
     * @returns any OK
     * @throws ApiError
     */
    public static updateNoWarrantyStatus({
        itemId,
        requestBody,
    }: {
        itemId: string,
        requestBody: Record<string, Record<string, any>>,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/order-items/{itemId}/no-warranty',
            path: {
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
     * @returns OrderItemStainDto OK
     * @throws ApiError
     */
    public static addStainToItem({
        itemId,
        requestBody,
    }: {
        itemId: string,
        requestBody: OrderItemStainDto,
    }): CancelablePromise<OrderItemStainDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-items/{itemId}/stains',
            path: {
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
