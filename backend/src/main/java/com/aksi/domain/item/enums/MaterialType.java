package com.aksi.domain.item.enums;

/**
 * Domain enum для типів матеріалів з business методами API версія:
 * com.aksi.api.item.dto.MaterialType
 */
public enum MaterialType {
  COTTON("COTTON", "Бавовна", true, false),
  WOOL("WOOL", "Шерсть", true, false),
  SILK("SILK", "Шовк", true, false),
  SYNTHETIC("SYNTHETIC", "Синтетика", true, false),
  SMOOTH_LEATHER("SMOOTH_LEATHER", "Гладка шкіра", false, true),
  NUBUCK("NUBUCK", "Нубук", false, true),
  SPLIT_LEATHER("SPLIT_LEATHER", "Спілок", false, true),
  SUEDE("SUEDE", "Замша", false, true),
  OTHER("OTHER", "Інше", false, false);

  private final String code;
  private final String displayName;
  private final boolean isTextile;
  private final boolean isLeather;

  MaterialType(String code, String displayName, boolean isTextile, boolean isLeather) {
    this.code = code;
    this.displayName = displayName;
    this.isTextile = isTextile;
    this.isLeather = isLeather;
  }

  public String getCode() {
    return code;
  }

  public String getDisplayName() {
    return displayName;
  }

  // ===== BUSINESS МЕТОДИ =====

  /** Чи є матеріал текстильним */
  public boolean isTextile() {
    return isTextile;
  }

  /** Чи є матеріал шкіряним */
  public boolean isLeather() {
    return isLeather;
  }

  /** Чи потребує спеціального догляду */
  public boolean requiresSpecialCare() {
    return this == SILK || this == WOOL || isLeather();
  }

  /** Чи можна прасувати при високій температурі */
  public boolean canHighTemperatureIron() {
    return this == COTTON || this == SYNTHETIC;
  }

  /** Чи підходить для машинного прання */
  public boolean isMachineWashable() {
    return isTextile() && this != SILK && this != WOOL;
  }

  /** Чи потребує водовідштовхуючого покриття */
  public boolean needsWaterRepellentTreatment() {
    return isLeather() || this == WOOL;
  }

  /** Отримати коефіцієнт складності обробки */
  public double getComplexityMultiplier() {
    return switch (this) {
      case SILK -> 1.5;
      case WOOL -> 1.3;
      case SMOOTH_LEATHER, NUBUCK, SPLIT_LEATHER, SUEDE -> 1.8;
      case COTTON, SYNTHETIC -> 1.0;
      case OTHER -> 1.2;
    };
  }

  /** Чи підходить матеріал для експрес-обробки */
  public boolean isExpressProcessingCompatible() {
    return this == COTTON || this == SYNTHETIC;
  }
}
