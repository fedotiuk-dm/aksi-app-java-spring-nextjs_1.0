/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BranchLocationDTO } from './BranchLocationDTO';
import type { ClientResponse } from './ClientResponse';
import type { OrderItemDetailedDTO } from './OrderItemDetailedDTO';
/**
 * Детальний підсумок замовлення для етапу перегляду та підтвердження
 */
export type OrderDetailedSummaryResponse = {
    /**
     * ID замовлення
     */
    id?: string;
    /**
     * Номер квитанції замовлення
     */
    receiptNumber?: string;
    /**
     * Номер мітки замовлення
     */
    tagNumber?: string;
    /**
     * Детальна інформація про клієнта
     */
    client?: ClientResponse;
    /**
     * Філія, в якій оформлено замовлення
     */
    branchLocation?: BranchLocationDTO;
    /**
     * Список предметів замовлення з детальними розрахунками
     */
    items?: Array<OrderItemDetailedDTO>;
    /**
     * Загальна вартість замовлення до знижок
     */
    totalAmount?: number;
    /**
     * Сума знижки
     */
    discountAmount?: number;
    /**
     * Сума надбавки за терміновість
     */
    expediteSurchargeAmount?: number;
    /**
     * Фінальна вартість замовлення з урахуванням знижок та надбавок
     */
    finalAmount?: number;
    /**
     * Сума передоплати
     */
    prepaymentAmount?: number;
    /**
     * Сума до сплати при отриманні
     */
    balanceAmount?: number;
    /**
     * Тип термінового виконання
     */
    expediteType?: OrderDetailedSummaryResponse.expediteType;
    /**
     * Очікувана дата виконання замовлення
     */
    expectedCompletionDate?: string;
    /**
     * Дата створення замовлення
     */
    createdDate?: string;
    /**
     * Примітки клієнта
     */
    customerNotes?: string;
    /**
     * Тип знижки
     */
    discountType?: string;
    /**
     * Відсоток знижки
     */
    discountPercentage?: number;
};
export namespace OrderDetailedSummaryResponse {
    /**
     * Тип термінового виконання
     */
    export enum expediteType {
        STANDARD = 'STANDARD',
        EXPRESS_48H = 'EXPRESS_48H',
        EXPRESS_24H = 'EXPRESS_24H',
    }
}

