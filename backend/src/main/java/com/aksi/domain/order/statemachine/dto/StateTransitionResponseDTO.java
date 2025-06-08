package com.aksi.domain.order.statemachine.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді на перехід між станами State Machine.
 * Містить інформацію про результат переходу та новий стан wizard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Результат переходу між станами Order Wizard")
public class StateTransitionResponseDTO {

    @Schema(description = "Унікальний ідентифікатор wizard сесії", example = "wizard-123e4567-e89b-12d3-a456-426614174000")
    private String wizardId;

    @Schema(description = "Чи був перехід успішним", example = "true")
    private Boolean success;

    @Schema(description = "Попередній стан", example = "CLIENT_SELECTION")
    private OrderState previousState;

    @Schema(description = "Поточний стан після переходу", example = "ORDER_INITIALIZATION")
    private OrderState currentState;

    @Schema(description = "Подія, яка спричинила перехід", example = "SELECT_CLIENT")
    private OrderEvent triggeredEvent;

    @Schema(description = "Час виконання переходу")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime transitionTime;

    @Schema(description = "Результат виконання дій переходу")
    private Map<String, Object> actionResults;

    @Schema(description = "Доступні дії в новому стані")
    private List<OrderEvent> availableEvents;

    @Schema(description = "Повідомлення про результат переходу")
    private String message;

    @Schema(description = "Помилки, якщо перехід не вдався")
    private List<String> errors;

    @Schema(description = "Попередження, якщо є")
    private List<String> warnings;

    @Schema(description = "Чи потрібне додаткове введення даних", example = "false")
    private Boolean requiresInput;

    @Schema(description = "Метадані про поточний етап")
    private StageMetadata stageMetadata;

    /**
     * Метадані про етап wizard.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Метадані про етап wizard")
    public static class StageMetadata {

        @Schema(description = "Номер етапу", example = "1")
        private Integer stageNumber;

        @Schema(description = "Назва етапу", example = "Вибір клієнта та базова інформація")
        private String stageName;

        @Schema(description = "Опис етапу")
        private String stageDescription;

        @Schema(description = "Відсоток завершення етапу", example = "50")
        private Integer completionPercentage;

        @Schema(description = "Чи етап завершено", example = "false")
        private Boolean isCompleted;
    }
}
