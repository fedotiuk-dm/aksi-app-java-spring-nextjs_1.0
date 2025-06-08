package com.aksi.domain.order.statemachine.dto;

import java.util.List;
import java.util.Map;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

import lombok.Builder;
import lombok.Data;

/**
 * DTO для доступних дій та подій в Order Wizard.
 */
@Data
@Builder
public class WizardAvailableActionsDTO {

    /**
     * ID wizard.
     */
    private String wizardId;

    /**
     * Поточний стан wizard.
     */
    private OrderState currentState;

    /**
     * Номер поточного етапу (1-4).
     */
    private Integer currentStageNumber;

    /**
     * Назва поточного етапу.
     */
    private String currentStageName;

    /**
     * Список доступних дій для поточного стану.
     */
    private List<String> availableActions;

    /**
     * Список доступних подій для поточного стану.
     */
    private List<OrderEvent> availableEvents;

    /**
     * Чи потребує поточний стан введення даних.
     */
    private Boolean dataInputRequired;

    /**
     * Можливі переходи з поточного стану.
     */
    private List<OrderState> possibleTransitions;

    /**
     * Наступний очікуваний стан в стандартному потоці.
     */
    private OrderState nextExpectedState;

    /**
     * Попередній стан для можливості повернення.
     */
    private OrderState previousState;

    /**
     * Чи є поточний стан фінальним.
     */
    private Boolean isFinalState;

    /**
     * Додаткова інформація про контекст.
     */
    private Map<String, Object> contextInfo;
}
