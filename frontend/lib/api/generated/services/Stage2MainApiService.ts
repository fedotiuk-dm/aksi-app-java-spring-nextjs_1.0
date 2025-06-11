/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemManagerDTO } from '../models/ItemManagerDTO';
import type { OrderItemDTO } from '../models/OrderItemDTO';
import type { ValidationResult } from '../models/ValidationResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Stage2MainApiService {
    /**
     * Оновлює існуючий предмет замовлення (з підвізарда)
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static updateItemInOrder({
        sessionId,
        itemId,
        requestBody,
    }: {
        sessionId: string,
        itemId: string,
        requestBody: OrderItemDTO,
    }): CancelablePromise<ItemManagerDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/order-wizard/stage2/items/{sessionId}/{itemId}',
            path: {
                'sessionId': sessionId,
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
     * Видаляє предмет з замовлення
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static deleteItemFromOrder({
        sessionId,
        itemId,
    }: {
        sessionId: string,
        itemId: string,
    }): CancelablePromise<ItemManagerDTO> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage2/items/{sessionId}/{itemId}',
            path: {
                'sessionId': sessionId,
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
     * Запускає новий підвізард додавання предмета
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static startNewItemWizard({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ItemManagerDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/wizard/new/{sessionId}',
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
     * Запускає підвізард редагування існуючого предмета
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static startEditItemWizard({
        sessionId,
        itemId,
    }: {
        sessionId: string,
        itemId: string,
    }): CancelablePromise<ItemManagerDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/wizard/edit/{sessionId}/{itemId}',
            path: {
                'sessionId': sessionId,
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
     * Закриває активний підвізард без збереження
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static closeWizard({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ItemManagerDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/wizard/close/{sessionId}',
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
     * Синхронізує стан менеджера
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static synchronizeManager({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ItemManagerDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/synchronize/{sessionId}',
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
     * Скидає сесію до початкового стану
     * @returns any OK
     * @throws ApiError
     */
    public static resetSession({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/reset/{sessionId}',
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
     * Додає новий предмет до замовлення (з підвізарда)
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static addItemToOrder({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: OrderItemDTO,
    }): CancelablePromise<ItemManagerDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/items/{sessionId}',
            path: {
                'sessionId': sessionId,
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
     * Ініціалізує новий сеанс менеджера предметів для замовлення
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static initializeItemManager({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<ItemManagerDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/initialize/{orderId}',
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
    /**
     * Завершує етап 2 та переходить до наступного етапу
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static completeStage2({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ItemManagerDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/complete/{sessionId}',
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
     * Валідує поточний стан менеджера
     * @returns ValidationResult OK
     * @throws ApiError
     */
    public static validateCurrentState({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ValidationResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/validate/{sessionId}',
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
     * Отримує поточний стан сесії
     * @returns string OK
     * @throws ApiError
     */
    public static getCurrentState2({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<'NOT_STARTED' | 'INITIALIZING' | 'ITEMS_MANAGER_SCREEN' | 'ITEM_WIZARD_ACTIVE' | 'READY_TO_PROCEED' | 'COMPLETED' | 'ERROR'> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/state/{sessionId}',
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
     * Отримує кількість активних сесій
     * @returns number OK
     * @throws ApiError
     */
    public static getActiveSessionCount(): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/sessions/count',
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
     * Перевіряє готовність до переходу на наступний етап
     * @returns boolean OK
     * @throws ApiError
     */
    public static checkReadinessToProceed({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/ready/{sessionId}',
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
     * Отримує поточний стан менеджера предметів
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static getCurrentManager({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ItemManagerDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/manager/{sessionId}',
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
     * Завершує сесію та звільняє ресурси
     * @returns any OK
     * @throws ApiError
     */
    public static terminateSession({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage2/session/{sessionId}',
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
