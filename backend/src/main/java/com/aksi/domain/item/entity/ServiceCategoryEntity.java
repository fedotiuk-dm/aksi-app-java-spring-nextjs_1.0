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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/** Entity для категорій послуг. */
@Entity
@Table(
    name = "service_categories",
    indexes = {
      @Index(name = "idx_service_category_code", columnList = "code", unique = true),
      @Index(name = "idx_service_category_parent", columnList = "parent_id"),
      @Index(name = "idx_service_category_active", columnList = "is_active")
    })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ServiceCategoryEntity extends BaseEntity {

  @NotBlank(message = "Код категорії обов'язковий")
  @Size(max = 50, message = "Код категорії не може бути довше 50 символів")
  @Column(name = "code", unique = true, nullable = false, length = 50)
  private String code;

  @NotBlank(message = "Назва категорії обов'язкова")
  @Size(max = 200, message = "Назва категорії не може бути довше 200 символів")
  @Column(name = "name", nullable = false, length = 200)
  private String name;

  @Size(max = 1000, message = "Опис не може бути довше 1000 символів")
  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  private String description;

  @Column(name = "parent_id")
  private UUID parentId;

  @NotNull(message = "Стандартні дні виконання обов'язкові")
  @Min(value = 1, message = "Стандартні дні виконання повинні бути мінімум 1")
  @Max(value = 30, message = "Стандартні дні виконання не можуть перевищувати 30")
  @Column(name = "standard_days", nullable = false)
  private Integer standardDays;

  @Column(name = "is_active", nullable = false)
  @Builder.Default
  private Boolean isActive = true;

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(
      name = "service_category_materials",
      joinColumns = @JoinColumn(name = "category_id"))
  @Column(name = "material_type", length = 50)
  @Builder.Default
  private List<String> availableMaterials = new ArrayList<>();

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(
      name = "service_category_modifiers",
      joinColumns = @JoinColumn(name = "category_id"))
  @Column(name = "modifier_id")
  @Builder.Default
  private List<UUID> availableModifiers = new ArrayList<>();

  @OneToMany(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id", referencedColumnName = "id")
  @Builder.Default
  private List<PriceListItemEntity> items = new ArrayList<>();

  // ===== BUSINESS МЕТОДИ =====

  /** Перевірити, чи є категорія активною. */
  public boolean isActiveCategory() {
    return Boolean.TRUE.equals(isActive);
  }

  /** Перевірити, чи є категорія батьківською. */
  public boolean isParentCategory() {
    return parentId == null;
  }

  /** Перевірити, чи є категорія дочірньою. */
  public boolean isChildCategory() {
    return parentId != null;
  }

  /** Отримати кількість активних предметів. */
  public long getActiveItemsCount() {
    return items.stream().filter(item -> Boolean.TRUE.equals(item.getIsActive())).count();
  }

  /** Перевірити, чи підтримує категорія матеріал. */
  public boolean supportsMaterial(String materialType) {
    return availableMaterials.contains(materialType);
  }

  /** Перевірити, чи підтримує категорія модифікатор. */
  public boolean supportsModifier(UUID modifierId) {
    return availableModifiers.contains(modifierId);
  }

  /** Додати підтримуваний матеріал. */
  public void addSupportedMaterial(String materialType) {
    if (!availableMaterials.contains(materialType)) {
      availableMaterials.add(materialType);
    }
  }

  /** Видалити підтримуваний матеріал. */
  public void removeSupportedMaterial(String materialType) {
    availableMaterials.remove(materialType);
  }

  /** Додати підтримуваний модифікатор. */
  public void addSupportedModifier(UUID modifierId) {
    if (!availableModifiers.contains(modifierId)) {
      availableModifiers.add(modifierId);
    }
  }

  /** Видалити підтримуваний модифікатор. */
  public void removeSupportedModifier(UUID modifierId) {
    availableModifiers.remove(modifierId);
  }

  /** Активувати категорію. */
  public void activate() {
    this.isActive = true;
  }

  /** Деактивувати категорію. */
  public void deactivate() {
    this.isActive = false;
  }

  /** Перевірити, чи можна видалити категорію. */
  public boolean canBeDeleted() {
    return !isActiveCategory() && getActiveItemsCount() == 0;
  }

  /** Отримати стандартний термін виконання з урахуванням складності. */
  public int getEffectiveStandardDays() {
    if (isParentCategory()) {
      return standardDays;
    }
    // Дочірні категорії можуть мати додатковий час
    return standardDays + 1;
  }
}
