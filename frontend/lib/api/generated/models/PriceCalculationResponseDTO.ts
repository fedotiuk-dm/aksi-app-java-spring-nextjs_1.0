/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalculationDetailsDTO } from './CalculationDetailsDTO';
/**
 * Результат розрахунку ціни для предмета
 */
export type PriceCalculationResponseDTO = {
    /**
     * Початкова базова ціна за одиницю з прайс-листа
     */
    baseUnitPrice?: number;
    /**
     * Кількість предметів
     */
    quantity?: number;
    /**
     * Сума базових цін за всі предмети без модифікаторів
     */
    baseTotalPrice?: number;
    /**
     * Одиниця виміру
     */
    unitOfMeasure?: PriceCalculationResponseDTO.unitOfMeasure;
    /**
     * Кінцева ціна за одиницю з урахуванням всіх модифікаторів
     */
    finalUnitPrice?: number;
    /**
     * Загальна кінцева ціна за всі предмети з урахуванням всіх модифікаторів
     */
    finalTotalPrice?: number;
    /**
     * Список деталей розрахунку для кожного кроку обчислення
     */
    calculationDetails?: Array<CalculationDetailsDTO>;
};
export namespace PriceCalculationResponseDTO {
    /**
     * Одиниця виміру
     */
    export enum unitOfMeasure {
        _ = 'шт',
        _ = 'кг',
        _ = 'кв.м',
        _ = 'пара',
    }
}

