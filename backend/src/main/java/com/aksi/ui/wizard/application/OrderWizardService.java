package com.aksi.ui.wizard.application;

import java.util.UUID;
import java.util.function.Consumer;

import org.springframework.stereotype.Service;

import com.aksi.ui.wizard.domain.OrderWizardState;
import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.events.OrderWizardEvents;

import lombok.extern.slf4j.Slf4j;

/**
 * Application service для координації Order Wizard.
 * Управляє станом wizard'а та координує взаємодію між етапами.
 */
@Service
@Slf4j
public class OrderWizardService {

    // Event handler для координації з UI
    private Consumer<OrderWizardEvents> eventHandler;

    /**
     * Встановлення event handler для координації з UI.
     */
    public void setEventHandler(Consumer<OrderWizardEvents> eventHandler) {
        this.eventHandler = eventHandler;
        log.debug("Event handler set for OrderWizardService");
    }

    /**
     * Ініціалізація wizard'а.
     */
    public OrderWizardState initializeWizard() {
        try {
            log.info("Initializing Order Wizard");

            var sessionId = UUID.randomUUID().toString();
            var initialState = OrderWizardState.createInitial(sessionId);

            publishEvent(OrderWizardEvents.wizardInitialized(initialState, sessionId));
            publishEvent(OrderWizardEvents.stateUpdated(initialState, "Ініціалізація", -1, 0));
            publishProgressUpdate(initialState);
            publishNavigationUpdate(initialState);

            log.info("Order Wizard initialized with session ID: {}", sessionId);
            return initialState;

        } catch (Exception e) {
            log.error("Error initializing wizard: {}", e.getMessage(), e);
            publishEvent(OrderWizardEvents.error("initializeWizard", e.getMessage(), e, -1, "INIT_ERROR"));
            throw e;
        }
    }

    /**
     * Перехід до наступного етапу.
     */
    public OrderWizardState moveToNextStep(OrderWizardState currentState) {
        try {
            log.info("Moving to next step from step: {}", currentState.getCurrentStep());

            if (!currentState.isCanNavigateNext()) {
                log.warn("Cannot navigate to next step from current step: {}", currentState.getCurrentStep());
                publishEvent(OrderWizardEvents.navigationRequested(
                    OrderWizardEvents.NavigationType.NEXT,
                    currentState.getCurrentStep() + 1,
                    currentState.getCurrentStep(),
                    false
                ));
                return currentState;
            }

            var previousStep = currentState.getCurrentStep();
            var newState = currentState.moveToNextStep();

            publishEvent(OrderWizardEvents.navigationRequested(
                OrderWizardEvents.NavigationType.NEXT,
                newState.getCurrentStep(),
                previousStep,
                true
            ));
            publishEvent(OrderWizardEvents.stateUpdated(newState, "Перехід до наступного етапу", previousStep, newState.getCurrentStep()));
            publishProgressUpdate(newState);
            publishNavigationUpdate(newState);
            publishStepViewRequest(newState, false);

            log.info("Successfully moved to step: {}", newState.getCurrentStep());
            return newState;

        } catch (Exception e) {
            log.error("Error moving to next step: {}", e.getMessage(), e);
            publishEvent(OrderWizardEvents.error("moveToNextStep", e.getMessage(), e, currentState.getCurrentStep(), "NAV_ERROR"));
            return currentState.withError("Помилка переходу до наступного етапу: " + e.getMessage());
        }
    }

    /**
     * Перехід до попереднього етапу.
     */
    public OrderWizardState moveToPreviousStep(OrderWizardState currentState) {
        try {
            log.info("Moving to previous step from step: {}", currentState.getCurrentStep());

            if (!currentState.isCanNavigatePrevious()) {
                log.warn("Cannot navigate to previous step from current step: {}", currentState.getCurrentStep());
                publishEvent(OrderWizardEvents.navigationRequested(
                    OrderWizardEvents.NavigationType.PREVIOUS,
                    currentState.getCurrentStep() - 1,
                    currentState.getCurrentStep(),
                    false
                ));
                return currentState;
            }

            var previousStep = currentState.getCurrentStep();
            var newState = currentState.moveToPreviousStep();

            publishEvent(OrderWizardEvents.navigationRequested(
                OrderWizardEvents.NavigationType.PREVIOUS,
                newState.getCurrentStep(),
                previousStep,
                true
            ));
            publishEvent(OrderWizardEvents.stateUpdated(newState, "Перехід до попереднього етапу", previousStep, newState.getCurrentStep()));
            publishProgressUpdate(newState);
            publishNavigationUpdate(newState);
            publishStepViewRequest(newState, false);

            log.info("Successfully moved to step: {}", newState.getCurrentStep());
            return newState;

        } catch (Exception e) {
            log.error("Error moving to previous step: {}", e.getMessage(), e);
            publishEvent(OrderWizardEvents.error("moveToPreviousStep", e.getMessage(), e, currentState.getCurrentStep(), "NAV_ERROR"));
            return currentState.withError("Помилка переходу до попереднього етапу: " + e.getMessage());
        }
    }

