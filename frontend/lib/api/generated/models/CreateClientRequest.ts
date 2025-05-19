/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Дані нового клієнта
 */
export type CreateClientRequest = {
    lastName: string;
    firstName: string;
    phone: string;
    email?: string;
    address?: string;
    communicationChannels?: Array<'PHONE' | 'SMS' | 'VIBER'>;
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

