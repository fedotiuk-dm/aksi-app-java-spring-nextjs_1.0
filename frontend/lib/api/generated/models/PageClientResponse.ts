/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientResponse } from './ClientResponse';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
export type PageClientResponse = {
    content?: Array<ClientResponse>;
    empty?: boolean;
    first?: boolean;
    last?: boolean;
    number?: number;
    numberOfElements?: number;
    pageable?: PageableObject;
    size?: number;
    sort?: SortObject;
    totalElements?: number;
    totalPages?: number;
};

