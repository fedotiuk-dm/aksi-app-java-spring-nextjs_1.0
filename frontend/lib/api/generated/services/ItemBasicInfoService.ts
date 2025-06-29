/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemBasicInfoDTO } from '../models/ItemBasicInfoDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemBasicInfoService {
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
}
