package com.aksi.ui.wizard.components;

import com.aksi.ui.wizard.domain.OrderWizardState;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.progressbar.ProgressBar;

import lombok.extern.slf4j.Slf4j;

/**
 * Компонент прогресу для відображення поточного стану Order Wizard.
 * Показує прогрес виконання, поточний етап та додаткову інформацію.
 */
@Slf4j
public class WizardProgressComponent extends VerticalLayout {

    // UI компоненти
    private H3 currentStepTitle;
    private Span currentStepDescription;
    private ProgressBar progressBar;
    private Span progressText;
    private Div statusIndicator;
    private HorizontalLayout progressLayout;
    private Div errorMessage;

    // Поточний стан
    private OrderWizardState currentState;

    public WizardProgressComponent() {
        initializeComponent();
        createComponents();
        initializeLayout();
    }

    private void initializeComponent() {
        setPadding(true);
        setSpacing(true);
        setWidthFull();
        addClassName("wizard-progress-component");
        getElement().setAttribute("aria-label", "Прогрес виконання замовлення");
    }

    private void createComponents() {
        // Заголовок поточного етапу
        currentStepTitle = new H3("Завантаження...");
        currentStepTitle.addClassName("wizard-progress-title");
        currentStepTitle.getElement().setAttribute("aria-live", "polite");

        // Опис поточного етапу
        currentStepDescription = new Span("Ініціалізація wizard'а");
        currentStepDescription.addClassName("wizard-progress-description");
        currentStepDescription.getElement().setAttribute("aria-live", "polite");

        // Прогрес-бар
        progressBar = new ProgressBar();
        progressBar.setMin(0);
        progressBar.setMax(100);
        progressBar.setValue(0);
        progressBar.setWidthFull();
        progressBar.addClassName("wizard-progress-bar");

        // Текст прогресу
        progressText = new Span("Етап 0 з 4");
        progressText.addClassName("wizard-progress-text");

        // Індикатор статусу
        statusIndicator = new Div();
        statusIndicator.addClassName("wizard-status-indicator");
        statusIndicator.getElement().setAttribute("aria-live", "polite");

        // Повідомлення про помилку
        errorMessage = new Div();
        errorMessage.addClassName("wizard-error-message");
        errorMessage.setVisible(false);
        errorMessage.getElement().setAttribute("role", "alert");

        // Горизонтальний макет для прогрес-бару та тексту
        progressLayout = new HorizontalLayout(progressBar, progressText);
        progressLayout.setWidthFull();
        progressLayout.setAlignItems(Alignment.CENTER);
        progressLayout.expand(progressBar);
        progressLayout.addClassName("wizard-progress-layout");
    }

    private void initializeLayout() {
        add(currentStepTitle, currentStepDescription, progressLayout, statusIndicator, errorMessage);
    }

    /**
     * Оновлення компонента відповідно до стану wizard'а.
     */
    public void updateFromState(OrderWizardState state) {
        if (state == null) {
            log.warn("Cannot update progress from null state");
            return;
        }

        this.currentState = state;
        updateTitleAndDescription(state);
        updateProgressBar(state);
        updateProgressText(state);
        updateStatusIndicator(state);
        updateErrorDisplay(state);
        updateComponentStyles(state);
    }

    private void updateTitleAndDescription(OrderWizardState state) {
        currentStepTitle.setText(state.getCurrentStepTitle());
        currentStepDescription.setText(state.getCurrentStepDescription());

        log.debug("Updated progress title to: {}", state.getCurrentStepTitle());
    }

    private void updateProgressBar(OrderWizardState state) {
        int percentage = state.getProgressPercentage();
        progressBar.setValue(percentage);

        // Додавання ARIA атрибутів для доступності
        progressBar.getElement().setAttribute("aria-valuenow", String.valueOf(percentage));
        progressBar.getElement().setAttribute("aria-valuetext",
            String.format("Прогрес %d відсотків, етап %d з %d",
                percentage, state.getCurrentStep() + 1, OrderWizardState.TOTAL_STEPS));

        log.debug("Updated progress bar to: {}%", percentage);
    }

    private void updateProgressText(OrderWizardState state) {
        progressText.setText(state.getProgressText());

        // Додавання додаткової інформації для завершених етапів
        if (state.getCompletedStepsCount() > 0) {
            String completedInfo = String.format(" (%d завершено)", state.getCompletedStepsCount());
            progressText.setText(state.getProgressText() + completedInfo);
        }
    }

