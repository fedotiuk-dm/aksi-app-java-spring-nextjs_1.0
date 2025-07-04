package com.aksi.domain.item.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.aksi.shared.BaseEntity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/** Entity для модифікаторів цін. */
@Entity
@Table(
    name = "price_modifiers",
    indexes = {
      @Index(name = "idx_price_modifier_code", columnList = "code", unique = true),
      @Index(name = "idx_price_modifier_type", columnList = "modifier_type"),
      @Index(name = "idx_price_modifier_active", columnList = "is_active")
    })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PriceModifierEntity extends BaseEntity {

  @NotBlank(message = "Код модифікатора обов'язковий")
  @Size(max = 50, message = "Код не може бути довше 50 символів")
  @Column(name = "code", unique = true, nullable = false, length = 50)
  private String code;

  @NotBlank(message = "Назва модифікатора обов'язкова")
  @Size(max = 200, message = "Назва не може бути довше 200 символів")
  @Column(name = "name", nullable = false, length = 200)
  private String name;

  @Size(max = 500, message = "Опис не може бути довше 500 символів")
  @Column(name = "description", nullable = false, length = 500)
  private String description;

  @NotBlank(message = "Тип модифікатора обов'язковий")
  @Size(max = 20, message = "Тип не може бути довше 20 символів")
  @Column(name = "modifier_type", nullable = false, length = 20)
  private String modifierType; // PERCENTAGE, FIXED_AMOUNT

  @NotNull(message = "Значення модифікатора обов'язкове")
  @DecimalMin(value = "-10000.0", message = "Значення не може бути менше -10000")
  @DecimalMax(value = "50000.0", message = "Значення не може бути більше 50000")
  @Column(name = "value", nullable = false)
  private Double value;

  @Column(name = "is_active", nullable = false)
  @Builder.Default
  private Boolean isActive = true;

  /** JEXL формула для розрахунку модифікатора Приклад: "currentPrice * (1 + modifierValue/100)" */
  @Size(max = 1000, message = "Формула не може бути довше 1000 символів")
  @Column(name = "jexl_formula", length = 1000)
  private String jexlFormula;

  /** JEXL умова для застосування модифікатора Приклад: "category == 'LEATHER' && quantity > 1". */
  @Size(max = 500, message = "Умова не може бути довше 500 символів")
  @Column(name = "jexl_condition", length = 500)
  private String jexlCondition;

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(
      name = "modifier_applicable_categories",
      joinColumns = @JoinColumn(name = "modifier_id"))
  @Column(name = "category_id")
  @Builder.Default
  private List<UUID> applicableTo = new ArrayList<>();

  // ===== BUSINESS МЕТОДИ =====

  /** Перевірити, чи є модифікатор активним. */
  public boolean isActiveModifier() {
    return Boolean.TRUE.equals(isActive);
  }

  /** Перевірити, чи є модифікатор відсотковим. */
  public boolean isPercentageModifier() {
    return "PERCENTAGE".equals(modifierType);
  }

  /** Перевірити, чи є модифікатор фіксованою сумою. */
  public boolean isFixedAmountModifier() {
    return "FIXED_AMOUNT".equals(modifierType);
  }

  /** Застосувати модифікатор до ціни. */
  public Double applyToPrice(Double basePrice) {
    if (basePrice == null || !isActiveModifier()) {
      return basePrice;
    }

    if (isPercentageModifier()) {
      return basePrice + (basePrice * value / 100.0);
    } else if (isFixedAmountModifier()) {
      return basePrice + value;
    }

    return basePrice;
  }

  /** Розрахувати суму модифікації. */
  public Double calculateModificationAmount(Double basePrice) {
    if (basePrice == null || !isActiveModifier()) {
      return 0.0;
    }

    if (isPercentageModifier()) {
      return basePrice * value / 100.0;
    } else if (isFixedAmountModifier()) {
      return value;
    }

    return 0.0;
  }

  /** Перевірити, чи застосовується до категорії. */
  public boolean isApplicableToCategory(UUID categoryId) {
    return applicableTo.isEmpty() || applicableTo.contains(categoryId);
  }

  /** Додати категорію застосування. */
  public void addApplicableCategory(UUID categoryId) {
    if (!applicableTo.contains(categoryId)) {
      applicableTo.add(categoryId);
    }
  }

  /** Видалити категорію застосування. */
  public void removeApplicableCategory(UUID categoryId) {
    applicableTo.remove(categoryId);
  }

  /** Очистити всі категорії (застосовується до всіх). */
  public void clearApplicableCategories() {
    applicableTo.clear();
  }

  /** Перевірити, чи застосовується до всіх категорій. */
  public boolean isApplicableToAllCategories() {
    return applicableTo.isEmpty();
  }

  /** Активувати модифікатор. */
  public void activate() {
    this.isActive = true;
  }

  /** Деактивувати модифікатор. */
  public void deactivate() {
    this.isActive = false;
  }

  /** Перевірити валідність значення. */
  public boolean hasValidValue() {
    if (value == null) return false;

    if (isPercentageModifier()) {
      return value >= -100.0 && value <= 1000.0; // від -100% до +1000%
    } else if (isFixedAmountModifier()) {
      return value >= -10000.0 && value <= 10000.0; // розумні межі
    }

    return false;
  }

  /** Отримати форматований опис модифікатора. */
  public String getFormattedDescription() {
    StringBuilder result = new StringBuilder();

    if (isPercentageModifier()) {
      if (value > 0) {
        result.append("+").append(value).append("%");
      } else {
        result.append(value).append("%");
      }
    } else if (isFixedAmountModifier()) {
      if (value > 0) {
        result.append("+").append(value).append(" грн");
      } else {
        result.append(value).append(" грн");
      }
    }

    return result.toString();
  }

  // ===== JEXL МЕТОДИ =====

  /** Перевірити, чи має модифікатор JEXL формулу. */
  public boolean hasJexlFormula() {
    return jexlFormula != null && !jexlFormula.trim().isEmpty();
  }

  /** Перевірити, чи має модифікатор JEXL умову. */
  public boolean hasJexlCondition() {
    return jexlCondition != null && !jexlCondition.trim().isEmpty();
  }

  /** Отримати JEXL формулу або фолбек до стандартної. */
  public String getEffectiveFormula() {
    if (hasJexlFormula()) {
      return jexlFormula;
    }

    // Фолбек до стандартної формули
    if (isPercentageModifier()) {
      return "currentPrice * (1 + modifierValue/100)";
    } else if (isFixedAmountModifier()) {
      return "currentPrice + modifierValue";
    }

    return "currentPrice"; // без змін
  }

  /** Отримати JEXL умову або null якщо немає. */
  public String getEffectiveCondition() {
    return hasJexlCondition() ? jexlCondition : null;
  }

  /** Перевірити, чи є модифікатор JEXL-базованим. */
  public boolean isJexlBased() {
    return hasJexlFormula();
  }

  /** Встановити JEXL формулу. */
  public void setJexlFormula(String formula) {
    this.jexlFormula = formula != null ? formula.trim() : null;
  }

  /** Встановити JEXL умову. */
  public void setJexlCondition(String condition) {
    this.jexlCondition = condition != null ? condition.trim() : null;
  }

  /** Очистити JEXL налаштування. */
  public void clearJexlSettings() {
    this.jexlFormula = null;
    this.jexlCondition = null;
  }
}
