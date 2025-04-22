/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemDefectDto } from './OrderItemDefectDto';
import type { OrderItemModifierDto } from './OrderItemModifierDto';
import type { OrderItemPhotoDto } from './OrderItemPhotoDto';
import type { OrderItemStainDto } from './OrderItemStainDto';
import type { PriceListItemDto } from './PriceListItemDto';
import type { ServiceCategoryDto } from './ServiceCategoryDto';
export type OrderItemDto = {
    basePrice?: number;
    childSized?: boolean;
    clumpedFiller?: boolean;
    color?: string;
    defectNotes?: string;
    defects?: Array<OrderItemDefectDto>;
    filler?: string;
    finalPrice?: number;
    heavilySoiled?: boolean;
    heavilySoiledPercentage?: number;
    id?: string;
    manualCleaning?: boolean;
    material?: string;
    modifiers?: Array<OrderItemModifierDto>;
    name?: string;
    noWarranty?: boolean;
    noWarrantyReason?: string;
    orderId?: string;
    photos?: Array<OrderItemPhotoDto>;
    priceListItem?: PriceListItemDto;
    quantity?: number;
    serviceCategory?: ServiceCategoryDto;
    stains?: Array<OrderItemStainDto>;
    unitOfMeasurement?: string;
    wearPercentage?: number;
};

