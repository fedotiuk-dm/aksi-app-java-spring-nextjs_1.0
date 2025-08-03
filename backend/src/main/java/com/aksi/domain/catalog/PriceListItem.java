package com.aksi.domain.catalog;

import com.aksi.api.service.dto.ServiceCategoryType;
import com.aksi.api.service.dto.UnitOfMeasure;
import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

/** Price list item entity representing items from price list CSV */
@Entity
@Table(
    name = "price_list_items",
    uniqueConstraints = @UniqueConstraint(columnNames = {"category_code", "catalog_number"}),
    indexes = {
      @Index(name = "idx_price_list_category", columnList = "category_code"),
      @Index(name = "idx_price_list_catalog_number", columnList = "catalog_number"),
      @Index(name = "idx_price_list_active", columnList = "active")
    })
@Getter
@Setter
public class PriceListItem extends BaseEntity {

  @Column(name = "category_code", nullable = false, length = 30)
  @Enumerated(EnumType.STRING)
  private ServiceCategoryType categoryCode;

  @Column(name = "catalog_number", nullable = false)
  private Integer catalogNumber;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "unit_of_measure", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private UnitOfMeasure unitOfMeasure;

  @Column(name = "base_price", nullable = false)
  private Integer basePrice;

  @Column(name = "price_black")
  private Integer priceBlack;

  @Column(name = "price_color")
  private Integer priceColor;

  @Column(name = "active", nullable = false)
  private boolean active = true;
}
