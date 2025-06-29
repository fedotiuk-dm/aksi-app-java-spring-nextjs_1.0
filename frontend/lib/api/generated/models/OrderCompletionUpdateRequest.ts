/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderCompletionUpdateRequest = {
    orderId: string;
    expediteType: OrderCompletionUpdateRequest.expediteType;
    expectedCompletionDate: string;
};
export namespace OrderCompletionUpdateRequest {
    export enum expediteType {
        STANDARD = 'STANDARD',
        EXPRESS_48H = 'EXPRESS_48H',
        EXPRESS_24H = 'EXPRESS_24H',
    }
}

