/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderWizardSessionResponse } from './OrderWizardSessionResponse';
/**
 * Дані Order Wizard сесії
 */
export type OrderWizardDataResponse = {
    /**
     * Інформація про сесію
     */
    session?: OrderWizardSessionResponse;
    /**
     * Дані wizard (ключ-значення)
     */
    data?: Record<string, any>;
    /**
     * Можливі дії в поточному стані
     */
    availableActions?: Record<string, boolean>;
    /**
     * Валідаційні помилки (якщо є)
     */
    validationErrors?: Record<string, string>;
};

