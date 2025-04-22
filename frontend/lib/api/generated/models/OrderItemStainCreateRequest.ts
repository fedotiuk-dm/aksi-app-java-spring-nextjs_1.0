/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderItemStainCreateRequest = {
    description?: string;
    type: OrderItemStainCreateRequest.type;
};
export namespace OrderItemStainCreateRequest {
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

