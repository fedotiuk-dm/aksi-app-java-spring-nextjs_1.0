/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemDefectCreateRequest } from './OrderItemDefectCreateRequest';
import type { OrderItemModifierCreateRequest } from './OrderItemModifierCreateRequest';
import type { OrderItemStainCreateRequest } from './OrderItemStainCreateRequest';
export type OrderItemCreateRequest = {
    childSized?: boolean;
    clumpedFiller?: boolean;
    color?: string;
    defectNotes?: string;
    defects?: Array<OrderItemDefectCreateRequest>;
    filler?: string;
    heavilySoiled?: boolean;
    heavilySoiledPercentage?: number;
    manualCleaning?: boolean;
    material?: string;
    modifiers?: Array<OrderItemModifierCreateRequest>;
    name?: string;
    noWarranty?: boolean;
    noWarrantyReason?: string;
    priceListItemId: string;
    quantity: number;
    serviceCategoryId: string;
    stains?: Array<OrderItemStainCreateRequest>;
    unitOfMeasurement?: string;
    wearPercentage?: number;
};

