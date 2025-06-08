package com.aksi.domain.order.statemachine.stage2.substep2.enums;

/**
 * Типи матеріалів для предметів
 *
 * Згідно з документацією Order Wizard підетап 2.2:
 * - Бавовна, Шерсть, Шовк, Синтетика (текстиль)
 * - Гладка шкіра, Нубук, Спілок, Замша (шкіра)
 */
public enum MaterialType {

    // Текстильні матеріали
    COTTON("Бавовна", "cotton", MaterialCategory.TEXTILE),
    WOOL("Шерсть", "wool", MaterialCategory.TEXTILE),
    SILK("Шовк", "silk", MaterialCategory.TEXTILE),
    SYNTHETIC("Синтетика", "synthetic", MaterialCategory.TEXTILE),

    // Шкіряні матеріали
    SMOOTH_LEATHER("Гладка шкіра", "smooth_leather", MaterialCategory.LEATHER),
    NUBUCK("Нубук", "nubuck", MaterialCategory.LEATHER),
    SPLIT_LEATHER("Спілок", "split_leather", MaterialCategory.LEATHER),
    SUEDE("Замша", "suede", MaterialCategory.LEATHER);

    private final String displayName;
    private final String code;
    private final MaterialCategory category;

    MaterialType(String displayName, String code, MaterialCategory category) {
        this.displayName = displayName;
        this.code = code;
        this.category = category;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getCode() {
        return code;
    }

    public MaterialCategory getCategory() {
        return category;
    }

    /**
     * Категорії матеріалів
     */
    public enum MaterialCategory {
        TEXTILE("Текстиль"),
        LEATHER("Шкіра");

        private final String displayName;

        MaterialCategory(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    /**
     * Отримує MaterialType за кодом
     */
    public static MaterialType fromCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return null;
        }

        for (MaterialType type : values()) {
            if (type.code.equalsIgnoreCase(code.trim())) {
                return type;
            }
        }
        return null;
    }

    /**
     * Перевіряє чи є матеріал текстильним
     */
    public boolean isTextile() {
        return this.category == MaterialCategory.TEXTILE;
    }

    /**
     * Перевіряє чи є матеріал шкіряним
     */
    public boolean isLeather() {
        return this.category == MaterialCategory.LEATHER;
    }

    /**
     * Отримує всі матеріали для конкретної категорії
     */
    public static MaterialType[] getByCategory(MaterialCategory category) {
        return java.util.Arrays.stream(values())
                .filter(type -> type.category == category)
                .toArray(MaterialType[]::new);
    }
}
