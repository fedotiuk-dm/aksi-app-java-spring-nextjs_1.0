package com.aksi.ui.wizard.events;

import java.time.LocalDateTime;

import com.aksi.ui.wizard.domain.OrderWizardState;
import com.aksi.ui.wizard.dto.OrderWizardData;

/**
 * Sealed interface для всіх подій Order Wizard.
 * Використовує pattern matching для type-safe обробки подій.
 */
public sealed interface OrderWizardEvents
    permits OrderWizardEvents.WizardInitialized,
            OrderWizardEvents.WizardStateUpdated,
            OrderWizardEvents.NavigationRequested,
            OrderWizardEvents.StepCompleted,
            OrderWizardEvents.StepNavigationChanged,
            OrderWizardEvents.StepViewRequested,
            OrderWizardEvents.TabSelectionChanged,
            OrderWizardEvents.WizardDataUpdated,
            OrderWizardEvents.WizardCompleted,
            OrderWizardEvents.WizardCancelled,
            OrderWizardEvents.WizardError,
            OrderWizardEvents.LoadingStarted,
            OrderWizardEvents.LoadingCompleted,
            OrderWizardEvents.ProgressUpdated,
            OrderWizardEvents.ValidationCompleted,
            OrderWizardEvents.UIStateChanged {

    /**
     * Подія ініціалізації wizard'а.
     */
    record WizardInitialized(
        OrderWizardState initialState,
        String sessionId,
        LocalDateTime initTime
    ) implements OrderWizardEvents {}

    /**
     * Подія оновлення стану wizard'а.
     */
    record WizardStateUpdated(
        OrderWizardState wizardState,
        String changeReason,
        int previousStep,
        int currentStep
    ) implements OrderWizardEvents {}

    /**
     * Подія запиту навігації.
     */
    record NavigationRequested(
        NavigationType navigationType,
        int targetStep,
        int currentStep,
        boolean isAllowed
    ) implements OrderWizardEvents {}

    /**
     * Подія завершення етапу.
     */
    record StepCompleted(
        int completedStep,
        String stepName,
        OrderWizardData updatedData,
        boolean canProceedToNext
    ) implements OrderWizardEvents {}

    /**
     * Подія зміни навігаційних можливостей.
     */
    record StepNavigationChanged(
        int currentStep,
        boolean canNavigateNext,
        boolean canNavigatePrevious,
        boolean canCancel,
        java.util.Set<Integer> enabledSteps
    ) implements OrderWizardEvents {}

    /**
     * Подія запиту створення view для етапу.
     */
    record StepViewRequested(
        int stepNumber,
        String stepName,
        OrderWizardData wizardData,
        boolean isRecreation
    ) implements OrderWizardEvents {}

    /**
     * Подія зміни вибраного табу.
     */
    record TabSelectionChanged(
        int selectedTabIndex,
        int previousTabIndex,
        boolean isUserInitiated,
        boolean isAllowed
    ) implements OrderWizardEvents {}

    /**
     * Подія оновлення даних wizard'а.
     */
    record WizardDataUpdated(
        OrderWizardData newData,
        OrderWizardData previousData,
        String updateSource,
        int updatedOnStep
    ) implements OrderWizardEvents {}

    /**
     * Подія завершення wizard'а.
     */
    record WizardCompleted(
        OrderWizardData finalData,
        OrderWizardState finalState,
        LocalDateTime completionTime,
        String completionResult
    ) implements OrderWizardEvents {}

    /**
     * Подія скасування wizard'а.
     */
    record WizardCancelled(
        int cancelledOnStep,
        String cancelReason,
        OrderWizardData dataAtCancellation
    ) implements OrderWizardEvents {}

    /**
     * Подія помилки в wizard'і.
     */
    record WizardError(
        String operation,
        String errorMessage,
        Exception exception,
        int stepNumber,
        String errorCode
    ) implements OrderWizardEvents {}

    /**
     * Подія початку операції.
     */
    record LoadingStarted(
        String operation,
        String description,
        int stepNumber
    ) implements OrderWizardEvents {}

    /**
     * Подія завершення операції.
     */
    record LoadingCompleted(
        String operation,
        boolean success,
        String message,
        int stepNumber
    ) implements OrderWizardEvents {}

    /**
     * Подія оновлення прогресу.
     */
    record ProgressUpdated(
        int currentStep,
        int totalSteps,
        int progressPercentage,
        String progressText,
        double completionRatio
    ) implements OrderWizardEvents {}

    /**
     * Подія завершення валідації.
     */
    record ValidationCompleted(
        int stepNumber,
        boolean isValid,
        java.util.List<String> validationMessages,
        java.util.List<String> warnings
    ) implements OrderWizardEvents {}

    /**
     * Подія зміни UI стану.
     */
    record UIStateChanged(
        boolean isLoading,
        boolean hasError,
        String statusMessage,
        boolean isWizardCompleted,
        boolean tabsEnabled
    ) implements OrderWizardEvents {}

    /**
     * Enum для типів навігації.
     */
    enum NavigationType {
        NEXT("Наступний етап"),
        PREVIOUS("Попередній етап"),
        TO_STEP("Перехід до етапу"),
        CANCEL("Скасування"),
        COMPLETE("Завершення");

        private final String description;

        NavigationType(String description) {
            this.description = description;
        }

        public String getDescription() { return description; }
    }

    // Допоміжні методи для створення подій

    static WizardInitialized wizardInitialized(OrderWizardState state, String sessionId) {
        return new WizardInitialized(state, sessionId, LocalDateTime.now());
    }

    static WizardStateUpdated stateUpdated(OrderWizardState state, String reason, int prevStep, int currStep) {
        return new WizardStateUpdated(state, reason, prevStep, currStep);
    }

    static NavigationRequested navigationRequested(NavigationType type, int target, int current, boolean allowed) {
        return new NavigationRequested(type, target, current, allowed);
    }

    static StepCompleted stepCompleted(int step, String name, OrderWizardData data, boolean canProceed) {
        return new StepCompleted(step, name, data, canProceed);
    }

    static StepNavigationChanged navigationChanged(int step, boolean next, boolean prev, boolean cancel, java.util.Set<Integer> enabled) {
        return new StepNavigationChanged(step, next, prev, cancel, enabled);
    }

    static StepViewRequested viewRequested(int step, String name, OrderWizardData data, boolean recreate) {
        return new StepViewRequested(step, name, data, recreate);
    }

    static TabSelectionChanged tabSelectionChanged(int selected, int previous, boolean userInitiated, boolean allowed) {
        return new TabSelectionChanged(selected, previous, userInitiated, allowed);
    }

    static WizardDataUpdated dataUpdated(OrderWizardData newData, OrderWizardData oldData, String source, int step) {
        return new WizardDataUpdated(newData, oldData, source, step);
    }

    static WizardCompleted wizardCompleted(OrderWizardData data, OrderWizardState state, String result) {
        return new WizardCompleted(data, state, LocalDateTime.now(), result);
    }

    static WizardCancelled wizardCancelled(int step, String reason, OrderWizardData data) {
        return new WizardCancelled(step, reason, data);
    }

    static WizardError error(String operation, String message, Exception ex, int step, String code) {
        return new WizardError(operation, message, ex, step, code);
    }

    static LoadingStarted loadingStarted(String operation, String description, int step) {
        return new LoadingStarted(operation, description, step);
    }

    static LoadingCompleted loadingCompleted(String operation, boolean success, String message, int step) {
        return new LoadingCompleted(operation, success, message, step);
    }

    static ProgressUpdated progressUpdated(int current, int total, int percentage, String text, double ratio) {
        return new ProgressUpdated(current, total, percentage, text, ratio);
    }

    static ValidationCompleted validationCompleted(int step, boolean valid, java.util.List<String> messages, java.util.List<String> warnings) {
        return new ValidationCompleted(step, valid, messages, warnings);
    }

    static UIStateChanged uiStateChanged(boolean loading, boolean error, String status, boolean completed, boolean tabsEnabled) {
        return new UIStateChanged(loading, error, status, completed, tabsEnabled);
    }
}