    /**
     * Перехід до конкретного етапу.
     */
    public OrderWizardState moveToStep(OrderWizardState currentState, int targetStep) {
        try {
            log.info("Moving to step: {} from step: {}", targetStep, currentState.getCurrentStep());

            if (!currentState.canNavigateToStep(targetStep)) {
                log.warn("Cannot navigate to step {} from current step: {}", targetStep, currentState.getCurrentStep());
                publishEvent(OrderWizardEvents.navigationRequested(
                    OrderWizardEvents.NavigationType.TO_STEP,
                    targetStep,
                    currentState.getCurrentStep(),
                    false
                ));
                return currentState;
            }

            var previousStep = currentState.getCurrentStep();
            var newState = currentState.moveToStep(targetStep);

            if (newState.hasError()) {
                publishEvent(OrderWizardEvents.error("moveToStep", newState.getErrorMessage(), null, currentState.getCurrentStep(), "NAV_ERROR"));
                return newState;
            }

            publishEvent(OrderWizardEvents.navigationRequested(
                OrderWizardEvents.NavigationType.TO_STEP,
                targetStep,
                previousStep,
                true
            ));
            publishEvent(OrderWizardEvents.stateUpdated(newState, "Перехід до етапу " + (targetStep + 1), previousStep, targetStep));
            publishProgressUpdate(newState);
            publishNavigationUpdate(newState);
            publishStepViewRequest(newState, false);

            log.info("Successfully moved to step: {}", targetStep);
            return newState;

        } catch (Exception e) {
            log.error("Error moving to step {}: {}", targetStep, e.getMessage(), e);
            publishEvent(OrderWizardEvents.error("moveToStep", e.getMessage(), e, currentState.getCurrentStep(), "NAV_ERROR"));
            return currentState.withError("Помилка переходу до етапу: " + e.getMessage());
        }
    }

    /**
     * Завершення етапу з оновленими даними.
     */
    public OrderWizardState completeStep(OrderWizardState currentState, OrderWizardData updatedData) {
        try {
            log.info("Completing step: {} with updated data", currentState.getCurrentStep());

            var stepName = currentState.getCurrentWizardStep().getTitle();
            var newState = currentState.withWizardData(updatedData);

            publishEvent(OrderWizardEvents.stepCompleted(
                currentState.getCurrentStep(),
                stepName,
                updatedData,
                true
            ));
            publishEvent(OrderWizardEvents.dataUpdated(updatedData, currentState.getWizardData(), stepName, currentState.getCurrentStep()));
            publishEvent(OrderWizardEvents.stateUpdated(newState, "Завершення етапу " + stepName, currentState.getCurrentStep(), currentState.getCurrentStep()));

            log.info("Step {} completed successfully", currentState.getCurrentStep());
            return newState;

        } catch (Exception e) {
            log.error("Error completing step {}: {}", currentState.getCurrentStep(), e.getMessage(), e);
            publishEvent(OrderWizardEvents.error("completeStep", e.getMessage(), e, currentState.getCurrentStep(), "STEP_ERROR"));
            return currentState.withError("Помилка завершення етапу: " + e.getMessage());
        }
    }

    /**
     * Запит створення view для поточного етапу.
     */
    public void requestStepView(OrderWizardState currentState, boolean isRecreation) {
        try {
            log.info("Requesting step view for step: {}", currentState.getCurrentStep());

            publishStepViewRequest(currentState, isRecreation);

        } catch (Exception e) {
            log.error("Error requesting step view: {}", e.getMessage(), e);
            publishEvent(OrderWizardEvents.error("requestStepView", e.getMessage(), e, currentState.getCurrentStep(), "VIEW_ERROR"));
        }
    }

