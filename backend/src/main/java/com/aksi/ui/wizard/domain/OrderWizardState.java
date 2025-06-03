package com.aksi.ui.wizard.domain;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.aksi.ui.wizard.dto.OrderWizardData;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * Domain model для управління станом Order Wizard.
 * Містить бізнес-логіку навігації між етапами та валідації.
 */
@Data
@Builder(toBuilder = true)
@Slf4j
public class OrderWizardState {

    // Константи бізнес-логіки
    public static final int TOTAL_STEPS = 4;
    public static final int MIN_STEP = 0;
    public static final int MAX_STEP = 3;

    // Основний стан
    private final int currentStep;
    private final WizardStep currentWizardStep;
    private final OrderWizardData wizardData;
    private final Set<Integer> completedSteps;
    private final Set<Integer> enabledSteps;

    // Навігаційний стан
    private final boolean canNavigateNext;
    private final boolean canNavigatePrevious;
    private final boolean canCancel;
    private final boolean isCompleted;
    private final boolean isInProgress;

    // UI стан
    private final String currentStepTitle;
    private final String currentStepDescription;
    private final String progressText;
    private final int progressPercentage;

    // Валідація та помилки
    private final boolean isValid;
    private final List<String> validationMessages;
    private final String errorMessage;

    // Метадані
    private final LocalDateTime createdAt;
    private final LocalDateTime lastModifiedAt;
    private final String sessionId;

    /**
     * Створення початкового стану wizard'а.
     */
    public static OrderWizardState createInitial(String sessionId) {
        var initialData = new OrderWizardData();
        var now = LocalDateTime.now();

        return OrderWizardState.builder()
                .currentStep(MIN_STEP)
                .currentWizardStep(WizardStep.CLIENT_INFO)
                .wizardData(initialData)
                .completedSteps(Set.of())
                .enabledSteps(Set.of(MIN_STEP))
                .canNavigateNext(false)
                .canNavigatePrevious(false)
                .canCancel(true)
                .isCompleted(false)
                .isInProgress(true)
                .currentStepTitle(WizardStep.CLIENT_INFO.getTitle())
                .currentStepDescription(WizardStep.CLIENT_INFO.getDescription())
                .progressText("Етап 1 з 4")
                .progressPercentage(25)
                .isValid(true)
                .validationMessages(List.of())
                .errorMessage(null)
                .createdAt(now)
                .lastModifiedAt(now)
                .sessionId(sessionId)
                .build();
    }

