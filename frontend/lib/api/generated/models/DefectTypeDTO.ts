/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Інформація про тип дефекту
 */
export type DefectTypeDTO = {
    /**
     * Унікальний ідентифікатор
     */
    id?: string;
    /**
     * Код типу для програмного використання
     */
    code?: string;
    /**
     * Назва типу
     */
    name?: string;
    /**
     * Опис типу
     */
    description?: string;
    /**
     * Рівень ризику: LOW, MEDIUM, HIGH
     */
    riskLevel?: DefectTypeDTO.riskLevel;
    /**
     * Чи активний запис
     */
    active?: boolean;
};
export namespace DefectTypeDTO {
    /**
     * Рівень ризику: LOW, MEDIUM, HIGH
     */
    export enum riskLevel {
        LOW = 'LOW',
        MEDIUM = 'MEDIUM',
        HIGH = 'HIGH',
    }
}