    /**
     * Обробка зміни вибраного табу.
     */
    public OrderWizardState handleTabSelection(OrderWizardState currentState, int selectedTabIndex, boolean isUserInitiated) {
        try {
            log.info("Handling tab selection: {} (user initiated: {})", selectedTabIndex, isUserInitiated);

            var previousTab = currentState.getCurrentStep();
            var isAllowed = currentState.canNavigateToStep(selectedTabIndex);

            publishEvent(OrderWizardEvents.tabSelectionChanged(selectedTabIndex, previousTab, isUserInitiated, isAllowed));

            if (isAllowed && selectedTabIndex != currentState.getCurrentStep()) {
                return moveToStep(currentState, selectedTabIndex);
            }

            return currentState;

        } catch (Exception e) {
            log.error("Error handling tab selection: {}", e.getMessage(), e);
            publishEvent(OrderWizardEvents.error("handleTabSelection", e.getMessage(), e, currentState.getCurrentStep(), "TAB_ERROR"));
            return currentState.withError("Помилка переключення табу: " + e.getMessage());
        }
    }

    /**
     * Завершення wizard'а.
     */
    public OrderWizardState completeWizard(OrderWizardState currentState) {
        try {
            log.info("Completing wizard from step: {}", currentState.getCurrentStep());

            var completedState = currentState.complete();

            publishEvent(OrderWizardEvents.wizardCompleted(
                completedState.getWizardData(),
                completedState,
                "Замовлення успішно створено"
            ));
            publishEvent(OrderWizardEvents.stateUpdated(completedState, "Завершення wizard'а", currentState.getCurrentStep(), currentState.getCurrentStep()));
            publishProgressUpdate(completedState);
            publishNavigationUpdate(completedState);

            log.info("Wizard completed successfully");
            return completedState;

        } catch (Exception e) {
            log.error("Error completing wizard: {}", e.getMessage(), e);
            publishEvent(OrderWizardEvents.error("completeWizard", e.getMessage(), e, currentState.getCurrentStep(), "COMPLETION_ERROR"));
            return currentState.withError("Помилка завершення wizard'а: " + e.getMessage());
        }
    }

    /**
     * Скасування wizard'а.
     */
    public void cancelWizard(OrderWizardState currentState, String reason) {
        try {
            log.info("Cancelling wizard from step: {} with reason: {}", currentState.getCurrentStep(), reason);

            publishEvent(OrderWizardEvents.wizardCancelled(currentState.getCurrentStep(), reason, currentState.getWizardData()));
            publishEvent(OrderWizardEvents.stateUpdated(currentState, "Скасування wizard'а", currentState.getCurrentStep(), currentState.getCurrentStep()));

            log.info("Wizard cancelled successfully");

        } catch (Exception e) {
            log.error("Error cancelling wizard: {}", e.getMessage(), e);
            publishEvent(OrderWizardEvents.error("cancelWizard", e.getMessage(), e, currentState.getCurrentStep(), "CANCEL_ERROR"));
        }
    }

    // Приватні допоміжні методи

    private void publishEvent(OrderWizardEvents event) {
        if (eventHandler != null) {
            try {
                eventHandler.accept(event);
            } catch (Exception e) {
                log.error("Error publishing event {}: {}", event.getClass().getSimpleName(), e.getMessage(), e);
            }
        }
    }

    private void publishProgressUpdate(OrderWizardState state) {
        publishEvent(OrderWizardEvents.progressUpdated(
            state.getCurrentStep(),
            OrderWizardState.TOTAL_STEPS,
            state.getProgressPercentage(),
            state.getProgressText(),
            state.getCompletionRatio()
        ));
    }

    private void publishNavigationUpdate(OrderWizardState state) {
        publishEvent(OrderWizardEvents.navigationChanged(
            state.getCurrentStep(),
            state.isCanNavigateNext(),
            state.isCanNavigatePrevious(),
            state.isCanCancel(),
            state.getEnabledSteps()
        ));
    }

    private void publishStepViewRequest(OrderWizardState state, boolean isRecreation) {
        publishEvent(OrderWizardEvents.viewRequested(
            state.getCurrentStep(),
            state.getCurrentWizardStep().getTitle(),
            state.getWizardData(),
            isRecreation
        ));
    }

    private void publishUIStateUpdate(OrderWizardState state) {
        publishEvent(OrderWizardEvents.uiStateChanged(
            false, // isLoading
            state.hasError(),
            state.hasError() ? state.getErrorMessage() : null,
            state.isCompleted(),
            !state.hasError()
        ));
    }
}
