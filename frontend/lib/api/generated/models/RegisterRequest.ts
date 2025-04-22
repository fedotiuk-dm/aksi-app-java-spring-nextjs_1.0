/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterRequest = {
    email?: string;
    name?: string;
    password?: string;
    position?: string;
    role?: RegisterRequest.role;
    username?: string;
};
export namespace RegisterRequest {
    export enum role {
        ADMIN = 'ADMIN',
        MANAGER = 'MANAGER',
        STAFF = 'STAFF',
    }
}

