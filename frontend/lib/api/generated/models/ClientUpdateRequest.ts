/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClientUpdateRequest = {
    address?: string;
    birthDate?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    loyaltyLevel?: ClientUpdateRequest.loyaltyLevel;
    loyaltyPoints?: number;
    notes?: string;
    phone?: string;
    source?: ClientUpdateRequest.source;
    status?: ClientUpdateRequest.status;
    tags?: Array<string>;
};
export namespace ClientUpdateRequest {
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

