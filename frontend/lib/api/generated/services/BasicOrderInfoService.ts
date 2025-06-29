/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BasicOrderInfoDTO } from '../models/BasicOrderInfoDTO';
import type { BranchLocationDTO } from '../models/BranchLocationDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BasicOrderInfoService {
    /**
     * Отримує поточну базову інформацію
     * @returns BasicOrderInfoDTO OK
     * @throws ApiError
     */
    public static stage1GetBasicOrderData({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<BasicOrderInfoDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage1/basic-order/session/{sessionId}/data',
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
     * Оновлює базову інформацію
     * @returns any OK
     * @throws ApiError
     */
    public static stage1UpdateBasicOrder({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: BasicOrderInfoDTO,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/order-wizard/stage1/basic-order/session/{sessionId}/data',
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
     * Починає workflow базової інформації
     * @returns string OK
     * @throws ApiError
     */
    public static stage1StartBasicOrderWorkflow(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/basic-order/workflow/start',
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
     * Валідує базову інформацію
     * @returns any OK
     * @throws ApiError
     */
    public static stage1ValidateBasicOrder({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/basic-order/session/{sessionId}/validate',
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
     * Встановлює унікальну мітку
     * @returns any OK
     * @throws ApiError
     */
    public static stage1SetUniqueTag({
        sessionId,
        uniqueTag,
    }: {
        sessionId: string,
        uniqueTag: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/basic-order/session/{sessionId}/set-unique-tag',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'uniqueTag': uniqueTag,
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
     * Вибирає філію для замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static stage1SelectBranch({
        sessionId,
        branchId,
    }: {
        sessionId: string,
        branchId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/basic-order/session/{sessionId}/select-branch',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'branchId': branchId,
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
     * Скидає базову інформацію до початкового стану
     * @returns any OK
     * @throws ApiError
     */
    public static stage1ResetBasicOrder({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/basic-order/session/{sessionId}/reset',
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
     * Генерує номер квитанції
     * @returns string OK
     * @throws ApiError
     */
    public static stage1GenerateReceiptNumber({
        sessionId,
        branchCode,
    }: {
        sessionId: string,
        branchCode: string,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/basic-order/session/{sessionId}/generate-receipt-number',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'branchCode': branchCode,
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
     * Завершує збір базової інформації
     * @returns any OK
     * @throws ApiError
     */
    public static stage1CompleteBasicOrder({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/basic-order/session/{sessionId}/complete',
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
     * Очищує помилки для сесії
     * @returns any OK
     * @throws ApiError
     */
    public static stage1ClearBasicOrderErrors({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/basic-order/session/{sessionId}/clear-errors',
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
     * Ініціалізує збір базової інформації замовлення
     * @returns string OK
     * @throws ApiError
     */
    public static stage1InitializeBasicOrder(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/basic-order/initialize',
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
     * Отримує поточний стан базової інформації
     * @returns string OK
     * @throws ApiError
     */
    public static stage1GetBasicOrderState({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<'INIT' | 'GENERATING_RECEIPT_NUMBER' | 'RECEIPT_NUMBER_GENERATED' | 'ENTERING_UNIQUE_TAG' | 'UNIQUE_TAG_ENTERED' | 'SELECTING_BRANCH' | 'BRANCH_SELECTED' | 'SETTING_CREATION_DATE' | 'CREATION_DATE_SET' | 'COMPLETED' | 'ERROR'> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage1/basic-order/session/{sessionId}/state',
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
     * Отримує філії для конкретної сесії
     * @returns BranchLocationDTO OK
     * @throws ApiError
     */
    public static stage1GetBranchesForSession({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Array<BranchLocationDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage1/basic-order/session/{sessionId}/branches',
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
     * Перевіряє чи філії завантажені для сесії
     * @returns boolean OK
     * @throws ApiError
     */
    public static stage1AreBranchesLoaded({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage1/basic-order/session/{sessionId}/branches/loaded',
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
     * Скасовує збір базової інформації
     * @returns any OK
     * @throws ApiError
     */
    public static stage1CancelBasicOrder({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage1/basic-order/session/{sessionId}',
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
