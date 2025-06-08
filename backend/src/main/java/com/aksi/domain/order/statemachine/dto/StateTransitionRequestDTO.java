package com.aksi.domain.order.statemachine.dto;

import java.util.Map;

import com.aksi.domain.order.statemachine.OrderEvent;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для запиту переходу в State Machine.
 * Використовується для керування переходами між станами wizard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запит на перехід між станами Order Wizard")
public class StateTransitionRequestDTO {

    @NotBlank(message = "wizardId не може бути пустим")
    @Schema(description = "Унікальний ідентифікатор wizard сесії", example = "wizard-123e4567-e89b-12d3-a456-426614174000")
    private String wizardId;

    @NotNull(message = "event не може бути null")
    @Schema(description = "Подія для переходу", example = "START_WIZARD")
    private OrderEvent event;

    @Schema(description = "Додаткові дані для переходу (ключ-значення)")
    private Map<String, Object> eventData;

    @Schema(description = "Валідувати перехід перед виконанням", example = "true")
    @Builder.Default
    private Boolean validateTransition = true;

    @Schema(description = "Зберегти стан після переходу", example = "true")
    @Builder.Default
    private Boolean persistState = true;
}
