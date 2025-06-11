/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdditionalRequirementsRequest } from './AdditionalRequirementsRequest';
import type { AdditionalRequirementsResponse } from './AdditionalRequirementsResponse';
export type AdditionalInfoDTO = {
    sessionId?: string;
    orderId?: string;
    additionalInfoRequest?: AdditionalRequirementsRequest;
    additionalInfoResponse?: AdditionalRequirementsResponse;
    hasAdditionalRequirements?: boolean;
    hasCustomerNotes?: boolean;
    isValid?: boolean;
    validationMessage?: string;
    lastUpdated?: string;
    customerNotes?: string;
    additionalRequirements?: string;
    readyForCompletion?: boolean;
    additionalInfoComplete?: boolean;
};

