/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemPhotoDto } from '../models/OrderItemPhotoDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderItemPhotosApiService {
    /**
     * Отримати всі фотографії
     * Повертає всі фотографії для конкретного предмета замовлення
     * @returns OrderItemPhotoDto OK
     * @throws ApiError
     */
    public static getItemPhotos({
        itemId,
    }: {
        /**
         * ID предмета замовлення
         */
        itemId: string,
    }): CancelablePromise<Array<OrderItemPhotoDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-items/{itemId}/photos',
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
     * Завантажити фотографію
     * Завантажує нову фотографію для предмета замовлення
     * @returns OrderItemPhotoDto OK
     * @throws ApiError
     */
    public static uploadPhoto({
        itemId,
        formData,
    }: {
        /**
         * ID предмета замовлення
         */
        itemId: string,
        formData?: {
            /**
             * Опис фотографії (опціонально)
             */
            description?: string;
            /**
             * Файл зображення для завантаження
             */
            file: Blob;
        },
    }): CancelablePromise<OrderItemPhotoDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-items/{itemId}/photos',
            path: {
                'itemId': itemId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
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
     * Видалити фотографію
     * Видаляє фотографію за її ID
     * @returns any OK
     * @throws ApiError
     */
    public static deletePhoto({
        itemId,
        photoId,
    }: {
        /**
         * ID предмета замовлення
         */
        itemId: string,
        /**
         * ID фотографії
         */
        photoId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/order-items/{itemId}/photos/{photoId}',
            path: {
                'itemId': itemId,
                'photoId': photoId,
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
     * Отримати фотографію
     * Повертає конкретну фотографію за її ID
     * @returns OrderItemPhotoDto OK
     * @throws ApiError
     */
    public static getPhoto({
        itemId,
        photoId,
    }: {
        /**
         * ID предмета замовлення
         */
        itemId: string,
        /**
         * ID фотографії
         */
        photoId: string,
    }): CancelablePromise<OrderItemPhotoDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-items/{itemId}/photos/{photoId}',
            path: {
                'itemId': itemId,
                'photoId': photoId,
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
     * Оновити деталі фотографії
     * Оновлює опис та/або анотації фотографії
     * @returns OrderItemPhotoDto OK
     * @throws ApiError
     */
    public static updatePhotoDetails({
        itemId,
        photoId,
        description,
        annotationData,
    }: {
        /**
         * ID предмета замовлення
         */
        itemId: string,
        /**
         * ID фотографії
         */
        photoId: string,
        /**
         * Новий опис фотографії (опціонально)
         */
        description?: string,
        /**
         * Нові дані анотацій у форматі JSON (опціонально)
         */
        annotationData?: string,
    }): CancelablePromise<OrderItemPhotoDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/order-items/{itemId}/photos/{photoId}',
            path: {
                'itemId': itemId,
                'photoId': photoId,
            },
            query: {
                'description': description,
                'annotationData': annotationData,
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
