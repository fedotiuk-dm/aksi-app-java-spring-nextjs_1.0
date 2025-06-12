/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdaptersInfo } from '../models/AdaptersInfo';
import type { CompleteApiMap } from '../models/CompleteApiMap';
import type { HealthStatus } from '../models/HealthStatus';
import type { OrderWizardResponseDTO } from '../models/OrderWizardResponseDTO';
import type { StageInfo } from '../models/StageInfo';
import type { StageMethods } from '../models/StageMethods';
import type { StagesStatus } from '../models/StagesStatus';
import type { StageStatus } from '../models/StageStatus';
import type { SystemStats } from '../models/SystemStats';
import type { WorkflowMap } from '../models/WorkflowMap';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderWizardMainApiService {
    /**
     * Запускає новий Order Wizard
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardStart(): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-wizard/start',
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
     * Повернення на попередній етап
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardGoBack({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-wizard/session/{sessionId}/go-back',
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
     * Перехід до Stage4 з Stage3
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardCompleteStage3({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-wizard/session/{sessionId}/complete-stage3',
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
     * Перехід до Stage3 з Stage2
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardCompleteStage2({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-wizard/session/{sessionId}/complete-stage2',
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
     * Перехід до наступного етапу з Stage1 до Stage2
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardCompleteStage1({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-wizard/session/{sessionId}/complete-stage1',
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
     * Завершення Order Wizard
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardCompleteOrder({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-wizard/session/{sessionId}/complete-order',
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
     * Скасування Order Wizard
     * @returns OrderWizardResponseDTO OK
     * @throws ApiError
     */
    public static orderWizardCancelOrder({
        sessionId,
    }: {
        sessionId: string,
    }): CancelablePromise<OrderWizardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order-wizard/session/{sessionId}/cancel',
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
     * Флоу-карта Order Wizard для фронтенду
     * @returns WorkflowMap OK
     * @throws ApiError
     */
    public static orderWizardGetWorkflow(): CancelablePromise<WorkflowMap> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/workflow',
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
     * Загальна статистика системи
     * @returns SystemStats OK
     * @throws ApiError
     */
    public static orderWizardGetSystemStats(): CancelablePromise<SystemStats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/stats',
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
     * Детальний статус конкретного етапу
     * @returns StageStatus OK
     * @throws ApiError
     */
    public static orderWizardGetStageStatus({
        stageNumber,
    }: {
        stageNumber: number,
    }): CancelablePromise<StageStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/stages/{stageNumber}/status',
            path: {
                'stageNumber': stageNumber,
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
     * Документація по методах конкретного етапу
     * @returns StageMethods OK
     * @throws ApiError
     */
    public static orderWizardGetStageMethods({
        stageNumber,
    }: {
        stageNumber: number,
    }): CancelablePromise<StageMethods> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/stages/{stageNumber}/methods',
            path: {
                'stageNumber': stageNumber,
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
     * Детальна інформація про конкретний етап
     * @returns StageInfo OK
     * @throws ApiError
     */
    public static orderWizardGetStageInfo({
        stageNumber,
    }: {
        stageNumber: number,
    }): CancelablePromise<StageInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/stages/{stageNumber}/info',
            path: {
                'stageNumber': stageNumber,
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
     * Статуси готовності всіх етапів
     * @returns StagesStatus OK
     * @throws ApiError
     */
    public static orderWizardGetStagesStatus(): CancelablePromise<StagesStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/stages/status',
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
     * Перевірка готовності Order Wizard API
     * @returns HealthStatus OK
     * @throws ApiError
     */
    public static orderWizardHealth(): CancelablePromise<HealthStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/health',
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
     * Повна мапа всіх доступних API endpoints
     * @returns CompleteApiMap OK
     * @throws ApiError
     */
    public static orderWizardGetCompleteApiMap(): CancelablePromise<CompleteApiMap> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/api-map',
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
     * Повна інформація про всі адаптери
     * @returns AdaptersInfo OK
     * @throws ApiError
     */
    public static orderWizardGetAdaptersInfo(): CancelablePromise<AdaptersInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/order-wizard/adapters',
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
