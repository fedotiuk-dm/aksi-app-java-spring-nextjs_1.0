package com.aksi.domain.item.entity;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.aksi.domain.item.enums.ModifierType;
import com.aksi.shared.BaseEntity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity for price modifiers (discounts, surcharges, etc.) */
@Entity
@Table(name = "price_modifiers")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceModifierEntity extends BaseEntity {

  @Column(unique = true, nullable = false, length = 50)
  private String code;

  @Column(nullable = false)
  private String name;

  @Column(name = "modifier_type", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private ModifierType type;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal value;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(
      name = "modifier_applicable_categories",
      joinColumns = @JoinColumn(name = "modifier_id"))
  @Column(name = "category_code")
  @Builder.Default
  private Set<String> applicableCategories = new HashSet<>();

  @Column(name = "jexl_formula", columnDefinition = "TEXT")
  private String jexlFormula;

  @Column(nullable = false)
  @Builder.Default
  private Integer priority = 0;

  @Column(nullable = false)
  @Builder.Default
  private Boolean active = true;

  @Column(columnDefinition = "TEXT")
  private String description;

  /**
   * Check if modifier is applicable to the given category
   *
   * @param category the service category code to check
   * @return true if applicable, false otherwise
   */
  public boolean isApplicableToCategory(String category) {
    return applicableCategories.isEmpty() || applicableCategories.contains(category);
  }
}
