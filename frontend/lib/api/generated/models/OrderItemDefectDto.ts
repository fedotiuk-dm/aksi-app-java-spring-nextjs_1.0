/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderItemDefectDto = {
    description?: string;
    id?: string;
    orderItemId?: string;
    type?: OrderItemDefectDto.type;
};
export namespace OrderItemDefectDto {
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

