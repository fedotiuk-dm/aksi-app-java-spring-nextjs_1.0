package com.aksi.domain.order.statemachine.stage2.substep2.enums;

/**
 * Типи наповнювача для предметів
 *
 * Згідно з документацією Order Wizard підетап 2.2:
 * - Пух, Синтепон, Інше (вручну)
 * - Чекбокс "Збитий наповнювач"
 */
public enum FillingType {

    DOWN("Пух", "down", true, "Натуральний пуховий наповнювач"),
    SYNTHETIC("Синтепон", "synthetic", true, "Синтетичний наповнювач"),
    OTHER("Інше", "other", false, "Інший тип наповнювача (вказується вручну)");

    private final String displayName;
    private final String code;
    private final boolean isPredefined;
    private final String description;

    FillingType(String displayName, String code, boolean isPredefined, String description) {
        this.displayName = displayName;
        this.code = code;
        this.isPredefined = isPredefined;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getCode() {
        return code;
    }

    public boolean isPredefined() {
        return isPredefined;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Отримує FillingType за кодом
     */
    public static FillingType fromCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return null;
        }

        for (FillingType type : values()) {
            if (type.code.equalsIgnoreCase(code.trim())) {
                return type;
            }
        }
        return null;
    }

    /**
     * Перевіряє чи потребує цей наповнювач особливого догляду
     */
    public boolean requiresSpecialCare() {
        return switch (this) {
            case DOWN -> true;  // Пух потребує особливого догляду
            case SYNTHETIC -> false;
            case OTHER -> true; // Невідомий тип - краще обережно
        };
    }

    /**
     * Перевіряє чи може цей наповнювач бути збитим
     */
    public boolean canBeDamaged() {
        return switch (this) {
            case DOWN -> true;  // Пух може збиватися
            case SYNTHETIC -> true; // Синтепон теж може збиватися
            case OTHER -> true; // Невідомо, тому припускаємо що може
        };
    }

    /**
     * Отримує рекомендації по обробці наповнювача
     */
    public String getProcessingRecommendation() {
        return switch (this) {
            case DOWN -> "Делікатна сушка, низька температура";
            case SYNTHETIC -> "Стандартна обробка";
            case OTHER -> "Індивідуальний підхід залежно від типу";
        };
    }

    /**
     * Отримує попередження для збитого наповнювача
     */
    public String getDamagedFillingWarning() {
        return switch (this) {
            case DOWN -> "Збитий пух може не відновитися повністю";
            case SYNTHETIC -> "Збитий синтепон важко відновлюється";
            case OTHER -> "Стан збитого наповнювача непередбачуваний";
        };
    }
}
