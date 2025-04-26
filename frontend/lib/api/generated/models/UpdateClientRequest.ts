/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Дані для оновлення клієнта
 */
export type UpdateClientRequest = {
    address?: string;
    communicationChannels?: Array<'PHONE' | 'SMS' | 'VIBER'>;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
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

