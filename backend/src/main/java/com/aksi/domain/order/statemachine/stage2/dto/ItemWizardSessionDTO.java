package com.aksi.domain.order.statemachine.stage2.dto;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.aksi.domain.order.statemachine.stage2.enums.ItemWizardStep;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для управління сесією Item Wizard.
 * Містить інформацію про поточний стан підвізарда та дані кроків.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemWizardSessionDTO {

    /**
     * ID основного wizard'а.
     */
    private String wizardId;

    /**
     * ID поточної сесії item wizard'а.
     */
    private String itemWizardId;

    /**
     * Поточний крок підвізарда.
     */
    @Builder.Default
    private ItemWizardStep currentStep = ItemWizardStep.BASIC_INFO;

    /**
     * Мапа даних для кожного кроку підвізарда.
     */
    @Builder.Default
    private Map<ItemWizardStep, Object> stepData = new HashMap<>();

    /**
     * Чи знаходиться підвізард в режимі редагування.
     */
    @Builder.Default
    private Boolean isEditMode = false;

    /**
     * ID предмета для редагування (якщо isEditMode = true).
     */
    private String editingItemId;

    /**
     * Час створення сесії.
     */
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Час останньої активності в сесії.
     */
    @Builder.Default
    private LocalDateTime lastActivity = LocalDateTime.now();

    /**
     * Чи завершений поточний крок.
     */
    @Builder.Default
    private Boolean currentStepCompleted = false;

    /**
     * Чи можна перейти до наступного кроку.
     */
    @Builder.Default
    private Boolean canProceedToNextStep = false;

    /**
     * Загальна кількість кроків в підвізарді.
     */
    public static final int TOTAL_STEPS = ItemWizardStep.values().length;

    /**
     * Отримати дані для конкретного кроку.
     */
    public <T> T getStepData(ItemWizardStep step, Class<T> clazz) {
        Object data = stepData.get(step);
        return clazz.isInstance(data) ? clazz.cast(data) : null;
    }

    /**
     * Зберегти дані для конкретного кроку.
     */
    public void setStepData(ItemWizardStep step, Object data) {
        if (stepData == null) {
            stepData = new HashMap<>();
        }
        stepData.put(step, data);
        updateLastActivity();
    }

    /**
     * Чи завершений конкретний крок.
     */
    public boolean isStepCompleted(ItemWizardStep step) {
        return stepData.containsKey(step) && stepData.get(step) != null;
    }

    /**
     * Отримати номер поточного кроку (1-based).
     */
    public int getCurrentStepNumber() {
        return currentStep.ordinal() + 1;
    }

    /**
     * Чи є поточний крок останнім.
     */
    public boolean isLastStep() {
        return getCurrentStepNumber() == TOTAL_STEPS;
    }

    /**
     * Оновити час останньої активності.
     */
    public void updateLastActivity() {
        this.lastActivity = LocalDateTime.now();
    }

    /**
     * Перейти до наступного кроку.
     */
    public boolean proceedToNextStep() {
        if (canProceedToNextStep && !isLastStep()) {
            ItemWizardStep[] steps = ItemWizardStep.values();
            int currentIndex = currentStep.ordinal();
            currentStep = steps[currentIndex + 1];
            currentStepCompleted = false;
            canProceedToNextStep = false;
            updateLastActivity();
            return true;
        }
        return false;
    }

    /**
     * Повернутися до попереднього кроку.
     */
    public boolean goToPreviousStep() {
        if (getCurrentStepNumber() > 1) {
            ItemWizardStep[] steps = ItemWizardStep.values();
            int currentIndex = currentStep.ordinal();
            currentStep = steps[currentIndex - 1];
            currentStepCompleted = isStepCompleted(currentStep);
            canProceedToNextStep = currentStepCompleted;
            updateLastActivity();
            return true;
        }
        return false;
    }

    /**
     * Скинути сесію до початкового стану.
     */
    public void reset() {
        currentStep = ItemWizardStep.BASIC_INFO;
        stepData.clear();
        currentStepCompleted = false;
        canProceedToNextStep = false;
        isEditMode = false;
        editingItemId = null;
        updateLastActivity();
    }
}
