/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderDto } from './OrderDto';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
export type PageOrderDto = {
    content?: Array<OrderDto>;
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

