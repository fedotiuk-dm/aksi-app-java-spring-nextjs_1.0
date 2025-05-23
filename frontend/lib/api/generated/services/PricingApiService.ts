/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DefectTypeDTO } from '../models/DefectTypeDTO';
import type { PriceCalculationRequestDTO } from '../models/PriceCalculationRequestDTO';
import type { PriceCalculationResponseDTO } from '../models/PriceCalculationResponseDTO';
import type { PriceListItemDTO } from '../models/PriceListItemDTO';
import type { PriceModifierDTO } from '../models/PriceModifierDTO';
import type { ServiceCategoryDTO } from '../models/ServiceCategoryDTO';
import type { StainTypeDTO } from '../models/StainTypeDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PricingApiService {
    /**
     * Розрахувати ціну з урахуванням вибраних модифікаторів
     * Детальний розрахунок ціни з урахуванням базової ціни, модифікаторів, знижок та терміновості
     * @returns PriceCalculationResponseDTO Успішний розрахунок ціни
     * @throws ApiError
     */
    public static calculatePrice({
        requestBody,
    }: {
        requestBody: PriceCalculationRequestDTO,
    }): CancelablePromise<PriceCalculationResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pricing/calculation/calculate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Неправильні вхідні дані`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Не знайдено предмет або категорію в прайс-листі`,
                409: `Conflict`,
            },
        });
    }
    /**
     * Отримати елемент прайс-листа за ID
     * Повертає елемент прайс-листа за вказаним ідентифікатором
     * @returns PriceListItemDTO OK
     * @throws ApiError
     */
    public static getItemById({
        itemId,
    }: {
        itemId: string,
    }): CancelablePromise<PriceListItemDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/price-list/item/{itemId}',
            path: {
                'itemId': itemId,
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
     * Отримати всі елементи прайс-листа за кодом категорії
     * Повертає список елементів прайс-листа для вказаної категорії
     * @returns PriceListItemDTO OK
     * @throws ApiError
     */
    public static getItemsByCategoryCode({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Array<PriceListItemDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/price-list/category/{categoryCode}/items',
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
     * Отримати модифікатори для категорії послуг
     * Повертає повні дані про модифікатори для вказаної категорії послуг
     * @returns PriceModifierDTO OK
     * @throws ApiError
     */
    public static getModifiersForServiceCategory({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Array<PriceModifierDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/modifiers/service-category/{categoryCode}',
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
     * Пошук модифікаторів з фільтрацією
     * Повертає список модифікаторів з можливістю фільтрації за назвою, категорією, типом та активністю з пагінацією
     * @returns PriceModifierDTO OK
     * @throws ApiError
     */
    public static searchModifiers({
        query,
        category,
        active,
        page,
        size = 20,
        sortBy = 'name',
        sortDirection = 'ASC',
    }: {
        query?: string,
        category?: 'GENERAL' | 'TEXTILE' | 'LEATHER',
        active?: boolean,
        page?: number,
        size?: number,
        sortBy?: string,
        sortDirection?: string,
    }): CancelablePromise<Array<PriceModifierDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/modifiers/search',
            query: {
                'query': query,
                'category': category,
                'active': active,
                'page': page,
                'size': size,
                'sortBy': sortBy,
                'sortDirection': sortDirection,
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
     * Отримати детальну інформацію про модифікатор
     * Повертає повну інформацію про модифікатор за його кодом
     * @returns PriceModifierDTO OK
     * @throws ApiError
     */
    public static getModifierByCode({
        code,
    }: {
        code: string,
    }): CancelablePromise<PriceModifierDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/modifiers/code/{code}',
            path: {
                'code': code,
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
     * Отримати модифікатори за типом
     * Повертає модифікатори за типом (загальні, текстильні, шкіряні)
     * @returns PriceModifierDTO OK
     * @throws ApiError
     */
    public static getModifiersByCategory({
        category,
    }: {
        category: 'GENERAL' | 'TEXTILE' | 'LEATHER',
    }): CancelablePromise<Array<PriceModifierDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/modifiers/category/{category}',
            path: {
                'category': category,
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
     * Отримати доступні модифікатори для категорії
     * Повертає список кодів доступних модифікаторів для вказаної категорії
     * @returns string OK
     * @throws ApiError
     */
    public static getAvailableModifiersForCategory({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/modifiers/available',
            query: {
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
     * Отримати типи плям
     * Повертає список всіх або тільки активних типів плям з можливістю фільтрації за рівнем ризику
     * @returns StainTypeDTO OK
     * @throws ApiError
     */
    public static getStainTypes({
        activeOnly = true,
        riskLevel,
    }: {
        activeOnly?: boolean,
        riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH',
    }): CancelablePromise<Array<StainTypeDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/issues/stains',
            query: {
                'activeOnly': activeOnly,
                'riskLevel': riskLevel,
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
     * Отримати тип плями за кодом
     * Повертає тип плями за вказаним кодом
     * @returns StainTypeDTO OK
     * @throws ApiError
     */
    public static getStainTypeByCode({
        code,
    }: {
        code: string,
    }): CancelablePromise<StainTypeDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/issues/stains/code/{code}',
            path: {
                'code': code,
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
     * Отримати типи дефектів
     * Повертає список всіх або тільки активних типів дефектів з можливістю фільтрації за рівнем ризику
     * @returns DefectTypeDTO OK
     * @throws ApiError
     */
    public static getDefectTypes({
        activeOnly = true,
        riskLevel,
    }: {
        activeOnly?: boolean,
        riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH',
    }): CancelablePromise<Array<DefectTypeDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/issues/defects',
            query: {
                'activeOnly': activeOnly,
                'riskLevel': riskLevel,
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
     * Отримати тип дефекту за кодом
     * Повертає тип дефекту за вказаним кодом
     * @returns DefectTypeDTO OK
     * @throws ApiError
     */
    public static getDefectTypeByCode({
        code,
    }: {
        code: string,
    }): CancelablePromise<DefectTypeDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/issues/defects/code/{code}',
            path: {
                'code': code,
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
     * Отримати всі категорії послуг
     * Повертає список всіх категорій послуг прайс-листа
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static getAllCategories(): CancelablePromise<Array<ServiceCategoryDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/categories',
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
     * Отримати категорію послуг за ID
     * Повертає категорію послуг за вказаним ідентифікатором
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static getCategoryById({
        id,
    }: {
        id: string,
    }): CancelablePromise<ServiceCategoryDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/categories/{id}',
            path: {
                'id': id,
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
     * Отримати доступні матеріали для категорії
     * Повертає список матеріалів, які доступні для вибраної категорії послуг
     * @returns string OK
     * @throws ApiError
     */
    public static getMaterialsForCategory({
        categoryCode,
    }: {
        categoryCode: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/categories/{categoryCode}/materials',
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
     * Отримати категорію послуг за кодом
     * Повертає категорію послуг за вказаним кодом
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static getCategoryByCode({
        code,
    }: {
        code: string,
    }): CancelablePromise<ServiceCategoryDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/categories/code/{code}',
            path: {
                'code': code,
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
     * Отримати активні категорії послуг
     * Повертає список тільки активних категорій послуг
     * @returns ServiceCategoryDTO OK
     * @throws ApiError
     */
    public static getActiveCategories(): CancelablePromise<Array<ServiceCategoryDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/categories/active',
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
     * Отримати попередження про ризики
     * Повертає список попереджень про ризики для предмета на основі його плям, дефектів, категорії та матеріалу
     * @returns string OK
     * @throws ApiError
     */
    public static getRiskWarnings({
        stains,
        defects,
        categoryCode,
        materialType,
    }: {
        stains?: Array<string>,
        defects?: Array<string>,
        categoryCode?: string,
        materialType?: string,
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/calculation/risk-warnings',
            query: {
                'stains': stains,
                'defects': defects,
                'categoryCode': categoryCode,
                'materialType': materialType,
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
     * Отримати рекомендовані модифікатори на основі плям та дефектів
     * Повертає список рекомендованих модифікаторів для предмета на основі його плям, дефектів, категорії та матеріалу
     * @returns PriceModifierDTO OK
     * @throws ApiError
     */
    public static getRecommendedModifiers({
        stains,
        defects,
        categoryCode,
        materialType,
    }: {
        stains?: Array<string>,
        defects?: Array<string>,
        categoryCode?: string,
        materialType?: string,
    }): CancelablePromise<Array<PriceModifierDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/calculation/recommended-modifiers',
            query: {
                'stains': stains,
                'defects': defects,
                'categoryCode': categoryCode,
                'materialType': materialType,
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
     * Отримати базову ціну для предмету
     * Повертає базову ціну з прайс-листа для вказаної категорії та предмету
     * @returns number Успішно отримано базову ціну
     * @throws ApiError
     */
    public static getBasePrice({
        categoryCode,
        itemName,
        color,
    }: {
        /**
         * Код категорії послуги
         */
        categoryCode: string,
        /**
         * Назва предмету з прайс-листа
         */
        itemName: string,
        /**
         * Колір предмету
         */
        color?: string,
    }): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pricing/calculation/base-price',
            query: {
                'categoryCode': categoryCode,
                'itemName': itemName,
                'color': color,
            },
            errors: {
                400: `Некоректні параметри запиту`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Предмет не знайдено в прайс-листі`,
                409: `Conflict`,
            },
        });
    }
}
