/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ModifierDTO = {
    category?: string;
    changeDescription?: string;
    description?: string;
    /**
     * Чи є модифікатор знижкою
     */
    discount?: boolean;
    id?: string;
    /**
     * Максимальне значення для модифікаторів з діапазоном
     */
    maxValue?: number;
    /**
     * Мінімальне значення для модифікаторів з діапазоном
     */
    minValue?: number;
    name?: string;
    /**
     * Чи є модифікатор відсотковим
     */
    percentage?: boolean;
    type?: string;
    /**
     * Значення модифікатора (відсоток або фіксована вартість)
     */
    value?: number;
};

