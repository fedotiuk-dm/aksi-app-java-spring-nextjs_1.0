/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressDTO } from './AddressDTO';
import type { ClientCategoryDTO } from './ClientCategoryDTO';
import type { ClientPreferenceDTO } from './ClientPreferenceDTO';
import type { OrderSummaryDTO } from './OrderSummaryDTO';
export type ClientResponse = {
    id?: string;
    lastName?: string;
    firstName?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
    structuredAddress?: AddressDTO;
    communicationChannels?: Array<'PHONE' | 'SMS' | 'VIBER'>;
    source?: ClientResponse.source;
    sourceDetails?: string;
    createdAt?: string;
    updatedAt?: string;
    category?: ClientCategoryDTO;
    preferences?: Array<ClientPreferenceDTO>;
    recentOrders?: Array<OrderSummaryDTO>;
    orderCount?: number;
};
export namespace ClientResponse {
    export enum source {
        INSTAGRAM = 'INSTAGRAM',
        GOOGLE = 'GOOGLE',
        RECOMMENDATION = 'RECOMMENDATION',
        OTHER = 'OTHER',
    }
}

