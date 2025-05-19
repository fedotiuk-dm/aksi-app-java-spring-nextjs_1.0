/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FixedModifierQuantity } from './FixedModifierQuantity';
import type { RangeModifierValue } from './RangeModifierValue';
/**
 * Запит на розрахунок ціни для предмета
 */
export type PriceCalculationRequestDTO = {
    /**
     * Код категорії послуги
     */
    categoryCode: string;
    /**
     * Найменування предмету з прайс-листа
     */
    itemName: string;
    /**
     * Колір предмету
     */
    color?: string;
    /**
     * Кількість предметів
     */
    quantity: number;
    /**
     * Список кодів модифікаторів
     */
    modifierCodes?: Array<string>;
    /**
     * Значення для модифікаторів з діапазоном
     */
    rangeModifierValues?: Array<RangeModifierValue>;
    /**
     * Кількості для фіксованих модифікаторів
     */
    fixedModifierQuantities?: Array<FixedModifierQuantity>;
    /**
     * Чи термінове замовлення
     */
    expedited?: boolean;
    /**
     * Відсоток надбавки за терміновість
     */
    expeditePercent?: number;
    /**
     * Відсоток знижки
     */
    discountPercent?: number;
};

