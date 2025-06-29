/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $NewClientFormDTO = {
    properties: {
        firstName: {
            type: 'string',
        },
        lastName: {
            type: 'string',
        },
        phone: {
            type: 'string',
        },
        email: {
            type: 'string',
        },
        address: {
            type: 'string',
        },
        communicationChannels: {
            type: 'array',
            contains: {
                type: 'Enum',
            },
        },
        informationSource: {
            type: 'Enum',
        },
        sourceDetails: {
            type: 'string',
        },
        status: {
            type: 'Enum',
        },
        fullName: {
            type: 'string',
        },
        otherInformationSource: {
            type: 'boolean',
        },
    },
} as const;
