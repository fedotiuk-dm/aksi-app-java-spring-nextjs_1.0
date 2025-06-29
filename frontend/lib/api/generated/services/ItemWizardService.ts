/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemManagerDTO } from '../models/ItemManagerDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemWizardService {
    /**
     * Запускає новий підвізард додавання предмета
     * @returns ItemManagerDTO OK
     * @throws ApiError
     */
    public static stage2StartNewItemWizard({
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
    public static stage2StartEditItemWizard({
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
    public static stage2CloseWizard({
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
}
