/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Інформація про тип плями
 */
export type StainTypeDTO = {
    /**
     * Чи активний запис
     */
    active?: boolean;
    /**
     * Код типу для програмного використання
     */
    code?: string;
    /**
     * Опис типу
     */
    description?: string;
    /**
     * Унікальний ідентифікатор
     */
    id?: string;
    /**
     * Назва типу
     */
    name?: string;
    /**
     * Рівень ризику: LOW, MEDIUM, HIGH
     */
    riskLevel?: StainTypeDTO.riskLevel;
};
export namespace StainTypeDTO {
    /**
     * Рівень ризику: LOW, MEDIUM, HIGH
     */
    export enum riskLevel {
        LOW = 'LOW',
        MEDIUM = 'MEDIUM',
        HIGH = 'HIGH',
    }
}

