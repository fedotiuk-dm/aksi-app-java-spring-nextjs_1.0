/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdditionalInfoDTO } from './AdditionalInfoDTO';
import type { DiscountConfigurationDTO } from './DiscountConfigurationDTO';
import type { ExecutionParamsDTO } from './ExecutionParamsDTO';
import type { PaymentConfigurationDTO } from './PaymentConfigurationDTO';
export type Stage3Context = {
    sessionId?: string;
    currentState?: Stage3Context.currentState;
    lastUpdated?: string;
    executionParams?: ExecutionParamsDTO;
    discountConfiguration?: DiscountConfigurationDTO;
    paymentConfiguration?: PaymentConfigurationDTO;
    additionalInfo?: AdditionalInfoDTO;
    lastAction?: string;
    lastError?: string;
    valid?: boolean;
    completedSubstepsCount?: number;
};
export namespace Stage3Context {
    export enum currentState {
        STAGE3_INIT = 'STAGE3_INIT',
        EXECUTION_PARAMS_INIT = 'EXECUTION_PARAMS_INIT',
        DATE_SELECTION = 'DATE_SELECTION',
        URGENCY_SELECTION = 'URGENCY_SELECTION',
        EXECUTION_PARAMS_COMPLETED = 'EXECUTION_PARAMS_COMPLETED',
        DISCOUNT_CONFIG_INIT = 'DISCOUNT_CONFIG_INIT',
        DISCOUNT_TYPE_SELECTION = 'DISCOUNT_TYPE_SELECTION',
        DISCOUNT_VALIDATION = 'DISCOUNT_VALIDATION',
        DISCOUNT_CONFIG_COMPLETED = 'DISCOUNT_CONFIG_COMPLETED',
        PAYMENT_CONFIG_INIT = 'PAYMENT_CONFIG_INIT',
        PAYMENT_METHOD_SELECTION = 'PAYMENT_METHOD_SELECTION',
        PAYMENT_AMOUNT_CALCULATION = 'PAYMENT_AMOUNT_CALCULATION',
        PAYMENT_CONFIG_COMPLETED = 'PAYMENT_CONFIG_COMPLETED',
        ADDITIONAL_INFO_INIT = 'ADDITIONAL_INFO_INIT',
        NOTES_INPUT = 'NOTES_INPUT',
        REQUIREMENTS_INPUT = 'REQUIREMENTS_INPUT',
        ADDITIONAL_INFO_COMPLETED = 'ADDITIONAL_INFO_COMPLETED',
        STAGE3_COMPLETED = 'STAGE3_COMPLETED',
        STAGE3_ERROR = 'STAGE3_ERROR',
    }
}

