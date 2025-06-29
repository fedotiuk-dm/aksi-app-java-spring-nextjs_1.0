/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemPhotoDTO } from './OrderItemPhotoDTO';
import type { PriceModifierDTO } from './PriceModifierDTO';
/**
 * Детальна інформація про предмет замовлення з розрахунком вартості
 */
export type OrderItemDetailedDTO = {
    /**
     * ID предмета замовлення
     */
    id?: string;
    /**
     * Найменування предмета
     */
    name?: string;
    /**
     * Категорія послуги
     */
    category?: string;
    /**
     * Кількість
     */
    quantity?: number;
    /**
     * Одиниця виміру
     */
    unitOfMeasure?: string;
    /**
     * Матеріал предмета
     */
    material?: string;
    /**
     * Колір предмета
     */
    color?: string;
    /**
     * Наповнювач предмета
     */
    filler?: string;
    /**
     * Прапорець, що вказує, чи є наповнювач збитим
     */
    fillerClumped?: boolean;
    /**
     * Ступінь зносу (у відсотках)
     */
    wearPercentage?: number;
    /**
     * Список виявлених плям на предметі
     */
    stains?: Array<string>;
    /**
     * Список виявлених дефектів та ризиків
     */
    defects?: Array<string>;
    /**
     * Примітки щодо дефектів
     */
    defectNotes?: string;
    /**
     * Базова ціна предмета
     */
    basePrice?: number;
    /**
     * Список застосованих модифікаторів ціни
     */
    priceModifiers?: Array<PriceModifierDTO>;
    /**
     * Фінальна ціна предмета
     */
    finalPrice?: number;
    /**
     * Фотографії предмета
     */
    photos?: Array<OrderItemPhotoDTO>;
};

