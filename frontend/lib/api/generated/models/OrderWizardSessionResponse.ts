/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Інформація про сесію Order Wizard
 */
export type OrderWizardSessionResponse = {
    /**
     * Унікальний ідентифікатор wizard
     */
    wizardId?: string;
    /**
     * Поточний стан wizard
     */
    currentState?: OrderWizardSessionResponse.currentState;
    /**
     * ID клієнта (якщо вибрано)
     */
    clientId?: string;
    /**
     * ID філії
     */
    branchId?: string;
    /**
     * Номер квитанції
     */
    receiptNumber?: string;
    /**
     * Унікальна мітка
     */
    uniqueTag?: string;
    /**
     * Час створення замовлення
     */
    orderCreationTime?: string;
    /**
     * Час створення сесії
     */
    createdAt?: string;
    /**
     * Час останнього оновлення
     */
    updatedAt?: string;
    /**
     * Час закінчення сесії
     */
    expiresAt?: string;
    /**
     * Чи активна сесія
     */
    isActive?: boolean;
    /**
     * Чи закінчилася сесія
     */
    isExpired?: boolean;
};
export namespace OrderWizardSessionResponse {
    /**
     * Поточний стан wizard
     */
    export enum currentState {
        INITIAL = 'INITIAL',
        CLIENT_SELECTION = 'CLIENT_SELECTION',
        ORDER_INITIALIZATION = 'ORDER_INITIALIZATION',
        ITEM_MANAGEMENT = 'ITEM_MANAGEMENT',
        ITEM_WIZARD_ACTIVE = 'ITEM_WIZARD_ACTIVE',
        ITEM_BASIC_INFO = 'ITEM_BASIC_INFO',
        ITEM_CHARACTERISTICS = 'ITEM_CHARACTERISTICS',
        ITEM_DEFECTS_STAINS = 'ITEM_DEFECTS_STAINS',
        ITEM_PRICING = 'ITEM_PRICING',
        ITEM_PHOTOS = 'ITEM_PHOTOS',
        ITEM_COMPLETED = 'ITEM_COMPLETED',
        EXECUTION_PARAMS = 'EXECUTION_PARAMS',
        GLOBAL_DISCOUNTS = 'GLOBAL_DISCOUNTS',
        PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
        ADDITIONAL_INFO = 'ADDITIONAL_INFO',
        ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
        ORDER_REVIEW = 'ORDER_REVIEW',
        LEGAL_ASPECTS = 'LEGAL_ASPECTS',
        RECEIPT_GENERATION = 'RECEIPT_GENERATION',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }
}

