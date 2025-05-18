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
     * Сума до сплати при отриманні
     */
    balanceAmount?: number;
    /**
     * Філія, в якій оформлено замовлення
     */
    branchLocation?: BranchLocationDTO;
    /**
     * Детальна інформація про клієнта
     */
    client?: ClientResponse;
    /**
     * Дата створення замовлення
     */
    createdDate?: string;
    /**
     * Примітки клієнта
     */
    customerNotes?: string;
    /**
     * Сума знижки
     */
    discountAmount?: number;
    /**
     * Відсоток знижки
     */
    discountPercentage?: number;
    /**
     * Тип знижки
     */
    discountType?: string;
    /**
     * Очікувана дата виконання замовлення
     */
    expectedCompletionDate?: string;
    /**
     * Сума надбавки за терміновість
     */
    expediteSurchargeAmount?: number;
    /**
     * Тип термінового виконання
     */
    expediteType?: OrderDetailedSummaryResponse.expediteType;
    /**
     * Фінальна вартість замовлення з урахуванням знижок та надбавок
     */
    finalAmount?: number;
    /**
     * ID замовлення
     */
    id?: string;
    /**
     * Список предметів замовлення з детальними розрахунками
     */
    items?: Array<OrderItemDetailedDTO>;
    /**
     * Сума передоплати
     */
    prepaymentAmount?: number;
    /**
     * Номер квитанції замовлення
     */
    receiptNumber?: string;
    /**
     * Номер мітки замовлення
     */
    tagNumber?: string;
    /**
     * Загальна вартість замовлення до знижок
     */
    totalAmount?: number;
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

