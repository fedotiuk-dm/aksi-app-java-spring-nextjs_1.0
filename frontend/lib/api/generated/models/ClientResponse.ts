/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClientResponse = {
    address?: string;
    birthDate?: string;
    createdAt?: string;
    email?: string;
    firstName?: string;
    fullName?: string;
    id?: string;
    lastName?: string;
    lastOrderDate?: string;
    loyaltyLevel?: ClientResponse.loyaltyLevel;
    loyaltyPoints?: number;
    notes?: string;
    orderCount?: number;
    phone?: string;
    source?: ClientResponse.source;
    status?: ClientResponse.status;
    tags?: Array<string>;
    totalSpent?: number;
    updatedAt?: string;
};
export namespace ClientResponse {
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

