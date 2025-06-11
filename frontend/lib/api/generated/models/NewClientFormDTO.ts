/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type NewClientFormDTO = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: string;
    communicationChannels?: Array<'PHONE' | 'SMS' | 'VIBER'>;
    informationSource?: NewClientFormDTO.informationSource;
    sourceDetails?: string;
    status?: NewClientFormDTO.status;
    fullName?: string;
    otherInformationSource?: boolean;
};
export namespace NewClientFormDTO {
    export enum informationSource {
        INSTAGRAM = 'INSTAGRAM',
        GOOGLE = 'GOOGLE',
        RECOMMENDATION = 'RECOMMENDATION',
        OTHER = 'OTHER',
    }
    export enum status {
        EMPTY = 'EMPTY',
        BASIC_FILLED = 'BASIC_FILLED',
        DETAILED_FILLED = 'DETAILED_FILLED',
        COMMUNICATION_SET = 'COMMUNICATION_SET',
        SOURCE_SET = 'SOURCE_SET',
        READY_FOR_VALIDATION = 'READY_FOR_VALIDATION',
        VALID = 'VALID',
        INVALID = 'INVALID',
    }
}

