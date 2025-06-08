package com.aksi.domain.order.statemachine.dto;

import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді з даними Order Wizard.
 * Оновлено для роботи з модульною архітектурою State Machine.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Дані Order Wizard сесії")
public class OrderWizardDataResponse {

    @Schema(description = "Інформація про сесію wizard")
    private OrderWizardSessionResponse session;

    @Schema(description = "Контекст wizard з усіма даними")
    private WizardContextDTO context;

    @Schema(description = "Статус завершення етапів")
    private StageCompletionStatusDTO completionStatus;

    @Schema(description = "Дані поточного етапу (ключ-значення)")
    private Map<String, Object> currentStageData;

    @Schema(description = "Можливі дії в поточному стані")
    private Map<String, Boolean> availableActions;

    @Schema(description = "Валідаційні помилки (якщо є)")
    private Map<String, String> validationErrors;

    @Schema(description = "Попередження (якщо є)")
    private Map<String, String> warnings;

    @Schema(description = "Чи потребує введення додаткових даних", example = "false")
    private Boolean requiresInput;
}
