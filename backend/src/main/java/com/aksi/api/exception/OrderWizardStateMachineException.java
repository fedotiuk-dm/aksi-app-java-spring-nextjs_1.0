package com.aksi.api.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception для помилок Spring State Machine в Order Wizard.
 *
 * Використовується для:
 * - Помилок переходів між станами
 * - Неправильних подій
 * - Проблем з контекстом стейт машини
 * - Помилок ініціалізації стейт машини
 */
public class OrderWizardStateMachineException extends OrderWizardApiException {

    private final String currentState;
    private final String targetState;
    private final String event;
    private final String stateMachineId;

    public OrderWizardStateMachineException(String message) {
        super(message, HttpStatus.CONFLICT, "STATE_MACHINE_ERROR");
        this.currentState = null;
        this.targetState = null;
        this.event = null;
        this.stateMachineId = null;
    }

    public OrderWizardStateMachineException(String message, String stage, String substep) {
        super(message, HttpStatus.CONFLICT, "STATE_MACHINE_ERROR", stage, substep);
        this.currentState = null;
        this.targetState = null;
        this.event = null;
        this.stateMachineId = null;
    }

    public OrderWizardStateMachineException(String message, String stage, String substep,
                                          String currentState, String targetState, String event) {
        super(message, HttpStatus.CONFLICT, "STATE_MACHINE_ERROR", stage, substep);
        this.currentState = currentState;
        this.targetState = targetState;
        this.event = event;
        this.stateMachineId = null;
    }

    public OrderWizardStateMachineException(String message, String stage, String substep,
                                          String currentState, String targetState, String event,
                                          String stateMachineId) {
        super(message, HttpStatus.CONFLICT, "STATE_MACHINE_ERROR", stage, substep);
        this.currentState = currentState;
        this.targetState = targetState;
        this.event = event;
        this.stateMachineId = stateMachineId;
    }

    public OrderWizardStateMachineException(String message, Throwable cause, String stage, String substep) {
        super(message, cause, HttpStatus.CONFLICT, "STATE_MACHINE_ERROR", stage, substep);
        this.currentState = null;
        this.targetState = null;
        this.event = null;
        this.stateMachineId = null;
    }

    // Factory methods для зручного створення
    public static OrderWizardStateMachineException invalidTransition(String currentState, String event,
                                                                   String stage, String substep) {
        return new OrderWizardStateMachineException(
            String.format("Неможливий перехід зі стану '%s' за подією '%s'", currentState, event),
            stage, substep, currentState, null, event
        );
    }

    public static OrderWizardStateMachineException stateNotFound(String state, String stage, String substep) {
        return new OrderWizardStateMachineException(
            String.format("Стан '%s' не знайдено", state),
            stage, substep, state, null, null
        );
    }

    public static OrderWizardStateMachineException eventNotAllowed(String event, String currentState,
                                                                 String stage, String substep) {
        return new OrderWizardStateMachineException(
            String.format("Подія '%s' не дозволена в стані '%s'", event, currentState),
            stage, substep, currentState, null, event
        );
    }

    public static OrderWizardStateMachineException contextMissing(String stage, String substep) {
        return new OrderWizardStateMachineException(
            "Контекст стейт машини відсутній або пошкоджений",
            stage, substep
        );
    }

    public static OrderWizardStateMachineException initializationFailed(String stage, String substep,
                                                                       Throwable cause) {
        return new OrderWizardStateMachineException(
            "Помилка ініціалізації стейт машини",
            cause, stage, substep
        );
    }

    public static OrderWizardStateMachineException transitionTimeout(String currentState, String targetState,
                                                                   String stage, String substep) {
        return new OrderWizardStateMachineException(
            String.format("Тайм-аут переходу з '%s' до '%s'", currentState, targetState),
            stage, substep, currentState, targetState, null
        );
    }

    public static OrderWizardStateMachineException guardRejection(String event, String currentState,
                                                                String guardName, String stage, String substep) {
        return new OrderWizardStateMachineException(
            String.format("Guard '%s' відхилив перехід за подією '%s' в стані '%s'",
                         guardName, event, currentState),
            stage, substep, currentState, null, event
        );
    }

    public static OrderWizardStateMachineException actionExecutionFailed(String actionName, String currentState,
                                                                       String stage, String substep, Throwable cause) {
        return new OrderWizardStateMachineException(
            String.format("Помилка виконання дії '%s' в стані '%s': %s",
                         actionName, currentState, cause.getMessage()),
            cause, stage, substep
        );
    }

    // Getters
    public String getCurrentState() {
        return currentState;
    }

    public String getTargetState() {
        return targetState;
    }

    public String getEvent() {
        return event;
    }

    public String getStateMachineId() {
        return stateMachineId;
    }

    /**
     * Детальна інформація про стан стейт машини для debuggingі
     */
    public StateMachineDetails getStateMachineDetails() {
        return new StateMachineDetails(currentState, targetState, event, stateMachineId,
                                     getStage(), getSubstep());
    }

    /**
     * Клас для структурованого опису стану стейт машини
     */
    public static class StateMachineDetails {
        private final String currentState;
        private final String targetState;
        private final String event;
        private final String stateMachineId;
        private final String stage;
        private final String substep;

        public StateMachineDetails(String currentState, String targetState, String event,
                                 String stateMachineId, String stage, String substep) {
            this.currentState = currentState;
            this.targetState = targetState;
            this.event = event;
            this.stateMachineId = stateMachineId;
            this.stage = stage;
            this.substep = substep;
        }

        // Getters
        public String getCurrentState() { return currentState; }
        public String getTargetState() { return targetState; }
        public String getEvent() { return event; }
        public String getStateMachineId() { return stateMachineId; }
        public String getStage() { return stage; }
        public String getSubstep() { return substep; }
    }
}
