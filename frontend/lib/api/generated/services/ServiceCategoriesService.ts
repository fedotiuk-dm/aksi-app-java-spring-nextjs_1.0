/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemBasicInfoDTO } from '../models/ItemBasicInfoDTO';
import type { ServiceCategoryDTO } from '../models/ServiceCategoryDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServiceCategoriesService {
    /**
     * Вибирає категорію послуги
     * @returns ItemBasicInfoDTO OK
     * @throws ApiError
     */
    public static substep1SelectServiceCategory({
        sessionId,
        categoryId,
    }: {
        sessionId: string,
        categoryId: string,
    }): CancelablePromise<ItemBasicInfoDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep1/{sessionId}/select-category',
            path: {
                'sessionId': sessionId,
            },
            query: {
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
    /**
     * Отримує список доступних категорій послуг
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static substep1GetServiceCategories(): CancelablePromise<Array<ServiceCategoryDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep1/service-categories',
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
