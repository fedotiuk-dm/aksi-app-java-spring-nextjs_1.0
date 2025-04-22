/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MaterialWarningDto = {
    material?: string;
    requiresConfirmation?: boolean;
    severity?: string;
    stainType?: MaterialWarningDto.stainType;
    warningMessage?: string;
    warningType?: string;
};
export namespace MaterialWarningDto {
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

