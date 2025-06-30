package com.aksi.domain.order.enums;

import java.math.BigDecimal;
import java.util.Set;

/** Domain enum для типів дефектів з business логікою ризиків. */
public enum DefectType {
  WEAR("Потертості", 1, BigDecimal.valueOf(0.05)),
  TORN("Порване", 4, BigDecimal.valueOf(0.30)),
  MISSING_HARDWARE("Відсутність фурнітури", 3, BigDecimal.valueOf(0.20)),
  DAMAGED_HARDWARE("Пошкодження фурнітури", 3, BigDecimal.valueOf(0.15)),
  COLOR_CHANGE_RISK("Ризики зміни кольору", 4, BigDecimal.valueOf(0.40)),
  DEFORMATION_RISK("Ризики деформації", 5, BigDecimal.valueOf(0.50)),
  NO_WARRANTY("Без гарантій", 5, BigDecimal.valueOf(0.00));

  private final String description;
  private final int riskLevel;
  private final BigDecimal discountPercentage;

  DefectType(String description, int riskLevel, BigDecimal discountPercentage) {
    this.description = description;
    this.riskLevel = riskLevel;
    this.discountPercentage = discountPercentage;
  }

  public String getDescription() {
    return description;
  }

  /** Рівень ризику від 1 до 5 (1 - мінімальний, 5 - максимальний). */
  public int getRiskLevel() {
    return riskLevel;
  }

  /** Відсоток знижки через дефект. */
  public BigDecimal getDiscountPercentage() {
    return discountPercentage;
  }

  /** Перевіряє чи дефект критичний (високий ризик). */
  public boolean isCritical() {
    return riskLevel >= 4;
  }

  /** Перевіряє чи дефект потребує особливої уваги. */
  public boolean requiresSpecialAttention() {
    return this == COLOR_CHANGE_RISK || this == DEFORMATION_RISK || this == NO_WARRANTY;
  }

  /** Перевіряє чи дефект може бути виправлений. */
  public boolean isRepairable() {
    return this == MISSING_HARDWARE || this == DAMAGED_HARDWARE;
  }

  /** Перевіряє чи потрібна попередня згода клієнта. */
  public boolean requiresClientConsent() {
    return isCritical() || this == NO_WARRANTY;
  }

  /** Перевіряє чи дефект впливає на вартість послуги. */
  public boolean affectsPrice() {
    return discountPercentage.compareTo(BigDecimal.ZERO) > 0;
  }

  /** Отримує дефекти що потребують документування. */
  public static Set<DefectType> getDefectsRequiringDocumentation() {
    return Set.of(TORN, COLOR_CHANGE_RISK, DEFORMATION_RISK, NO_WARRANTY);
  }

  /** Отримує критичні дефекти. */
  public static Set<DefectType> getCriticalDefects() {
    return Set.of(TORN, COLOR_CHANGE_RISK, DEFORMATION_RISK, NO_WARRANTY);
  }

  /** Перевіряє сумісність з типом послуги. */
  public boolean isCompatibleWithService(ServiceCategory category) {
    return switch (this) {
      case MISSING_HARDWARE, DAMAGED_HARDWARE ->
          category.isTextileCategory() || category.isLeatherCategory();
      case COLOR_CHANGE_RISK ->
          category != ServiceCategory.IRONING; // Прасування зазвичай безпечне для кольору
      case DEFORMATION_RISK ->
          category == ServiceCategory.TEXTILE_CLEANING
              || category == ServiceCategory.LEATHER_CLEANING
              || category == ServiceCategory.SHEEPSKIN;
      default -> true; // Інші дефекти сумісні з усіма послугами
    };
  }

  /** Розраховує знижку з урахуванням дефекту. */
  public BigDecimal calculateDiscountAmount(BigDecimal basePrice) {
    return basePrice.multiply(discountPercentage);
  }

  /** Розраховує фінальну ціну з урахуванням дефекту. */
  public BigDecimal calculatePriceWithDefect(BigDecimal basePrice) {
    return basePrice.subtract(calculateDiscountAmount(basePrice));
  }

  /** Перевіряє чи дефекти можуть впливати один на одного. */
  public boolean canInteractWith(DefectType other) {
    if (this == other) return false;

    // Дефекти фурнітури не взаємодіють з ризиками
    if ((this == MISSING_HARDWARE || this == DAMAGED_HARDWARE)
        && (other == COLOR_CHANGE_RISK || other == DEFORMATION_RISK)) {
      return false;
    }

    // Ризики можуть підсилювати один одного (симетрично)
    return (this == COLOR_CHANGE_RISK && other == DEFORMATION_RISK)
        || (this == DEFORMATION_RISK && other == COLOR_CHANGE_RISK);
  }

  /** Отримує комбінований рівень ризику для множинних дефектів. */
  public static int getCombinedRiskLevel(Set<DefectType> defects) {
    if (defects.isEmpty()) return 0;

    int maxRisk = defects.stream().mapToInt(DefectType::getRiskLevel).max().orElse(0);

    // Якщо більше ніж один критичний дефект, підвищуємо ризик
    long criticalCount = defects.stream().filter(DefectType::isCritical).count();

    if (criticalCount > 1) {
      maxRisk = Math.min(5, maxRisk + 1);
    }

    return maxRisk;
  }
}
