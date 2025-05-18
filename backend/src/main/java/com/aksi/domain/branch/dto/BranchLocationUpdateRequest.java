package com.aksi.domain.branch.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Запит на оновлення існуючого пункту прийому замовлень.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class BranchLocationUpdateRequest extends BaseBranchLocationRequest {
    // Наслідує всі поля від базового класу
    // При оновленні філії статус active визначається явно при виклику
}
