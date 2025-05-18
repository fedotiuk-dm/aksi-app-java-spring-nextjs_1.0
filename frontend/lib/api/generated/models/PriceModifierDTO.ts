/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Модифікатор ціни предмета замовлення
 */
export type PriceModifierDTO = {
    /**
     * Сума модифікатора
     */
    amount?: number;
    /**
     * Опис модифікатора
     */
    description?: string;
    /**
     * Назва модифікатора
     */
    name?: string;
    /**
     * Тип модифікатора
     */
    type?: PriceModifierDTO.type;
    /**
     * Значення модифікатора
     */
    value?: number;
};
export namespace PriceModifierDTO {
    /**
     * Тип модифікатора
     */
    export enum type {
        PERCENTAGE = 'PERCENTAGE',
        FIXED_AMOUNT = 'FIXED_AMOUNT',
        MULTIPLIER = 'MULTIPLIER',
    }
}

