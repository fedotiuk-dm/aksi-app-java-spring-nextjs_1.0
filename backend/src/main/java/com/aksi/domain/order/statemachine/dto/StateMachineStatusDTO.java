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
 * DTO для статусу модульної State Machine.
 * Містить детальну інформацію про поточний стан та можливі переходи.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Статус модульної State Machine для Order Wizard")
public class StateMachineStatusDTO {

    @Schema(description = "Унікальний ідентифікатор wizard", example = "wizard-123e4567-e89b-12d3-a456-426614174000")
    private String wizardId;

    @Schema(description = "Поточний стан State Machine", example = "CLIENT_SELECTION")
    private OrderState currentState;

    @Schema(description = "Попередній стан", example = "INITIAL")
    private OrderState previousState;

    @Schema(description = "Час останнього переходу")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastTransitionTime;

    @Schema(description = "Чи State Machine активна", example = "true")
    private Boolean isActive;

    @Schema(description = "Чи State Machine в стані помилки", example = "false")
    private Boolean hasError;

    @Schema(description = "Повідомлення про помилку (якщо є)")
    private String errorMessage;

    @Schema(description = "Доступні події для переходу з поточного стану")
    private List<OrderEvent> availableEvents;

    @Schema(description = "Інформація про поточний етап")
    private StageInfo currentStageInfo;

    @Schema(description = "Конфігурація активних етапів")
    private List<StageConfigInfo> stageConfigurations;

    @Schema(description = "Статистика переходів")
    private TransitionStatistics transitionStats;

    @Schema(description = "Контекст збережений в State Machine")
    private Map<String, Object> machineContext;

    /**
     * Інформація про етап wizard.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Інформація про етап wizard")
    public static class StageInfo {

        @Schema(description = "Номер етапу", example = "1")
        private Integer stageNumber;

        @Schema(description = "Назва етапу", example = "Вибір клієнта та базова інформація")
        private String stageName;

        @Schema(description = "Опис етапу")
        private String stageDescription;

        @Schema(description = "Стани, що належать до цього етапу")
        private List<OrderState> stageStates;

        @Schema(description = "Чи етап завершено", example = "false")
        private Boolean isCompleted;

        @Schema(description = "Відсоток завершення етапу", example = "75")
        private Integer completionPercentage;
    }

    /**
     * Конфігураційна інформація про етап.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Конфігураційна інформація про етап")
    public static class StageConfigInfo {

        @Schema(description = "Номер етапу", example = "1")
        private Integer stageNumber;

        @Schema(description = "Назва конфігуратора", example = "Stage1TransitionConfigurer")
        private String configurerName;

        @Schema(description = "Кількість налаштованих переходів", example = "5")
        private Integer transitionsCount;

        @Schema(description = "Чи етап активний", example = "true")
        private Boolean isActive;

        @Schema(description = "Час останньої активності")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime lastActivityTime;
    }

    /**
     * Статистика переходів State Machine.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Статистика переходів State Machine")
    public static class TransitionStatistics {

        @Schema(description = "Загальна кількість переходів", example = "15")
        private Integer totalTransitions;

        @Schema(description = "Кількість успішних переходів", example = "14")
        private Integer successfulTransitions;

        @Schema(description = "Кількість неуспішних переходів", example = "1")
        private Integer failedTransitions;

        @Schema(description = "Середній час переходу в мілісекундах", example = "150")
        private Long averageTransitionTime;

        @Schema(description = "Час роботи State Machine в секундах", example = "3600")
        private Long totalRuntimeSeconds;

        @Schema(description = "Остання помилка переходу")
        private String lastTransitionError;
    }

    /**
     * Перевіряє, чи може State Machine обробити подію.
     */
    public boolean canHandleEvent(OrderEvent event) {
        return availableEvents != null && availableEvents.contains(event);
    }

    /**
     * Перевіряє, чи State Machine готова для завершення.
     */
    public boolean isReadyForCompletion() {
        return Boolean.TRUE.equals(isActive) &&
               !Boolean.TRUE.equals(hasError) &&
               currentStageInfo != null &&
               Boolean.TRUE.equals(currentStageInfo.isCompleted);
    }
}
