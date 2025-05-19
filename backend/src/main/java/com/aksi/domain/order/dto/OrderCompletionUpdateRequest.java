package com.aksi.domain.order.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.aksi.domain.order.model.ExpediteType;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Запит на оновлення параметрів виконання замовлення.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCompletionUpdateRequest {

    /**
     * ID замовлення.
     */
    @NotNull(message = "ID замовлення обов'язковий")
    private UUID orderId;

    /**
     * Тип термінового виконання.
     */
    @NotNull(message = "Тип термінового виконання обов'язковий")
    private ExpediteType expediteType;

    /**
     * Очікувана дата завершення замовлення.
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @NotNull(message = "Очікувана дата завершення обов'язкова")
    private LocalDateTime expectedCompletionDate;
}
