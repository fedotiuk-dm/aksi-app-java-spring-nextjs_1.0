/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemBasicInfoDTO } from '../models/ItemBasicInfoDTO';
import type { PriceListItemDTO } from '../models/PriceListItemDTO';
import type { ServiceCategoryDTO } from '../models/ServiceCategoryDTO';
import type { SubstepResultDTO } from '../models/SubstepResultDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderWizardStage2Substep1Service {
    /**
     * Валідує та завершує підетап 1
     * @returns ItemBasicInfoDTO OK
     * @throws ApiError
     */
    public static substep1ValidateAndComplete({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ItemBasicInfoDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep1/{sessionId}/validate-and-complete',
            path: {
                'sessionId': sessionId,
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
     * Скидає підетап 1 до початкового стану
     * @returns ItemBasicInfoDTO OK
     * @throws ApiError
     */
    public static substep1Reset({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ItemBasicInfoDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep1/{sessionId}/reset',
            path: {
                'sessionId': sessionId,
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
     * Вводить кількість
     * @returns ItemBasicInfoDTO OK
     * @throws ApiError
     */
    public static substep1EnterQuantity({
        sessionId,
        quantity,
    }: {
        sessionId: string,
        quantity: number,
    }): CancelablePromise<ItemBasicInfoDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep1/{sessionId}/enter-quantity',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'quantity': quantity,
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
     * Починає новий підетап 1 - Основна інформація
     * @returns ItemBasicInfoDTO OK
     * @throws ApiError
     */
    public static substep1StartSubstep(): CancelablePromise<ItemBasicInfoDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep1/start',
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
     * Отримує поточний стан підетапу 1
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static substep1GetStatus({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep1/{sessionId}/status',
            path: {
                'sessionId': sessionId,
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
    /**
     * Завершує сесію підетапу 1
     * @returns any OK
     * @throws ApiError
     */
    public static substep1FinalizeSession({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage2/substep1/{sessionId}',
            path: {
                'sessionId': sessionId,
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
