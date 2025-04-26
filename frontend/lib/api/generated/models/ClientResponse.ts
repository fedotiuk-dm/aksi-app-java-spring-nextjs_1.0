/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClientResponse = {
    address?: string;
    communicationChannels?: Array<'PHONE' | 'SMS' | 'VIBER'>;
    createdAt?: string;
    email?: string;
    firstName?: string;
    fullName?: string;
    id?: string;
    lastName?: string;
    phone?: string;
    source?: ClientResponse.source;
    sourceDetails?: string;
    updatedAt?: string;
};
export namespace ClientResponse {
    export enum source {
        INSTAGRAM = 'INSTAGRAM',
        GOOGLE = 'GOOGLE',
        RECOMMENDATIONS = 'RECOMMENDATIONS',
        OTHER = 'OTHER',
    }
}

