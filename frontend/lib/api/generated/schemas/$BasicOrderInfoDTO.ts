/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BasicOrderInfoDTO = {
    properties: {
        receiptNumber: {
            type: 'string',
        },
        uniqueTag: {
            type: 'string',
        },
        selectedBranch: {
            type: 'BranchLocationDTO',
        },
        selectedBranchId: {
            type: 'string',
            format: 'uuid',
        },
        creationDate: {
            type: 'string',
            format: 'date-time',
        },
        receiptNumberGenerated: {
            type: 'boolean',
        },
        uniqueTagEntered: {
            type: 'boolean',
        },
        branchSelected: {
            type: 'boolean',
        },
        creationDateSet: {
            type: 'boolean',
        },
        complete: {
            type: 'boolean',
        },
        receiptNumberValid: {
            type: 'boolean',
        },
        uniqueTagValid: {
            type: 'boolean',
        },
    },
} as const;
