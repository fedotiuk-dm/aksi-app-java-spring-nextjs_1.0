/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemPhotoDTO } from '../models/OrderItemPhotoDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderManagementItemPhotosService {
    /**
     * Оновити анотації фотографії
     * Оновлює анотації (позначки) та опис для вказаної фотографії
     * @returns OrderItemPhotoDTO Анотації успішно оновлені
     * @throws ApiError
     */
    public static updatePhotoAnnotations({
        itemId,
        photoId,
        annotations,
        description,
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
         * JSON з анотаціями
         */
        annotations: string,
        /**
         * Новий опис фотографії
         */
        description?: string,
    }): CancelablePromise<OrderItemPhotoDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/order-items/{itemId}/photos/{photoId}/annotations',
            path: {
                'itemId': itemId,
                'photoId': photoId,
            },
            query: {
                'annotations': annotations,
                'description': description,
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
     * Отримати всі фотографії предмета замовлення
     * Повертає список всіх фотографій для вказаного предмета замовлення
     * @returns OrderItemPhotoDTO Список фотографій успішно отримано
     * @throws ApiError
     */
    public static getPhotosByItemId({
        itemId,
    }: {
        /**
         * ID предмета замовлення
         */
        itemId: string,
    }): CancelablePromise<Array<OrderItemPhotoDTO>> {
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
     * Завантажити фотографію предмета замовлення
     * Завантажує нову фотографію для вказаного предмета замовлення
     * @returns OrderItemPhotoDTO Фотографія успішно завантажена
     * @throws ApiError
     */
    public static uploadPhoto({
        itemId,
        description,
        formData,
    }: {
        /**
         * ID предмета замовлення
         */
        itemId: string,
        /**
         * Опис фотографії (опціонально)
         */
        description?: string,
        formData?: {
            /**
             * Файл фотографії
             */
            file: Blob;
        },
    }): CancelablePromise<OrderItemPhotoDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-items/{itemId}/photos',
            path: {
                'itemId': itemId,
            },
            query: {
                'description': description,
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
     * Отримати фотографію за ID
     * Отримує інформацію про конкретну фотографію предмета замовлення
     * @returns OrderItemPhotoDTO Інформація про фотографію успішно отримана
     * @throws ApiError
     */
    public static getPhotoById({
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
    }): CancelablePromise<OrderItemPhotoDTO> {
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
     * Видалити фотографію
     * Видаляє вказану фотографію предмета замовлення
     * @returns void
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
    }): CancelablePromise<void> {
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
}
