/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FixedModifierQuantityDTO } from './FixedModifierQuantityDTO';
import type { RangeModifierValueDTO } from './RangeModifierValueDTO';
/**
 * Запит на розрахунок ціни предмету з модифікаторами
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
     * Список кодів модифікаторів для застосування
     */
    modifierCodes?: Array<string>;
    /**
     * Список ID модифікаторів для застосування
     */
    modifierIds?: Array<string>;
    /**
     * Значення відсотків для модифікаторів діапазону
     */
    rangeModifierValues?: Array<RangeModifierValueDTO>;
    /**
     * Кількості для модифікаторів з фіксованою ціною
     */
    fixedModifierQuantities?: Array<FixedModifierQuantityDTO>;
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

