/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PhotoDocumentationDTO } from './PhotoDocumentationDTO';
export type SubstepResultDTO = {
    sessionId?: string;
    currentState?: SubstepResultDTO.currentState;
    previousState?: SubstepResultDTO.previousState;
    success?: boolean;
    message?: string;
    details?: string;
    data?: PhotoDocumentationDTO;
    availableEvents?: Array<'INITIALIZE' | 'START_UPLOAD' | 'UPLOAD_PHOTO' | 'PROCESS_PHOTOS' | 'PROCESSING_COMPLETED' | 'REVIEW_PHOTOS' | 'DELETE_PHOTO' | 'COMPLETE_DOCUMENTATION' | 'EDIT_PHOTOS' | 'HANDLE_ERROR' | 'RESET_AFTER_ERROR'>;
    validationErrors?: Array<string>;
    timestamp?: string;
};
export namespace SubstepResultDTO {
    export enum currentState {
        INITIAL = 'INITIAL',
        UPLOADING_PHOTOS = 'UPLOADING_PHOTOS',
        PROCESSING_PHOTOS = 'PROCESSING_PHOTOS',
        REVIEWING_PHOTOS = 'REVIEWING_PHOTOS',
        COMPLETED = 'COMPLETED',
        ERROR = 'ERROR',
    }
    export enum previousState {
        INITIAL = 'INITIAL',
        UPLOADING_PHOTOS = 'UPLOADING_PHOTOS',
        PROCESSING_PHOTOS = 'PROCESSING_PHOTOS',
        REVIEWING_PHOTOS = 'REVIEWING_PHOTOS',
        COMPLETED = 'COMPLETED',
        ERROR = 'ERROR',
    }
}

