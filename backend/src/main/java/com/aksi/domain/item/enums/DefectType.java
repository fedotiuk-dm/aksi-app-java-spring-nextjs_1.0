package com.aksi.domain.item.enums;

/**
 * Domain enum для типів дефектів з business методами API версія: com.aksi.api.item.dto.DefectType
 */
public enum DefectType {
  WEAR("WEAR", "Потертості", true, false, 0.0),
  TORN("TORN", "Порване", true, true, 0.2),
  MISSING_HARDWARE("MISSING_HARDWARE", "Відсутність фурнітури", true, false, 0.0),
  DAMAGED_HARDWARE("DAMAGED_HARDWARE", "Пошкодження фурнітури", true, false, 0.1),
  COLOR_CHANGE_RISK("COLOR_CHANGE_RISK", "Ризики зміни кольору", false, true, 0.0),
  DEFORMATION_RISK("DEFORMATION_RISK", "Ризики деформації", false, true, 0.0),
  NO_WARRANTY("NO_WARRANTY", "Без гарантій", false, true, 0.0);

  private final String code;
  private final String displayName;
  private final boolean isRepairable;
  private final boolean affectsWarranty;
  private final double riskMultiplier;

  DefectType(
      String code,
      String displayName,
      boolean isRepairable,
      boolean affectsWarranty,
      double riskMultiplier) {
    this.code = code;
    this.displayName = displayName;
    this.isRepairable = isRepairable;
    this.affectsWarranty = affectsWarranty;
    this.riskMultiplier = riskMultiplier;
  }

  public String getCode() {
    return code;
  }

  public String getDisplayName() {
    return displayName;
  }

  // ===== BUSINESS МЕТОДИ =====

  /** Чи можна відремонтувати дефект */
  public boolean isRepairable() {
    return isRepairable;
  }

  /** Чи впливає на гарантію */
  public boolean affectsWarranty() {
    return affectsWarranty;
  }

  /** Отримати коефіцієнт ризику */
  public double getRiskMultiplier() {
    return riskMultiplier;
  }

  /** Чи є дефект критичним */
  public boolean isCritical() {
    return this == TORN || this == COLOR_CHANGE_RISK || this == DEFORMATION_RISK;
  }

  /** Чи потребує спеціального повідомлення клієнту */
  public boolean requiresClientNotification() {
    return affectsWarranty || isCritical();
  }

  /** Чи можна обробляти в експрес-режимі */
  public boolean isExpressProcessingCompatible() {
    return !isCritical() && !affectsWarranty;
  }

  /** Чи потребує додаткової документації */
  public boolean needsDocumentation() {
    return this == NO_WARRANTY || this == COLOR_CHANGE_RISK || this == DEFORMATION_RISK;
  }

  /** Чи потребує фотографування */
  public boolean requiresPhotos() {
    return this == WEAR || this == TORN || this == DAMAGED_HARDWARE;
  }

  /** Отримати рекомендоване попередження для клієнта */
  public String getClientWarning() {
    return switch (this) {
      case COLOR_CHANGE_RISK -> "Можлива зміна кольору виробу під час обробки";
      case DEFORMATION_RISK -> "Можлива деформація виробу під час обробки";
      case NO_WARRANTY -> "Обробка виконується без гарантії якості";
      case TORN -> "Виявлено пошкодження тканини";
      default -> "";
    };
  }

  /** Отримати рівень пріоритету (1-5, де 5 найвищий) */
  public int getPriorityLevel() {
    return switch (this) {
      case NO_WARRANTY -> 5;
      case COLOR_CHANGE_RISK, DEFORMATION_RISK -> 4;
      case TORN -> 3;
      case DAMAGED_HARDWARE -> 2;
      case WEAR, MISSING_HARDWARE -> 1;
    };
  }
}