    private void updateStatusIndicator(OrderWizardState state) {
        // Очищення попередніх статусів
        statusIndicator.removeClassNames("status-loading", "status-error", "status-completed", "status-normal");
        statusIndicator.setText("");

        if (state.hasError()) {
            statusIndicator.addClassName("status-error");
            statusIndicator.setText("❌ Помилка");
        } else if (state.isCompleted()) {
            statusIndicator.addClassName("status-completed");
            statusIndicator.setText("✅ Завершено");
        } else if (state.isInProgress()) {
            statusIndicator.addClassName("status-normal");
            statusIndicator.setText("🔄 В процесі");
        }

        log.debug("Updated status indicator for state: completed={}, error={}",
                 state.isCompleted(), state.hasError());
    }

    private void updateErrorDisplay(OrderWizardState state) {
        if (state.hasError()) {
            errorMessage.setText("Помилка: " + state.getErrorMessage());
            errorMessage.setVisible(true);
            errorMessage.addClassName("error-visible");
        } else {
            errorMessage.setVisible(false);
            errorMessage.removeClassName("error-visible");
        }
    }

    private void updateComponentStyles(OrderWizardState state) {
        // Очищення попередніх стилів
        removeClassNames("wizard-progress-error", "wizard-progress-completed", "wizard-progress-loading");

        if (state.hasError()) {
            addClassName("wizard-progress-error");
        } else if (state.isCompleted()) {
            addClassName("wizard-progress-completed");
        }
    }

    /**
     * Відображення режиму завантаження.
     */
    public void showLoading(boolean loading, String message) {
        if (loading) {
            addClassName("wizard-progress-loading");
            statusIndicator.removeClassNames("status-error", "status-completed", "status-normal");
            statusIndicator.addClassName("status-loading");
            statusIndicator.setText("⏳ " + (message != null ? message : "Завантаження..."));
            progressBar.setIndeterminate(true);
        } else {
            removeClassName("wizard-progress-loading");
            progressBar.setIndeterminate(false);
            if (currentState != null) {
                updateStatusIndicator(currentState);
            }
        }
    }

    /**
     * Виділення поточного етапу.
     */
    public void highlightCurrentStep(boolean highlight) {
        if (highlight) {
            currentStepTitle.addClassName("wizard-progress-title-highlight");
            addClassName("wizard-progress-highlighted");
        } else {
            currentStepTitle.removeClassName("wizard-progress-title-highlight");
            removeClassName("wizard-progress-highlighted");
        }
    }

    /**
     * Відображення спеціального повідомлення.
     */
    public void showMessage(String message, MessageType type) {
        Div messageDiv = new Div();
        messageDiv.setText(message);
        messageDiv.addClassName("wizard-progress-message");

        switch (type) {
            case SUCCESS -> messageDiv.addClassName("message-success");
            case WARNING -> messageDiv.addClassName("message-warning");
            case ERROR -> messageDiv.addClassName("message-error");
            case INFO -> messageDiv.addClassName("message-info");
        }

        // Додавання повідомлення з автоматичним видаленням
        add(messageDiv);
        messageDiv.getElement().executeJs(
            "setTimeout(() => $0.style.opacity = '0', 3000); " +
            "setTimeout(() => $0.remove(), 3500);", messageDiv.getElement());
    }

    /**
     * Анімація переходу до наступного етапу.
     */
    public void animateStepTransition() {
        addClassName("wizard-progress-transitioning");
        getElement().executeJs(
            "setTimeout(() => $0.classList.remove('wizard-progress-transitioning'), 500);",
            getElement());
    }

    /**
     * Встановлення компактного режиму.
     */
    public void setCompactMode(boolean compact) {
        if (compact) {
            addClassName("wizard-progress-compact");
            currentStepDescription.setVisible(false);
            setPadding(false);
        } else {
            removeClassName("wizard-progress-compact");
            currentStepDescription.setVisible(true);
            setPadding(true);
        }
    }

    /**
     * Отримання поточного прогресу у відсотках.
     */
    public int getCurrentProgress() {
        return (int) progressBar.getValue();
    }

    /**
     * Перевірка чи показано помилку.
     */
    public boolean isShowingError() {
        return errorMessage.isVisible();
    }

    /**
     * Очищення помилки.
     */
    public void clearError() {
        errorMessage.setVisible(false);
        errorMessage.removeClassName("error-visible");
        removeClassName("wizard-progress-error");
    }

    /**
     * Enum для типів повідомлень.
     */
    public enum MessageType {
        SUCCESS, WARNING, ERROR, INFO
    }

    // Protected методи для тестування
    protected H3 getCurrentStepTitle() { return currentStepTitle; }
    protected Span getCurrentStepDescription() { return currentStepDescription; }
    protected ProgressBar getProgressBar() { return progressBar; }
    protected Span getProgressText() { return progressText; }
    protected Div getStatusIndicator() { return statusIndicator; }
    protected Div getErrorMessage() { return errorMessage; }
}
