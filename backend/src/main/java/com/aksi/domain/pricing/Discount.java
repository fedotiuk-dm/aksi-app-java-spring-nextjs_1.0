package com.aksi.domain.pricing;

import java.util.List;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Discount entity for customer discounts */
@Entity
@Table(
    name = "discounts",
    uniqueConstraints = @UniqueConstraint(columnNames = {"code"}),
    indexes = {
      @Index(name = "idx_discount_code", columnList = "code"),
      @Index(name = "idx_discount_active", columnList = "active")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Discount extends BaseEntity {

  @Column(name = "code", nullable = false, unique = true, length = 50)
  private String code;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "percentage", nullable = false)
  private Integer percentage;

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(
      name = "discount_excluded_categories",
      joinColumns = @JoinColumn(name = "discount_id"),
      indexes = @Index(name = "idx_discount_excluded", columnList = "discount_id, category_code"))
  @Column(name = "category_code", length = 30)
  private List<String> excludedCategories;

  @Column(name = "active", nullable = false)
  private boolean active = true;

  @Column(name = "sort_order", nullable = false)
  private Integer sortOrder = 0;
}