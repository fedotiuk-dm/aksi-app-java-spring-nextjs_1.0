/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientResponse } from './ClientResponse';
import type { ClientSearchCriteriaDTO } from './ClientSearchCriteriaDTO';
export type ClientSearchResultDTO = {
    clients?: Array<ClientResponse>;
    searchCriteria?: ClientSearchCriteriaDTO;
    totalElements?: number;
    totalPages?: number;
    pageNumber?: number;
    pageSize?: number;
    hasPrevious?: boolean;
    hasNext?: boolean;
    searchTimeMs?: number;
    exactSearch?: boolean;
    firstClient?: ClientResponse;
};

