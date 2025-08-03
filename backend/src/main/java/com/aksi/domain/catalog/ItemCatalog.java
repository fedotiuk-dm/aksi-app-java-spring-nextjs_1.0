package com.aksi.domain.catalog;

import java.util.HashSet;
import java.util.Set;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/** Item entity representing types of items that can be cleaned. */
@Entity
@Table(
    name = "items",
    indexes = {
      @Index(name = "idx_item_code", columnList = "code", unique = true),
      @Index(name = "idx_item_category", columnList = "category"),
      @Index(name = "idx_item_active", columnList = "active")
    })
@Getter
@Setter
@ToString(exclude = "serviceItems")
public class ItemCatalog extends BaseEntity {

  @Column(name = "code", nullable = false, unique = true, length = 50)
  private String code;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "category", nullable = false, length = 50)
  @Enumerated(EnumType.STRING)
  private ServiceCategoryType category;

  @Column(name = "material", length = 100)
  private String material;

  @Column(name = "care_instructions", columnDefinition = "TEXT")
  private String careInstructions;

  @Column(name = "catalog_number")
  private Integer catalogNumber;

  @Column(name = "unit_of_measure", length = 20)
  @Enumerated(EnumType.STRING)
  private UnitOfMeasure unitOfMeasure;

  @Column(name = "active", nullable = false)
  private boolean active;

  @Column(name = "sort_order")
  private Integer sortOrder;

  @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<ServiceItem> serviceItems = new HashSet<>();
}
