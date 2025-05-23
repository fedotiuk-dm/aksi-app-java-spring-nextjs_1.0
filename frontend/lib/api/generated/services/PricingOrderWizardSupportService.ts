/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PricingOrderWizardSupportService {
    /**
     * Отримати доступні матеріали для категорії
     * Повертає список матеріалів, які доступні для вибраної категорії послуг
     * @returns string OK
     * @throws ApiError
     */
    public static getMaterialsForCategory({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/categories/{categoryCode}/materials',
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
