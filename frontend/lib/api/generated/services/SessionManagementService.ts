/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemBasicInfoDTO } from '../models/ItemBasicInfoDTO';
import type { ItemManagerDTO } from '../models/ItemManagerDTO';
import type { OrderWizardResponseDTO } from '../models/OrderWizardResponseDTO';
import type { Stage3Context } from '../models/Stage3Context';
import type { SubstepResultDTO } from '../models/SubstepResultDTO';
import type { ValidationResult } from '../models/ValidationResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SessionManagementService {
    /**
     * Закриття сесії
     * @returns any OK
     * @throws ApiError
     */
    public static stage4CloseSession({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/session/{sessionId}/close',
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
     * Ініціалізація Stage4 для замовлення
     * @returns any OK
     * @throws ApiError
     */
    public static stage4InitializeStage({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage4/initialize/{orderId}',
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
     * Створити нову сесію Stage3
     * @returns string OK
     * @throws ApiError
     */
    public static stage3CreateSession({
        requestBody,
    }: {
        requestBody: string,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage3/sessions',
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
     * Ініціалізувати Stage3 для сесії
     * @returns any OK
     * @throws ApiError
     */
    public static stage3InitializeStage({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/initialize',
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
     * Закрити сесію
     * @returns any OK
     * @throws ApiError
     */
    public static stage3CloseSession({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/close',
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
    public static stage2SynchronizeManager({
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
     * Скидання розрахунку
     * @returns SubstepResultDTO OK
     * @throws ApiError
     */
    public static substep4ResetCalculation({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<SubstepResultDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep4/reset/{sessionId}',
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
     * Скасовує підетап 2
     * @returns any OK
     * @throws ApiError
     */
    public static substep2CancelSubstep({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep2/cancel/{sessionId}',
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
     * Скидає сесію до початкового стану
     * @returns any OK
     * @throws ApiError
     */
    public static stage2ResetSession({
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
     * Отримання поточного контексту сесії
     * @returns any OK
     * @throws ApiError
     */
    public static stage4GetSessionContext({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage4/session/{sessionId}',
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
     * Отримання поточного стану Stage4
     * @returns any OK
     * @throws ApiError
     */
    public static stage4GetCurrentState({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage4/session/{sessionId}/state',
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
     * Отримати стан сесії
     * @returns string OK
     * @throws ApiError
     */
    public static stage3GetSessionState({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<'STAGE3_INIT' | 'EXECUTION_PARAMS_INIT' | 'DATE_SELECTION' | 'URGENCY_SELECTION' | 'EXECUTION_PARAMS_COMPLETED' | 'DISCOUNT_CONFIG_INIT' | 'DISCOUNT_TYPE_SELECTION' | 'DISCOUNT_VALIDATION' | 'DISCOUNT_CONFIG_COMPLETED' | 'PAYMENT_CONFIG_INIT' | 'PAYMENT_METHOD_SELECTION' | 'PAYMENT_AMOUNT_CALCULATION' | 'PAYMENT_CONFIG_COMPLETED' | 'ADDITIONAL_INFO_INIT' | 'NOTES_INPUT' | 'REQUIREMENTS_INPUT' | 'ADDITIONAL_INFO_COMPLETED' | 'STAGE3_COMPLETED' | 'STAGE3_ERROR'> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/state',
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
     * Отримати прогрес сесії
     * @returns number OK
     * @throws ApiError
     */
    public static stage3GetSessionProgress({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/progress',
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
     * Отримати контекст сесії
     * @returns Stage3Context OK
     * @throws ApiError
     */
    public static stage3GetSessionContext({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Stage3Context> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage3/sessions/{sessionId}/context',
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
    public static stage2ValidateCurrentState({
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
     * Перевірка існування сесії
     * @returns boolean OK
     * @throws ApiError
     */
    public static substep4SessionExists({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep4/session/{sessionId}/exists',
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
    public static stage2GetCurrentState({
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
    public static stage2GetActiveSessionCount(): CancelablePromise<number> {
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
     * Отримує поточний стан Order Wizard
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardGetCurrentState({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/session/{sessionId}/state',
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
     * Отримання детальної інформації про поточну сесію
     * @returns any OK
     * @throws ApiError
     */
    public static orderWizardGetSessionInfo({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/session/{sessionId}/info',
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
     * Отримує всі можливі переходи з поточного стану
     * @returns any OK
     * @throws ApiError
     */
    public static orderWizardGetAvailableTransitions({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/session/{sessionId}/available-transitions',
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
     * Закриття сесії фотодокументації
     * @returns any OK
     * @throws ApiError
     */
    public static substep5CloseSession({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage2/substep5/{sessionId}',
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
     * Видалення сесії
     * @returns any OK
     * @throws ApiError
     */
    public static substep4RemoveSession({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/order-wizard/stage2/substep4/session/{sessionId}',
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
    /**
     * Завершує сесію та звільняє ресурси
     * @returns any OK
     * @throws ApiError
     */
    public static stage2TerminateSession({
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
