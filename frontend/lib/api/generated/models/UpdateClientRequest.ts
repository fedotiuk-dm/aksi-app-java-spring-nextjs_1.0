/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Дані для оновлення клієнта
 */
export type UpdateClientRequest = {
    lastName?: string;
    firstName?: string;
    phone?: string;
    email?: string;
    address?: string;
    communicationChannels?: Array<'PHONE' | 'SMS' | 'VIBER'>;
    source?: UpdateClientRequest.source;
    sourceDetails?: string;
};
export namespace UpdateClientRequest {
    export enum source {
        INSTAGRAM = 'INSTAGRAM',
        GOOGLE = 'GOOGLE',
        RECOMMENDATION = 'RECOMMENDATION',
        OTHER = 'OTHER',
    }
}

