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
        availableBranches: {
            type: 'array',
            contains: {
                type: 'BranchLocationDTO',
            },
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
        allBranches: {
            type: 'array',
            contains: {
                type: 'BranchLocationDTO',
            },
        },
        complete: {
            type: 'boolean',
        },
        uniqueTagValid: {
            type: 'boolean',
        },
        receiptNumberValid: {
            type: 'boolean',
        },
        branchesCount: {
            type: 'number',
            format: 'int32',
        },
    },
} as const;
