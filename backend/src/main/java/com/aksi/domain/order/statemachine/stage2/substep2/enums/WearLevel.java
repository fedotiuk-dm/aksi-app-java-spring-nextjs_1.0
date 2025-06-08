package com.aksi.domain.order.statemachine.stage2.substep2.enums;

/**
 * Ступені зносу предметів
 *
 * Згідно з документацією Order Wizard підетап 2.2:
 * - 10%, 30%, 50%, 75%
 */
public enum WearLevel {

    LEVEL_10(10, "10%", "Мінімальний знос"),
    LEVEL_30(30, "30%", "Помірний знос"),
    LEVEL_50(50, "50%", "Значний знос"),
    LEVEL_75(75, "75%", "Дуже сильний знос");

    private final int percentage;
    private final String displayValue;
    private final String description;

    WearLevel(int percentage, String displayValue, String description) {
        this.percentage = percentage;
        this.displayValue = displayValue;
        this.description = description;
    }

    public int getPercentage() {
        return percentage;
    }

    public String getDisplayValue() {
        return displayValue;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Отримує WearLevel за відсотком
     */
    public static WearLevel fromPercentage(int percentage) {
        for (WearLevel level : values()) {
            if (level.percentage == percentage) {
                return level;
            }
        }
        return null;
    }

    /**
     * Отримує WearLevel за відображуваним значенням
     */
    public static WearLevel fromDisplayValue(String displayValue) {
        if (displayValue == null || displayValue.trim().isEmpty()) {
            return null;
        }

        for (WearLevel level : values()) {
            if (level.displayValue.equalsIgnoreCase(displayValue.trim())) {
                return level;
            }
        }
        return null;
    }

    /**
     * Перевіряє чи є знос критичним (>= 50%)
     */
    public boolean isCritical() {
        return this.percentage >= 50;
    }

    /**
     * Перевіряє чи потребує предмет особливої обережності
     */
    public boolean requiresSpecialCare() {
        return this.percentage >= 30;
    }

    /**
     * Отримує рекомендацію для обробки
     */
    public String getProcessingRecommendation() {
        return switch (this) {
            case LEVEL_10 -> "Стандартна обробка";
            case LEVEL_30 -> "Обережна обробка";
            case LEVEL_50 -> "Дуже обережна обробка";
            case LEVEL_75 -> "Максимально обережна обробка";
        };
    }
}
