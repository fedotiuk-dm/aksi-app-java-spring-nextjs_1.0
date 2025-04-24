/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColorDto } from '../models/ColorDto';
import type { FillingDto } from '../models/FillingDto';
import type { MaterialDto } from '../models/MaterialDto';
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
     * Перевірка необхідності наповнювача для категорії за кодом
     * Перевіряє, чи потрібен наповнювач для вказаної категорії за її кодом
     * @returns boolean Успішна перевірка
     * @throws ApiError
     */
    public static doesCategoryNeedFillingByCode({
        categoryCode,
    }: {
        /**
         * Код категорії
         */
        categoryCode: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-attributes/filling-required/category/code/{categoryCode}',
            path: {
                'categoryCode': categoryCode,
            },
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
     * Перевірка необхідності наповнювача для категорії
     * Перевіряє, чи потрібен наповнювач для вказаної категорії
     * @returns boolean Успішна перевірка
     * @throws ApiError
     */
    public static doesCategoryNeedFilling({
        categoryId,
    }: {
        /**
         * ID категорії
         */
        categoryId: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-attributes/filling-required/category/{categoryId}',
            path: {
                'categoryId': categoryId,
            },
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
     * Отримання всіх наповнювачів
     * Повертає список усіх доступних наповнювачів
     * @returns FillingDto Успішне отримання списку наповнювачів
     * @throws ApiError
     */
    public static getAllFillings(): CancelablePromise<FillingDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-attributes/fillings',
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
     * Отримання матеріалів для категорії за кодом
     * Повертає список матеріалів, доступних для вказаної категорії за її кодом
     * @returns MaterialDto Успішне отримання списку матеріалів
     * @throws ApiError
     */
    public static getMaterialsByCategoryCode({
        categoryCode,
    }: {
        /**
         * Код категорії
         */
        categoryCode: string,
    }): CancelablePromise<MaterialDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-attributes/materials/category/code/{categoryCode}',
            path: {
                'categoryCode': categoryCode,
            },
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
     * Отримання матеріалів для категорії
     * Повертає список матеріалів, доступних для вказаної категорії
     * @returns MaterialDto Успішне отримання списку матеріалів
     * @throws ApiError
     */
    public static getMaterialsByCategory({
        categoryId,
    }: {
        /**
         * ID категорії
         */
        categoryId: string,
    }): CancelablePromise<MaterialDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item-attributes/materials/category/{categoryId}',
            path: {
                'categoryId': categoryId,
            },
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
