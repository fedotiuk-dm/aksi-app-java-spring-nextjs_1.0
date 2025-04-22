/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderItemStainDto = {
    description?: string;
    id?: string;
    orderItemId?: string;
    type?: OrderItemStainDto.type;
};
export namespace OrderItemStainDto {
    export enum type {
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

