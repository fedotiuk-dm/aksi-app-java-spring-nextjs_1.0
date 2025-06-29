/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BranchLocationDTO } from './BranchLocationDTO';
export type BasicOrderInfoDTO = {
    receiptNumber?: string;
    uniqueTag?: string;
    selectedBranch?: BranchLocationDTO;
    availableBranches?: Array<BranchLocationDTO>;
    selectedBranchId?: string;
    creationDate?: string;
    receiptNumberGenerated?: boolean;
    uniqueTagEntered?: boolean;
    branchSelected?: boolean;
    creationDateSet?: boolean;
    allBranches?: Array<BranchLocationDTO>;
    complete?: boolean;
    uniqueTagValid?: boolean;
    receiptNumberValid?: boolean;
    branchesCount?: number;
};

