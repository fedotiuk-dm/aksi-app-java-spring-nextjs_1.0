/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemAddRequest } from '../models/OrderItemAddRequest';
import type { StainsDefectsContext } from '../models/StainsDefectsContext';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderWizardStage2Substep3Service {
    /**
     * Обробка вибору плям
     * @returns StainsDefectsContext OK
     * @throws ApiError
     */
    public static substep3ProcessStainSelection({
        sessionId,
        selectedStains,
        otherStains,
    }: {
        sessionId: string,
        selectedStains?: string,
        otherStains?: string,
    }): CancelablePromise<StainsDefectsContext> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep3/stains/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'selectedStains': selectedStains,
                'otherStains': otherStains,
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
     * Обробка додавання приміток про дефекти
     * @returns StainsDefectsContext OK
     * @throws ApiError
     */
    public static substep3ProcessDefectNotes({
        sessionId,
        defectNotes,
    }: {
        sessionId: string,
        defectNotes?: string,
    }): CancelablePromise<StainsDefectsContext> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep3/notes/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'defectNotes': defectNotes,
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
     * Ініціалізація підетапу 3
     * @returns StainsDefectsContext OK
     * @throws ApiError
     */
    public static substep3InitializeSubstep({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: OrderItemAddRequest,
    }): CancelablePromise<StainsDefectsContext> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep3/initialize/{sessionId}',
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
     * Повернення до попереднього стану
     * @returns StainsDefectsContext OK
     * @throws ApiError
     */
    public static substep3GoBack({
        sessionId,
        targetState,
    }: {
        sessionId: string,
        targetState: 'NOT_STARTED' | 'SELECTING_STAINS' | 'SELECTING_DEFECTS' | 'ENTERING_NOTES' | 'VALIDATING_DATA' | 'COMPLETED' | 'ERROR',
    }): CancelablePromise<StainsDefectsContext> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep3/go-back/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'targetState': targetState,
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
     * Обробка вибору дефектів та ризиків
     * @returns StainsDefectsContext OK
     * @throws ApiError
     */
    public static substep3ProcessDefectSelection({
        sessionId,
        selectedDefects,
        noGuaranteeReason,
    }: {
        sessionId: string,
        selectedDefects?: string,
        noGuaranteeReason?: string,
    }): CancelablePromise<StainsDefectsContext> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep3/defects/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'selectedDefects': selectedDefects,
                'noGuaranteeReason': noGuaranteeReason,
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
     * Завершення підетапу 3
     * @returns StainsDefectsContext OK
     * @throws ApiError
     */
    public static substep3CompleteSubstep({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<StainsDefectsContext> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/order-wizard/stage2/substep3/complete/{sessionId}',
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
     * Отримання доступних типів плям
     * @returns string OK
     * @throws ApiError
     */
    public static substep3GetAvailableStainTypes(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep3/stain-types',
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
     * Отримання доступних типів дефектів
     * @returns string OK
     * @throws ApiError
     */
    public static substep3GetAvailableDefectTypes(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep3/defect-types',
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
     * Отримання поточного контексту
     * @returns StainsDefectsContext OK
     * @throws ApiError
     */
    public static substep3GetContext({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<StainsDefectsContext> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/order-wizard/stage2/substep3/context/{sessionId}',
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
