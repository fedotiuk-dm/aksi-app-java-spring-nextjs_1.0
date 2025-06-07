package com.aksi.domain.order.statemachine.stage2.substep2.dto;

import java.util.List;

import com.aksi.domain.order.statemachine.stage2.substep2.enums.FillingType;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.MaterialType;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.WearLevel;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для характеристик предмета (Підетап 2.2)
 *
 * Містить:
 * - Матеріал (залежить від категорії)
 * - Колір (базові + кастомний)
 * - Наповнювач (для відповідних категорій)
 * - Ступінь зносу
 * - Примітки
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class CharacteristicsDTO {

    /**
     * Тип матеріала
     */
    @NotNull(message = "Матеріал обов'язковий для вибору")
    private MaterialType material;

    /**
     * Колір предмета
     */
    @NotNull(message = "Колір обов'язковий для вказання")
    @Size(min = 1, max = 100, message = "Колір має містити від 1 до 100 символів")
    private String color;

    /**
     * Чи вибраний колір з базових варіантів
     */
    @Builder.Default
    private Boolean isStandardColor = false;

    /**
     * Тип наповнювача (може бути null якщо не застосовується)
     */
    private FillingType filling;

    /**
     * Кастомний тип наповнювача (коли filling = OTHER)
     */
    @Size(max = 100, message = "Назва наповнювача не може перевищувати 100 символів")
    private String customFilling;

    /**
     * Чи збитий наповнювач
     */
    @Builder.Default
    private Boolean isDamagedFilling = false;

    /**
     * Ступінь зносу предмета
     */
    private WearLevel wearLevel;

    /**
     * Примітки щодо характеристик
     */
    @Size(max = 500, message = "Примітки не можуть перевищувати 500 символів")
    private String notes;

    /**
     * Чи валідні характеристики
     */
    @Builder.Default
    private Boolean isValid = false;

    /**
     * Список помилок валідації
     */
    @Builder.Default
    private List<String> validationErrors = List.of();

    /**
     * Перевіряє чи заповнені всі обов'язкові поля
     */
    public boolean isComplete() {
        return material != null &&
               color != null && !color.trim().isEmpty() &&
               (filling == null || filling != FillingType.OTHER ||
                (customFilling != null && !customFilling.trim().isEmpty()));
    }

    /**
     * Перевіряє чи потребує предмет особливого догляду
     */
    public boolean requiresSpecialCare() {
        boolean materialCare = material != null && material.isLeather();
        boolean fillingCare = filling != null && filling.requiresSpecialCare();
        boolean wearCare = wearLevel != null && wearLevel.requiresSpecialCare();
        boolean damagedCare = Boolean.TRUE.equals(isDamagedFilling);

        return materialCare || fillingCare || wearCare || damagedCare;
    }

    /**
     * Перевіряє чи є критичний знос
     */
    public boolean hasCriticalWear() {
        return wearLevel != null && wearLevel.isCritical();
    }

    /**
     * Перевіряє чи вказаний кастомний наповнювач
     */
    public boolean hasCustomFilling() {
        return filling == FillingType.OTHER &&
               customFilling != null && !customFilling.trim().isEmpty();
    }

    /**
     * Отримує повну назву наповнювача
     */
    public String getFullFillingName() {
        if (filling == null) {
            return null;
        }

        if (filling == FillingType.OTHER && customFilling != null) {
            return customFilling.trim();
        }

        return filling.getDisplayName();
    }

    /**
     * Перевіряє чи застосовується наповнювач для цього предмета
     */
    public boolean hasFillingApplied() {
        return filling != null;
    }

    /**
     * Отримує рекомендації по обробці на основі характеристик
     */
    public List<String> getProcessingRecommendations() {
        List<String> recommendations = new java.util.ArrayList<>();

        if (material != null && material.isLeather()) {
            recommendations.add("Спеціальна обробка для шкіри");
        }

        if (wearLevel != null) {
            recommendations.add(wearLevel.getProcessingRecommendation());
        }

        if (filling != null) {
            recommendations.add(filling.getProcessingRecommendation());
        }

        if (Boolean.TRUE.equals(isDamagedFilling) && filling != null) {
            recommendations.add(filling.getDamagedFillingWarning());
        }

        return recommendations;
    }

    /**
     * Отримує список попереджень
     */
    public List<String> getWarnings() {
        List<String> warnings = new java.util.ArrayList<>();

        if (hasCriticalWear()) {
            warnings.add("Критичний ступінь зносу - обробка без гарантій");
        }

        if (Boolean.TRUE.equals(isDamagedFilling) && filling != null) {
            warnings.add(filling.getDamagedFillingWarning());
        }

        if (material != null && material.isLeather() && wearLevel != null && wearLevel.isCritical()) {
            warnings.add("Поєднання шкіри та критичного зносу - високий ризик");
        }

        return warnings;
    }
}
