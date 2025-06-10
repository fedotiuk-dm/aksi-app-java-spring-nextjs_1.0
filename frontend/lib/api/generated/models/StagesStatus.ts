/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StageStatusInfo } from './StageStatusInfo';
export type StagesStatus = {
    stages?: Record<string, StageStatusInfo>;
    overall?: string;
    totalReadyStages?: number;
    totalStages?: number;
    totalAdapters?: number;
};

