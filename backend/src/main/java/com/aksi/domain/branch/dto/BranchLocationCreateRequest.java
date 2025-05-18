package com.aksi.domain.branch.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

/**
 * Запит на створення нового пункту прийому замовлень.
 */
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class BranchLocationCreateRequest extends BaseBranchLocationRequest {

    /**
     * Конструктор зі значенням за замовчуванням для поля active.
     * Завжди створює активну філію.
     */
    public BranchLocationCreateRequest() {
        super();
        setActive(true); // Значення за замовчуванням
    }
}
