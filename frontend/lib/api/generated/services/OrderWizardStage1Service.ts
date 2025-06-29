/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BasicOrderInfoDTO } from '../models/BasicOrderInfoDTO';
import type { BranchLocationDTO } from '../models/BranchLocationDTO';
import type { ClientResponse } from '../models/ClientResponse';
import type { ClientSearchCriteriaDTO } from '../models/ClientSearchCriteriaDTO';
import type { ClientSearchResultDTO } from '../models/ClientSearchResultDTO';
import type { NewClientFormDTO } from '../models/NewClientFormDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderWizardStage1Service {
    /**
     * Отримує поточні дані форми
     * @returns NewClientFormDTO OK
     * @throws ApiError
     */
    public static stage1GetClientFormData({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<NewClientFormDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}/data',
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
     * Оновлює дані форми клієнта
     * @returns any OK
     * @throws ApiError
     */
    public static stage1UpdateClientData({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: NewClientFormDTO,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}/data',
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
     * Валідує форму клієнта
     * @returns any OK
     * @throws ApiError
     */
    public static stage1ValidateClientForm({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}/validate',
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
     * Створює нового клієнта
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static stage1CreateClient({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}/create',
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
     * Завершує створення клієнта
     * @returns any OK
     * @throws ApiError
     */
    public static stage1CompleteClientCreation({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}/complete',
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
     * Ініціалізує форму створення нового клієнта
     * @returns string OK
     * @throws ApiError
     */
    public static stage1InitializeNewClient(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/new-client/initialize',
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
     * Вибирає клієнта зі списку результатів
     * @returns any OK
     * @throws ApiError
     */
    public static stage1SelectClient({
        sessionId,
        clientId,
    }: {
        sessionId: string,
        clientId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/select-client',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'clientId': clientId,
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
     * Виконує пошук клієнтів з критеріями
     * @returns ClientSearchResultDTO OK
     * @throws ApiError
     */
    public static stage1SearchClients({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: ClientSearchCriteriaDTO,
    }): CancelablePromise<ClientSearchResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/search',
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
     * Пошук клієнтів за телефоном
     * @returns ClientSearchResultDTO OK
     * @throws ApiError
     */
    public static stage1SearchClientsByPhone({
        sessionId,
        phone,
    }: {
        sessionId: string,
        phone: string,
    }): CancelablePromise<ClientSearchResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/search-by-phone',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'phone': phone,
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
     * Завершує пошук клієнта
     * @returns any OK
     * @throws ApiError
     */
    public static stage1CompleteClientSearch({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/complete',
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
     * Очищує результати пошуку
     * @returns any OK
     * @throws ApiError
     */
    public static stage1ClearClientSearch({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/clear',
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
     * Ініціалізує новий контекст пошуку клієнтів
     * @returns string OK
     * @throws ApiError
     */
    public static stage1InitializeClientSearch(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage1/client-search/initialize',
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
     * Отримує поточний стан форми
     * @returns string OK
     * @throws ApiError
     */
    public static stage1GetClientFormState({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<'INIT' | 'FILLING_BASIC_INFO' | 'FILLING_CONTACT_INFO' | 'VALIDATING' | 'CHECKING_DUPLICATES' | 'DUPLICATES_FOUND' | 'SAVING' | 'COMPLETED' | 'ERROR' | 'CANCELLED'> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}/state',
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
     * Отримує поточний стан пошуку
     * @returns string OK
     * @throws ApiError
     */
    public static stage1GetClientSearchState({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<'INIT' | 'READY_TO_SEARCH' | 'SEARCHING' | 'RESULTS_FOUND' | 'RESULTS_DISPLAYED' | 'NO_RESULTS' | 'CLIENT_SELECTED' | 'CREATE_NEW_CLIENT_MODE' | 'COMPLETED' | 'SEARCH_ERROR' | 'CANCELLED'> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/state',
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
     * Отримує обраного клієнта
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static stage1GetSelectedClient({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}/selected-client',
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
     * Скасовує створення клієнта
     * @returns any OK
     * @throws ApiError
     */
    public static stage1CancelClientCreation({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage1/new-client/session/{sessionId}',
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
     * Скасовує пошук клієнта
     * @returns any OK
     * @throws ApiError
     */
    public static stage1CancelClientSearch({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage1/client-search/session/{sessionId}',
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
