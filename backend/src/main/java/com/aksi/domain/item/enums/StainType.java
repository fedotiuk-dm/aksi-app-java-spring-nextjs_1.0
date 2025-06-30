package com.aksi.domain.item.enums;

/**
 * Domain enum для типів забруднень з business методами
 * API версія: com.aksi.api.item.dto.StainType
 */
public enum StainType {

    FAT("FAT", "Жир", true, false, 1.2),
    BLOOD("BLOOD", "Кров", true, true, 1.5),
    PROTEIN("PROTEIN", "Білок", true, true, 1.3),
    WINE("WINE", "Вино", true, false, 1.4),
    COFFEE("COFFEE", "Кава", true, false, 1.3),
    GRASS("GRASS", "Трава", true, false, 1.2),
    INK("INK", "Чорнило", false, true, 1.8),
    COSMETICS("COSMETICS", "Косметика", true, false, 1.3),
    OTHER("OTHER", "Інше", false, false, 1.1);

    private final String code;
    private final String displayName;
    private final boolean isRemovable;
    private final boolean requiresSpecialTreatment;
    private final double difficultyMultiplier;

    StainType(String code, String displayName, boolean isRemovable,
              boolean requiresSpecialTreatment, double difficultyMultiplier) {
        this.code = code;
        this.displayName = displayName;
        this.isRemovable = isRemovable;
        this.requiresSpecialTreatment = requiresSpecialTreatment;
        this.difficultyMultiplier = difficultyMultiplier;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    // ===== BUSINESS МЕТОДИ =====

    /**
     * Чи можна видалити забруднення
     */
    public boolean isRemovable() {
        return isRemovable;
    }

    /**
     * Чи потребує спеціальної обробки
     */
    public boolean requiresSpecialTreatment() {
        return requiresSpecialTreatment;
    }

    /**
     * Отримати коефіцієнт складності видалення
     */
    public double getDifficultyMultiplier() {
        return difficultyMultiplier;
    }

    /**
     * Чи є забруднення водорозчинним
     */
    public boolean isWaterSoluble() {
        return this == BLOOD || this == PROTEIN || this == WINE || this == COFFEE;
    }

    /**
     * Чи є забруднення жировим
     */
    public boolean isOilBased() {
        return this == FAT || this == COSMETICS;
    }

    /**
     * Чи потребує попередньої обробки
     */
    public boolean needsPreTreatment() {
        return requiresSpecialTreatment || this == BLOOD || this == WINE || this == INK;
    }

    /**
     * Чи може залишити постійний слід
     */
    public boolean canLeavePermanentMark() {
        return this == INK || this == WINE || (!isRemovable && this != OTHER);
    }

    /**
     * Отримати рекомендований час обробки (в хвилинах)
     */
    public int getRecommendedTreatmentTime() {
        return switch (this) {
            case BLOOD, INK -> 60;
            case WINE, PROTEIN -> 45;
            case FAT, COSMETICS -> 30;
            case COFFEE, GRASS -> 20;
            case OTHER -> 15;
        };
    }

    /**
     * Чи підходить для експрес-обробки
     */
    public boolean isExpressProcessingCompatible() {
        return !requiresSpecialTreatment && isRemovable;
    }
}
