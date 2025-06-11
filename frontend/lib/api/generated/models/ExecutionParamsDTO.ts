/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompletionDateCalculationRequest } from './CompletionDateCalculationRequest';
import type { CompletionDateResponse } from './CompletionDateResponse';
export type ExecutionParamsDTO = {
    sessionId?: string;
    serviceCategoryIds?: Array<string>;
    completionDateRequest?: CompletionDateCalculationRequest;
    completionDateResponse?: CompletionDateResponse;
    manualExecutionDate?: string;
    useManualDate?: boolean;
    needsRecalculation?: boolean;
    lastUpdated?: string;
    expediteType?: ExecutionParamsDTO.expediteType;
    readyForCompletion?: boolean;
    executionParamsComplete?: boolean;
    effectiveExecutionDate?: string;
};
export namespace ExecutionParamsDTO {
    export enum expediteType {
        STANDARD = 'STANDARD',
        EXPRESS_48H = 'EXPRESS_48H',
        EXPRESS_24H = 'EXPRESS_24H',
    }
}

