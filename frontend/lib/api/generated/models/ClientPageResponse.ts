/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientResponse } from './ClientResponse';
export type ClientPageResponse = {
    content?: Array<ClientResponse>;
    totalElements?: number;
    totalPages?: number;
    pageNumber?: number;
    pageSize?: number;
    hasPrevious?: boolean;
    hasNext?: boolean;
};

