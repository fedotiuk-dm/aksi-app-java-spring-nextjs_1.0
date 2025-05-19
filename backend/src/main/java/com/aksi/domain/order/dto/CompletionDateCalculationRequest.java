package com.aksi.domain.order.dto;

import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.model.ExpediteType;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Запит на розрахунок очікуваної дати завершення замовлення
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompletionDateCalculationRequest {

    /**
     * Список ID категорій послуг у замовленні
     */
    @NotEmpty(message = "Список категорій послуг не може бути порожнім")
    private List<UUID> serviceCategoryIds;

    /**
     * Тип термінового виконання
     */
    @NotNull(message = "Тип термінового виконання обов'язковий")
    private ExpediteType expediteType;
}
