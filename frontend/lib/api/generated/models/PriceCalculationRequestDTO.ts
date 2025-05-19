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
     * Колір предмету
     */
    color?: string;
    /**
     * Відсоток знижки
     */
    discountPercent?: number;
    /**
     * Відсоток надбавки за терміновість
     */
    expeditePercent?: number;
    /**
     * Чи термінове замовлення
     */
    expedited?: boolean;
    /**
     * Кількості для фіксованих модифікаторів
     */
    fixedModifierQuantities?: Array<FixedModifierQuantity>;
    /**
     * Найменування предмету з прайс-листа
     */
    itemName: string;
    /**
     * Список кодів модифікаторів
     */
    modifierCodes?: Array<string>;
    /**
     * Кількість предметів
     */
    quantity: number;
    /**
     * Значення для модифікаторів з діапазоном
     */
    rangeModifierValues?: Array<RangeModifierValue>;
};

