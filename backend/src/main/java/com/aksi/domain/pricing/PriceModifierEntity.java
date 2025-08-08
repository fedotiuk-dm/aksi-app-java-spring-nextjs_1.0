package com.aksi.domain.pricing;

import java.util.List;

import com.aksi.api.pricing.dto.ModifierType;
import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Price modifier entity for additional charges/surcharges on services */
@Entity
@Table(
    name = "price_modifiers",
    uniqueConstraints = @UniqueConstraint(columnNames = {"code"}),
    indexes = {
      @Index(name = "idx_modifier_code", columnList = "code"),
      @Index(name = "idx_modifier_active", columnList = "active"),
      @Index(name = "idx_modifier_type", columnList = "modifier_type")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PriceModifierEntity extends BaseEntity {

  @Column(name = "code", nullable = false, unique = true, length = 50)
  private String code;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "modifier_type", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private ModifierType type;

  @Column(name = "modifier_value", nullable = false)
  private Integer value;

  @Column(name = "jexl_formula", columnDefinition = "TEXT")
  private String jexlFormula;

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(
      name = "modifier_category_restrictions",
      joinColumns = @JoinColumn(name = "modifier_id"),
      indexes = @Index(name = "idx_modifier_category", columnList = "modifier_id, category_code"))
  @Column(name = "category_code", length = 30)
  private List<String> categoryRestrictions;

  @Column(name = "active", nullable = false)
  private boolean active = true;

  @Column(name = "sort_order", nullable = false)
  private Integer sortOrder = 0;
}
