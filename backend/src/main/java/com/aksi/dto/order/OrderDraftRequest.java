package com.aksi.dto.order;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO для запиту на збереження чернетки замовлення.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDraftRequest {
    /**
     * ID клієнта для якого створюється чернетка.
     */
    private UUID clientId;
    
    /**
     * Дані чернетки у форматі JSON.
     */
    @NotNull(message = "Дані чернетки обов'язкові")
    private String draftData;
    
    /**
     * Назва або опис чернетки.
     */
    private String draftName;
}
