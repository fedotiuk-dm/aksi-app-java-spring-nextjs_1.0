package com.aksi.domain.order.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.aksi.domain.order.enums.DefectType;
import com.aksi.domain.order.enums.ServiceCategory;
import com.aksi.domain.order.enums.StainType;
import com.aksi.shared.BaseEntity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/** JPA Entity для предметів замовлення */
@Entity
@Table(
    name = "order_items",
    indexes = {
      @Index(name = "idx_order_item_order_id", columnList = "orderId"),
      @Index(name = "idx_order_item_category", columnList = "category"),
      @Index(name = "idx_order_item_material", columnList = "material")
    })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class OrderItemEntity extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_id", nullable = false)
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private OrderEntity order;

  @Column(name = "item_name", nullable = false, length = 100)
  private String itemName;

  @Enumerated(EnumType.STRING)
  @Column(name = "category", nullable = false)
  private ServiceCategory category;

  @Column(name = "quantity", nullable = false)
  @Builder.Default
  private Integer quantity = 1;

  @Column(name = "unit", length = 10)
  private String unit; // Використовуємо String для API enum UnitType

  @Column(name = "material", length = 50)
  private String material;

  @Column(name = "color", length = 50)
  private String color;

  @Column(name = "filling", length = 50)
  private String filling;

  @Column(name = "wear_degree")
  private Integer wearDegree;

  @ElementCollection(targetClass = StainType.class)
  @Enumerated(EnumType.STRING)
  @CollectionTable(name = "order_item_stains", joinColumns = @JoinColumn(name = "order_item_id"))
  @Column(name = "stain_type")
  @Builder.Default
  private Set<StainType> stains = new HashSet<>();

  @ElementCollection(targetClass = DefectType.class)
  @Enumerated(EnumType.STRING)
  @CollectionTable(name = "order_item_defects", joinColumns = @JoinColumn(name = "order_item_id"))
  @Column(name = "defect_type")
  @Builder.Default
  private Set<DefectType> defects = new HashSet<>();

  @Column(name = "defect_notes", length = 500)
  private String defectNotes;

  @Column(name = "base_price", precision = 10, scale = 2)
  @Builder.Default
  private BigDecimal basePrice = BigDecimal.ZERO;

  @Column(name = "final_price", precision = 10, scale = 2)
  @Builder.Default
  private BigDecimal finalPrice = BigDecimal.ZERO;

  @ElementCollection
  @CollectionTable(name = "order_item_photos", joinColumns = @JoinColumn(name = "order_item_id"))
  @Column(name = "photo_url")
  @Builder.Default
  private List<String> photos = new ArrayList<>();

  @ElementCollection
  @CollectionTable(name = "order_item_modifiers", joinColumns = @JoinColumn(name = "order_item_id"))
  @AttributeOverrides({
    @AttributeOverride(name = "name", column = @Column(name = "modifier_name")),
    @AttributeOverride(name = "type", column = @Column(name = "modifier_type")),
    @AttributeOverride(name = "value", column = @Column(name = "modifier_value")),
    @AttributeOverride(name = "calculatedAmount", column = @Column(name = "calculated_amount")),
    @AttributeOverride(name = "description", column = @Column(name = "modifier_description"))
  })
  @Builder.Default
  private List<OrderItemModifierEntity> modifiers = new ArrayList<>();

  // Business методи

  /** Перевіряє чи предмет має плями */
  public boolean hasStains() {
    return stains != null && !stains.isEmpty();
  }

  /** Перевіряє чи предмет має дефекти */
  public boolean hasDefects() {
    return defects != null && !defects.isEmpty();
  }

  /** Перевіряє чи предмет потребує спеціальної обробки */
  public boolean requiresSpecialTreatment() {
    return hasStains() && stains.stream().anyMatch(StainType::requiresSpecialTreatment);
  }

  /** Перевіряє чи предмет має критичні дефекти */
  public boolean hasCriticalDefects() {
    return hasDefects() && defects.stream().anyMatch(DefectType::isCritical);
  }

  /** Отримує комбінований рівень ризику */
  public int getCombinedRiskLevel() {
    return DefectType.getCombinedRiskLevel(defects);
  }

  /** Перевіряє сумісність плям з матеріалом */
  public boolean areStainsCompatibleWithMaterial() {
    if (!hasStains() || material == null) {
      return true;
    }
    return stains.stream().allMatch(stain -> stain.isCompatibleWithMaterial(material));
  }

  /** Перевіряє сумісність дефектів з категорією послуги */
  public boolean areDefectsCompatibleWithService() {
    if (!hasDefects() || category == null) {
      return true;
    }
    return defects.stream().allMatch(defect -> defect.isCompatibleWithService(category));
  }

  /** Розраховує знижку через дефекти */
  public BigDecimal calculateDefectDiscount() {
    if (!hasDefects()) {
      return BigDecimal.ZERO;
    }

    return defects.stream()
        .map(defect -> defect.calculateDiscountAmount(basePrice))
        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }

  /** Розраховує фінальну ціну з урахуванням дефектів */
  public BigDecimal calculateFinalPrice() {
    BigDecimal defectDiscount = calculateDefectDiscount();
    return basePrice.subtract(defectDiscount);
  }

  /** Оновлює фінальну ціну */
  public void updateFinalPrice() {
    this.finalPrice = calculateFinalPrice();
  }

  /** Додає пляму */
  public void addStain(StainType stain) {
    if (stains == null) {
      stains = new HashSet<>();
    }
    stains.add(stain);
  }

  /** Додає дефект */
  public void addDefect(DefectType defect) {
    if (defects == null) {
      defects = new HashSet<>();
    }
    defects.add(defect);
    updateFinalPrice(); // Перерахунок після додавання дефекту
  }

  /** Додає фото */
  public void addPhoto(String photoUrl) {
    if (photos == null) {
      photos = new ArrayList<>();
    }
    photos.add(photoUrl);
  }

  /** Перевіряє чи потрібне підтвердження клієнта */
  public boolean requiresClientConsent() {
    return hasCriticalDefects()
        || (hasDefects() && defects.stream().anyMatch(DefectType::requiresClientConsent));
  }

  /** Отримує загальну вартість для кількості */
  public BigDecimal getTotalPrice() {
    return finalPrice.multiply(BigDecimal.valueOf(quantity));
  }

  /** Перевіряє чи матеріал сумісний з категорією */
  public boolean isMaterialCompatibleWithCategory() {
    if (category == null || material == null) {
      return true;
    }
    return category.isCompatibleWithMaterial(material);
  }

  /** Отримує максимальну рекомендовану температуру обробки */
  public int getMaxRecommendedTemperature() {
    if (!hasStains()) {
      return 60; // Стандартна температура
    }

    return stains.stream()
        .mapToInt(StainType::getRecommendedTemperature)
        .min() // Беремо мінімальну для безпеки
        .orElse(60);
  }

  // === МЕТОДИ ДЛЯ РОБОТИ З МОДИФІКАТОРАМИ ===

  /** Перевіряє чи предмет має модифікатори */
  public boolean hasModifiers() {
    return modifiers != null && !modifiers.isEmpty();
  }

  /** Додає модифікатор */
  public void addModifier(OrderItemModifierEntity modifier) {
    if (modifiers == null) {
      modifiers = new ArrayList<>();
    }
    modifier.updateCalculatedAmount(basePrice);
    modifiers.add(modifier);
    updateFinalPriceWithModifiers();
  }

  /** Видаляє модифікатор за назвою */
  public void removeModifier(String modifierName) {
    if (modifiers != null) {
      modifiers.removeIf(modifier -> modifier.getName().equals(modifierName));
      updateFinalPriceWithModifiers();
    }
  }

  /** Розраховує загальну суму всіх модифікаторів */
  public BigDecimal calculateModifiersTotal() {
    if (!hasModifiers()) {
      return BigDecimal.ZERO;
    }

    return modifiers.stream()
        .map(OrderItemModifierEntity::getCalculatedAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }

  /** Розраховує фінальну ціну з урахуванням дефектів ТА модифікаторів */
  public BigDecimal calculateFinalPriceWithModifiers() {
    BigDecimal baseAmount = basePrice;
    BigDecimal modifiersTotal = calculateModifiersTotal();
    BigDecimal defectDiscount = calculateDefectDiscount();

    return baseAmount.add(modifiersTotal).subtract(defectDiscount);
  }

  /** Оновлює фінальну ціну з урахуванням модифікаторів */
  public void updateFinalPriceWithModifiers() {
    this.finalPrice = calculateFinalPriceWithModifiers();
  }

  /** Оновлює всі модифікатори з новою базовою ціною */
  public void recalculateModifiers() {
    if (hasModifiers()) {
      modifiers.forEach(modifier -> modifier.updateCalculatedAmount(basePrice));
      updateFinalPriceWithModifiers();
    }
  }

  /** Отримує модифікатор за назвою */
  public OrderItemModifierEntity getModifierByName(String name) {
    if (!hasModifiers()) {
      return null;
    }
    return modifiers.stream()
        .filter(modifier -> modifier.getName().equals(name))
        .findFirst()
        .orElse(null);
  }

  /** Перевіряє чи є модифікатор з назвою */
  public boolean hasModifier(String name) {
    return getModifierByName(name) != null;
  }

  /** Отримує кількість модифікаторів */
  public int getModifiersCount() {
    return hasModifiers() ? modifiers.size() : 0;
  }

  /** Застосовує текстильний модифікатор */
  public void applyTextileModifier(String name, int percentage, String description) {
    if (!category.allowsTextileModifiers()) {
      throw new IllegalStateException(
          "Категорія " + category + " не підтримує текстильні модифікатори");
    }

    OrderItemModifierEntity modifier =
        OrderItemModifierEntity.createTextileModifier(name, percentage, description);
    addModifier(modifier);
  }

  /** Застосовує шкіряний модифікатор */
  public void applyLeatherModifier(String name, int percentage, String description) {
    if (!category.allowsLeatherModifiers()) {
      throw new IllegalStateException(
          "Категорія " + category + " не підтримує шкіряні модифікатори");
    }

    OrderItemModifierEntity modifier =
        OrderItemModifierEntity.createLeatherModifier(name, percentage, description);
    addModifier(modifier);
  }

  /** Застосовує фіксований модифікатор */
  public void applyFixedModifier(String name, BigDecimal amount, String description) {
    OrderItemModifierEntity modifier =
        OrderItemModifierEntity.createFixedModifier(name, amount, description);
    addModifier(modifier);
  }
}
