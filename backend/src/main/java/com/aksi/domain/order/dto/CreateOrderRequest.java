package com.aksi.domain.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.model.ExpediteType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Запит на створення нового замовлення.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    private String tagNumber;

    @NotNull(message = "ID клієнта обов'язковий")
    private UUID clientId;

    @Valid
    @Builder.Default
    private List<OrderItemDTO> items = new ArrayList<>();

    private BigDecimal discountAmount;

    private BigDecimal prepaymentAmount;

    @NotNull(message = "ID філії обов'язковий")
    private UUID branchLocationId;

    private LocalDateTime expectedCompletionDate;

    @Size(max = 1000, message = "Примітки клієнта не можуть перевищувати 1000 символів")
    private String customerNotes;

    @Size(max = 1000, message = "Внутрішні примітки не можуть перевищувати 1000 символів")
    private String internalNotes;

    /**
     * Тип термінового виконання.
     */
    @Builder.Default
    private ExpediteType expediteType = ExpediteType.STANDARD;

    private boolean draft;
}
