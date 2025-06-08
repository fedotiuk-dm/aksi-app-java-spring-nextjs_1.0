package com.aksi.domain.order.statemachine.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

import lombok.Builder;
import lombok.Data;

/**
 * DTO для передачі комплексної інформації про статус Order Wizard.
 * Об'єднує дані з WizardActionsService, WizardCompletionService, WizardTransitionService.
 */
@Data
@Builder
public class WizardStatusDTO {

    // Поточний стан
    private OrderState currentState;
    private String stateName;
    private int stageNumber;
    private String stageName;

    // Прогрес
    private int overallProgress;
    private boolean canComplete;
    private boolean isStage1Completed;
    private boolean isStage2Completed;
    private boolean isStage3Completed;
    private boolean isStage4Completed;

    // Доступні дії
    private List<String> availableActions;
    private List<OrderEvent> availableEvents;
    private boolean isDataInputRequired;

    // Переходи
    private List<OrderState> possibleTransitions;
    private OrderState nextExpectedState;
    private OrderState previousState;
    private boolean isFinalState;

    // Валідація та блокування
    private Map<String, String> blockingReasons;
    private List<String> missingRequiredData;

    // Метаінформація
    private Integer itemsCount;
    private LocalDateTime lastUpdated;
    private boolean hasUnsavedChanges;

    // Додаткові дані
    private Map<String, Object> wizardData;
}
