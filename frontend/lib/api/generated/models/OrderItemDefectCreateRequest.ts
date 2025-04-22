/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderItemDefectCreateRequest = {
    description?: string;
    type: OrderItemDefectCreateRequest.type;
};
export namespace OrderItemDefectCreateRequest {
    export enum type {
        WORN = 'WORN',
        TORN = 'TORN',
        MISSING_ACCESSORIES = 'MISSING_ACCESSORIES',
        DAMAGED_ACCESSORIES = 'DAMAGED_ACCESSORIES',
        COLOR_CHANGE_RISK = 'COLOR_CHANGE_RISK',
        DEFORMATION_RISK = 'DEFORMATION_RISK',
        OTHER = 'OTHER',
    }
}

