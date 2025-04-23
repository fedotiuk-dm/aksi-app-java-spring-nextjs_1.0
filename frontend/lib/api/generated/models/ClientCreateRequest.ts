/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClientCreateRequest = {
    additionalPhone?: string;
    address?: string;
    birthDate?: string;
    communicationChannels?: Array<'PHONE' | 'SMS' | 'VIBER'>;
    email?: string;
    firstName?: string;
    fullName?: string;
    lastName?: string;
    loyaltyLevel?: ClientCreateRequest.loyaltyLevel;
    notes?: string;
    phone?: string;
    source?: ClientCreateRequest.source;
    sourceDetails?: string;
    status?: ClientCreateRequest.status;
    tags?: Array<string>;
};
export namespace ClientCreateRequest {
    export enum loyaltyLevel {
        STANDARD = 'STANDARD',
        BRONZE = 'BRONZE',
        SILVER = 'SILVER',
        GOLD = 'GOLD',
        PLATINUM = 'PLATINUM',
        VIP = 'VIP',
    }
    export enum source {
        REFERRAL = 'REFERRAL',
        SOCIAL_MEDIA = 'SOCIAL_MEDIA',
        INSTAGRAM = 'INSTAGRAM',
        GOOGLE = 'GOOGLE',
        ADVERTISEMENT = 'ADVERTISEMENT',
        RETURNING = 'RETURNING',
        WALK_IN = 'WALK_IN',
        OTHER = 'OTHER',
    }
    export enum status {
        ACTIVE = 'ACTIVE',
        INACTIVE = 'INACTIVE',
        BLOCKED = 'BLOCKED',
    }
}

