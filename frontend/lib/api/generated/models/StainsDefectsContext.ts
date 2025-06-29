/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StainsDefectsDTO } from './StainsDefectsDTO';
export type StainsDefectsContext = {
    currentState?: StainsDefectsContext.currentState;
    data?: StainsDefectsDTO;
    errorMessage?: string;
};
export namespace StainsDefectsContext {
    export enum currentState {
        NOT_STARTED = 'NOT_STARTED',
        SELECTING_STAINS = 'SELECTING_STAINS',
        SELECTING_DEFECTS = 'SELECTING_DEFECTS',
        ENTERING_NOTES = 'ENTERING_NOTES',
        VALIDATING_DATA = 'VALIDATING_DATA',
        COMPLETED = 'COMPLETED',
        ERROR = 'ERROR',
    }
}

