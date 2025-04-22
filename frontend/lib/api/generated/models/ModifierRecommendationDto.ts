/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ModifierRecommendationDto = {
    applyAutomatically?: boolean;
    description?: string;
    modifierName?: string;
    modifierType?: string;
    modifierValue?: number;
    priority?: number;
    stainType?: ModifierRecommendationDto.stainType;
};
export namespace ModifierRecommendationDto {
    export enum stainType {
        GREASE = 'GREASE',
        BLOOD = 'BLOOD',
        PROTEIN = 'PROTEIN',
        WINE = 'WINE',
        COFFEE = 'COFFEE',
        GRASS = 'GRASS',
        INK = 'INK',
        COSMETICS = 'COSMETICS',
        OTHER = 'OTHER',
    }
}

