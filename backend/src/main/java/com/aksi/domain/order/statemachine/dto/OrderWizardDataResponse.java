package com.aksi.domain.order.statemachine.dto;

import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді з даними Order Wizard
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Дані Order Wizard сесії")
public class OrderWizardDataResponse {

    @Schema(description = "Інформація про сесію")
    private OrderWizardSessionResponse session;

    @Schema(description = "Дані wizard (ключ-значення)")
    private Map<String, Object> data;

    @Schema(description = "Можливі дії в поточному стані")
    private Map<String, Boolean> availableActions;

    @Schema(description = "Валідаційні помилки (якщо є)")
    private Map<String, String> validationErrors;
}
