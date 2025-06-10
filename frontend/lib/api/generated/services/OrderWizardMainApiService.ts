/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdaptersInfo } from '../models/AdaptersInfo';
import type { CompleteApiMap } from '../models/CompleteApiMap';
import type { HealthStatus } from '../models/HealthStatus';
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
     * Флоу-карта Order Wizard для фронтенду
     * @returns WorkflowMap OK
     * @throws ApiError
     */
    public static getWorkflow(): CancelablePromise<WorkflowMap> {
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
    public static getSystemStats(): CancelablePromise<SystemStats> {
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
    public static getStageStatus({
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
    public static getStageMethods({
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
    public static getStageInfo({
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
    public static getStagesStatus(): CancelablePromise<StagesStatus> {
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
     * Перевірка готовності Order Wizard API
     * @returns HealthStatus OK
     * @throws ApiError
     */
    public static health(): CancelablePromise<HealthStatus> {
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
    public static getCompleteApiMap(): CancelablePromise<CompleteApiMap> {
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
    public static getAdaptersInfo(): CancelablePromise<AdaptersInfo> {
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
