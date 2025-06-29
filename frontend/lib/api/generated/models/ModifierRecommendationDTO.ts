/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ModifierRecommendationDTO = {
    modifierId?: string;
    code?: string;
    name?: string;
    reason?: string;
    recommendedValue?: number;
    priority?: ModifierRecommendationDTO.priority;
    riskWarning?: string;
};
export namespace ModifierRecommendationDTO {
    export enum priority {
        HIGH = 'HIGH',
        MEDIUM = 'MEDIUM',
        LOW = 'LOW',
    }
}

