package com.aksi.domain.order.enums;

import java.util.Set;

/**
 * Domain enum для категорій послуг з business логікою
 */
public enum ServiceCategory {
    TEXTILE_CLEANING("Чистка одягу та текстилю"),
    LAUNDRY("Прання білизни"),
    IRONING("Прасування"),
    LEATHER_CLEANING("Чистка та відновлення шкіряних виробів"),
    SHEEPSKIN("Дублянки"),
    FUR("Вироби із натурального хутра"),
    DYEING("Фарбування текстильних виробів");

    private final String description;

    ServiceCategory(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Перевіряє чи категорія працює з текстильними виробами
     */
    public boolean isTextileCategory() {
        return this == TEXTILE_CLEANING || this == LAUNDRY || this == IRONING || this == DYEING;
    }

    /**
     * Перевіряє чи категорія працює зі шкіряними виробами
     */
    public boolean isLeatherCategory() {
        return this == LEATHER_CLEANING || this == SHEEPSKIN;
    }

    /**
     * Перевіряє чи категорія працює з хутром
     */
    public boolean isFurCategory() {
        return this == FUR || this == SHEEPSKIN;
    }

    /**
     * Перевіряє чи потребує спеціальних умов зберігання
     */
    public boolean requiresSpecialStorage() {
        return this == FUR || this == LEATHER_CLEANING || this == SHEEPSKIN;
    }

    /**
     * Перевіряє чи дозволені текстильні модифікатори
     */
    public boolean allowsTextileModifiers() {
        return isTextileCategory();
    }

    /**
     * Перевіряє чи дозволені шкіряні модифікатори
     */
    public boolean allowsLeatherModifiers() {
        return isLeatherCategory();
    }

    /**
     * Перевіряє чи потребує вологі процедури
     */
    public boolean requiresWetProcess() {
        return this == TEXTILE_CLEANING || this == LAUNDRY || this == LEATHER_CLEANING;
    }

    /**
     * Перевіряє чи дозволена термінова обробка
     */
    public boolean allowsUrgentProcessing() {
        return this != FUR && this != DYEING; // Хутро та фарбування не терпить поспіху
    }

    /**
     * Отримує категорії що потребують додаткового часу
     */
    public static Set<ServiceCategory> getCategoriesRequiringExtraTime() {
        return Set.of(FUR, DYEING, SHEEPSKIN);
    }

    /**
     * Отримує категорії що працюють з натуральними матеріалами
     */
    public static Set<ServiceCategory> getNaturalMaterialCategories() {
        return Set.of(LEATHER_CLEANING, SHEEPSKIN, FUR);
    }

    /**
     * Перевіряє сумісність категорії з типом матеріалу
     */
    public boolean isCompatibleWithMaterial(String material) {
        if (material == null || material.trim().isEmpty()) {
            return true; // За замовчуванням сумісний
        }

        String materialLower = material.toLowerCase();

        return switch (this) {
            case TEXTILE_CLEANING -> !materialLower.contains("шкіра") && !materialLower.contains("хутро");
            case LEATHER_CLEANING -> materialLower.contains("шкіра") || materialLower.contains("нубук") || materialLower.contains("замша");
            case SHEEPSKIN -> materialLower.contains("дублянка") || materialLower.contains("овча");
            case FUR -> materialLower.contains("хутро") || materialLower.contains("норка") || materialLower.contains("лисиця");
            case LAUNDRY, IRONING -> !materialLower.contains("шкіра") && !materialLower.contains("хутро");
            case DYEING -> !materialLower.contains("шкіра") && !materialLower.contains("хутро");
        };
    }

    /**
     * Отримує рекомендований час обробки в днях
     */
    public int getRecommendedProcessingDays() {
        return switch (this) {
            case IRONING -> 1;
            case LAUNDRY -> 2;
            case TEXTILE_CLEANING -> 3;
            case LEATHER_CLEANING -> 5;
            case SHEEPSKIN -> 7;
            case FUR -> 10;
            case DYEING -> 14;
        };
    }
}