    /**
     * Перехід до наступного етапу.
     */
    public OrderWizardState moveToNextStep() {
        if (!canNavigateNext) {
            log.warn("Cannot navigate to next step from current step: {}", currentStep);
            return this;
        }

        int nextStep = Math.min(currentStep + 1, MAX_STEP);
        var nextWizardStep = WizardStep.fromStepNumber(nextStep);

        // Додаємо поточний етап до завершених
        var newCompletedSteps = new HashSet<>(completedSteps);
        newCompletedSteps.add(currentStep);

        // Активуємо наступний етап
        var newEnabledSteps = new HashSet<>(enabledSteps);
        newEnabledSteps.add(nextStep);

        return this.toBuilder()
                .currentStep(nextStep)
                .currentWizardStep(nextWizardStep)
                .completedSteps(newCompletedSteps)
                .enabledSteps(newEnabledSteps)
                .canNavigateNext(nextStep < MAX_STEP)
                .canNavigatePrevious(true)
                .currentStepTitle(nextWizardStep.getTitle())
                .currentStepDescription(nextWizardStep.getDescription())
                .progressText(String.format("Етап %d з %d", nextStep + 1, TOTAL_STEPS))
                .progressPercentage((nextStep + 1) * 25)
                .isCompleted(nextStep == MAX_STEP)
                .lastModifiedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Перехід до попереднього етапу.
     */
    public OrderWizardState moveToPreviousStep() {
        if (!canNavigatePrevious) {
            log.warn("Cannot navigate to previous step from current step: {}", currentStep);
            return this;
        }

        int previousStep = Math.max(currentStep - 1, MIN_STEP);
        var previousWizardStep = WizardStep.fromStepNumber(previousStep);

        return this.toBuilder()
                .currentStep(previousStep)
                .currentWizardStep(previousWizardStep)
                .canNavigateNext(true)
                .canNavigatePrevious(previousStep > MIN_STEP)
                .isCompleted(false)
                .currentStepTitle(previousWizardStep.getTitle())
                .currentStepDescription(previousWizardStep.getDescription())
                .progressText(String.format("Етап %d з %d", previousStep + 1, TOTAL_STEPS))
                .progressPercentage((previousStep + 1) * 25)
                .lastModifiedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Перехід до конкретного етапу (якщо дозволено).
     */
    public OrderWizardState moveToStep(int targetStep) {
        if (targetStep < MIN_STEP || targetStep > MAX_STEP) {
            log.warn("Invalid target step: {}", targetStep);
            return withError("Недійсний номер етапу: " + targetStep);
        }

        if (!enabledSteps.contains(targetStep)) {
            log.warn("Step {} is not enabled. Enabled steps: {}", targetStep, enabledSteps);
            return withError("Етап " + (targetStep + 1) + " недоступний");
        }

        var targetWizardStep = WizardStep.fromStepNumber(targetStep);

        return this.toBuilder()
                .currentStep(targetStep)
                .currentWizardStep(targetWizardStep)
                .canNavigateNext(targetStep < MAX_STEP)
                .canNavigatePrevious(targetStep > MIN_STEP)
                .isCompleted(targetStep == MAX_STEP && completedSteps.containsAll(Set.of(0, 1, 2)))
                .currentStepTitle(targetWizardStep.getTitle())
                .currentStepDescription(targetWizardStep.getDescription())
                .progressText(String.format("Етап %d з %d", targetStep + 1, TOTAL_STEPS))
                .progressPercentage((targetStep + 1) * 25)
                .errorMessage(null)
                .lastModifiedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Оновлення даних wizard'а.
     */
    public OrderWizardState withWizardData(OrderWizardData newData) {
        return this.toBuilder()
                .wizardData(newData)
                .lastModifiedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Встановлення помилки.
     */
    public OrderWizardState withError(String errorMessage) {
        return this.toBuilder()
                .errorMessage(errorMessage)
                .isValid(false)
                .lastModifiedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Очищення помилки.
     */
    public OrderWizardState clearError() {
        return this.toBuilder()
                .errorMessage(null)
                .isValid(true)
                .lastModifiedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Завершення wizard'а.
     */
    public OrderWizardState complete() {
        var allCompleted = Set.of(0, 1, 2, 3);

        return this.toBuilder()
                .completedSteps(allCompleted)
                .isCompleted(true)
                .isInProgress(false)
                .canNavigateNext(false)
                .canNavigatePrevious(false)
                .canCancel(false)
                .progressText("Замовлення завершено")
                .progressPercentage(100)
                .lastModifiedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Завершення поточного етапу з даними.
     * Активує наступний етап для навігації.
     */
    public OrderWizardState completeCurrentStep(OrderWizardData updatedData) {
        var newCompletedSteps = new HashSet<>(completedSteps);
        newCompletedSteps.add(currentStep);

        // Активуємо наступний етап якщо він існує
        var newEnabledSteps = new HashSet<>(enabledSteps);
        if (currentStep < MAX_STEP) {
            newEnabledSteps.add(currentStep + 1);
        }

        return this.toBuilder()
                .wizardData(updatedData)
                .completedSteps(newCompletedSteps)
                .enabledSteps(newEnabledSteps)
                .canNavigateNext(currentStep < MAX_STEP)
                .lastModifiedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Enum для етапів wizard'а з метаданими.
     */
    public enum WizardStep {
        CLIENT_INFO(0, "Клієнт та інформація", "Вибір клієнта та базова інформація замовлення"),
        ITEMS_MANAGER(1, "Предмети замовлення", "Додавання та управління предметами"),
        ORDER_PARAMETERS(2, "Параметри замовлення", "Налаштування термінів, знижок та оплати"),
        CONFIRMATION(3, "Підтвердження", "Перегляд та підтвердження замовлення");

        private final int stepNumber;
        private final String title;
        private final String description;

        WizardStep(int stepNumber, String title, String description) {
            this.stepNumber = stepNumber;
            this.title = title;
            this.description = description;
        }

        public int getStepNumber() { return stepNumber; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }

        public static WizardStep fromStepNumber(int stepNumber) {
            return switch (stepNumber) {
                case 0 -> CLIENT_INFO;
                case 1 -> ITEMS_MANAGER;
                case 2 -> ORDER_PARAMETERS;
                case 3 -> CONFIRMATION;
                default -> throw new IllegalArgumentException("Invalid step number: " + stepNumber);
            };
        }
    }

    // Допоміжні методи для перевірок
    public boolean isStepEnabled(int stepNumber) {
        return enabledSteps.contains(stepNumber);
    }

    public boolean isStepCompleted(int stepNumber) {
        return completedSteps.contains(stepNumber);
    }

    public boolean canNavigateToStep(int stepNumber) {
        return stepNumber >= MIN_STEP && stepNumber <= MAX_STEP && enabledSteps.contains(stepNumber);
    }

    public boolean hasValidWizardData() {
        return wizardData != null;
    }

    public boolean hasError() {
        return errorMessage != null && !errorMessage.trim().isEmpty();
    }

    public int getCompletedStepsCount() {
        return completedSteps.size();
    }

    public double getCompletionRatio() {
        return (double) getCompletedStepsCount() / TOTAL_STEPS;
    }
}
