/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColorDto } from '../models/ColorDto';
import type { MeasurementUnitDto } from '../models/MeasurementUnitDto';
import type { WearDegreeDto } from '../models/WearDegreeDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemAttributesService {
    /**
     * @returns ColorDto OK
     * @throws ApiError
     */
    public static getAllColors(): CancelablePromise<Array<ColorDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-attributes/colors',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
            },
        });
    }
    /**
     * @returns MeasurementUnitDto OK
     * @throws ApiError
     */
    public static getAllMeasurementUnits(): CancelablePromise<Array<MeasurementUnitDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-attributes/measurement-units',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
            },
        });
    }
    /**
     * @returns WearDegreeDto OK
     * @throws ApiError
     */
    public static getAllWearDegrees(): CancelablePromise<Array<WearDegreeDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-attributes/wear-degrees',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
            },
        });
    }
}
