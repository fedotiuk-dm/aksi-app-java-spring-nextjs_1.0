/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClientResponse = {
    id?: string;
    lastName?: string;
    firstName?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
    communicationChannels?: Array<'PHONE' | 'SMS' | 'VIBER'>;
    source?: ClientResponse.source;
    sourceDetails?: string;
    createdAt?: string;
    updatedAt?: string;
};
export namespace ClientResponse {
    export enum source {
        INSTAGRAM = 'INSTAGRAM',
        GOOGLE = 'GOOGLE',
        RECOMMENDATION = 'RECOMMENDATION',
        OTHER = 'OTHER',
    }
}

