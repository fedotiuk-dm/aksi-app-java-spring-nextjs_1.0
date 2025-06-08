package com.aksi.domain.order.statemachine.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.aksi.domain.order.statemachine.OrderState;
import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді інформації про Order Wizard сесію
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Інформація про сесію Order Wizard")
public class OrderWizardSessionResponse {

    @Schema(description = "Унікальний ідентифікатор wizard", example = "wizard-123e4567-e89b-12d3-a456-426614174000")
    private String wizardId;

    @Schema(description = "Поточний стан wizard", example = "CLIENT_SELECTION")
    private OrderState currentState;

    @Schema(description = "ID клієнта (якщо вибрано)", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID clientId;

    @Schema(description = "ID філії", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID branchId;

    @Schema(description = "Номер квитанції", example = "AKSI-K1-2024120114-1234")
    private String receiptNumber;

    @Schema(description = "Унікальна мітка", example = "AKSI-TAG-001")
    private String uniqueTag;

    @Schema(description = "Час створення замовлення")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime orderCreationTime;

    @Schema(description = "Час створення сесії")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @Schema(description = "Час останнього оновлення")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    @Schema(description = "Час закінчення сесії")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiresAt;

    @Schema(description = "Чи активна сесія", example = "true")
    private Boolean isActive;

    @Schema(description = "Чи закінчилася сесія", example = "false")
    private Boolean isExpired;
}
