/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AuthResponse = {
    accessToken?: string;
    email?: string;
    expiresIn?: number;
    id?: string;
    name?: string;
    position?: string;
    refreshToken?: string;
    role?: AuthResponse.role;
    username?: string;
};
export namespace AuthResponse {
    export enum role {
        ADMIN = 'ADMIN',
        MANAGER = 'MANAGER',
        STAFF = 'STAFF',
    }
}

