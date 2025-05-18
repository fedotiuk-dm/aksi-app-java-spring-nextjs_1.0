/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CompletionDateCalculationRequest = {
    expediteType: CompletionDateCalculationRequest.expediteType;
    serviceCategoryIds?: Array<string>;
};
export namespace CompletionDateCalculationRequest {
    export enum expediteType {
        STANDARD = 'STANDARD',
        EXPRESS_48H = 'EXPRESS_48H',
        EXPRESS_24H = 'EXPRESS_24H',
    }
}

