/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemPhotoDTO } from './OrderItemPhotoDTO';
export type PhotoDocumentationDTO = {
    sessionId?: string;
    itemId?: string;
    photos?: Array<OrderItemPhotoDTO>;
    maxPhotosAllowed?: number;
    maxFileSizeMB?: number;
    documentationCompleted?: boolean;
    startTime?: string;
    completionTime?: string;
    notes?: string;
};

