/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Дані нового клієнта
 */
export type CreateClientRequest = {
    address?: string;
    communicationChannels?: Array<'PHONE' | 'SMS' | 'VIBER'>;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    source?: CreateClientRequest.source;
    sourceDetails?: string;
};
export namespace CreateClientRequest {
    export enum source {
        INSTAGRAM = 'INSTAGRAM',
        GOOGLE = 'GOOGLE',
        RECOMMENDATION = 'RECOMMENDATION',
        OTHER = 'OTHER',
    }
}

