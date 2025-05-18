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
     * Базова ціна предмета
     */
    basePrice?: number;
    /**
     * Категорія послуги
     */
    category?: string;
    /**
     * Колір предмета
     */
    color?: string;
    /**
     * Примітки щодо дефектів
     */
    defectNotes?: string;
    /**
     * Список виявлених дефектів та ризиків
     */
    defects?: Array<string>;
    /**
     * Наповнювач предмета
     */
    filler?: string;
    /**
     * Прапорець, що вказує, чи є наповнювач збитим
     */
    fillerClumped?: boolean;
    /**
     * Фінальна ціна предмета
     */
    finalPrice?: number;
    /**
     * ID предмета замовлення
     */
    id?: string;
    /**
     * Матеріал предмета
     */
    material?: string;
    /**
     * Найменування предмета
     */
    name?: string;
    /**
     * Фотографії предмета
     */
    photos?: Array<OrderItemPhotoDTO>;
    /**
     * Список застосованих модифікаторів ціни
     */
    priceModifiers?: Array<PriceModifierDTO>;
    /**
     * Кількість
     */
    quantity?: number;
    /**
     * Список виявлених плям на предметі
     */
    stains?: Array<string>;
    /**
     * Одиниця виміру
     */
    unitOfMeasure?: string;
    /**
     * Ступінь зносу (у відсотках)
     */
    wearPercentage?: number;
};

